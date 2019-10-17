'use strict';
angular.module('app').controller('WorkOrderOnLineHHCtrl', WorkOrderOnLineHHCtrl);
WorkOrderOnLineHHCtrl.$inject = ['$scope', '$uibModalInstance', 'Dialog', 'Form', 'ItemData', 'toastr', 'AjaxService'];
//angular.module('app')
//.controller('WorkOrderOnLineCtrlHH', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
//function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {
function WorkOrderOnLineHHCtrl($scope, $uibModalInstance, Dialog, Form, ItemData, toastr,AjaxService) {
    var vm = this;
    vm.form = Form[ItemData.Id ? 1 : 0];
    vm.Item = {};
    vm.Item2 = ItemData;

    vm.MesList = [];
    vm.Focus = { Order: true, SNCode: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;

    var en = {};
    //en.WorkOrder = vm.Item.WorkOrder;
    en.WorkOrder = vm.Item2.WorOrder;
    AjaxService.ExecPlan("MesMxWOrderHH", "order", en).then(function (data) {
        var mss = "工单 [" + vm.Item.WorkOrder + '] ';
        vm.OrderData = undefined;
        if (!data.data[0] || !data.data[0].WorkOrder) {
            vm.Item.WorkOrder = undefined;
            showError(mss + '  不存在或已完工');
        }
        else {
            vm.OrderData = data.data[0];
            vm.RoutingList = data.data1;
            vm.RoutingData = data.data1[0];
            vm.OrderCount = data.data2[0];
            vm.Item.WorkOrder = vm.Item2.WorOrder;
        }
    });


    //获取包装信息
    AjaxService.GetPlans("MesMxWOrderHH", [{ name: "Status", value: 4, type:"!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })
    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            vm.InCodeSave = angular.copy(vm.Item.InCode);
            vm.Item.InCode = undefined;
            InCodeToDb();
        }
    }
    //使用order
    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            
            AjaxService.ExecPlan("MesMxWOrderHH", "order", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                vm.OrderData = undefined;
                if (!data.data[0] || !data.data[0].WorkOrder) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  不存在或已完工');
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.RoutingList = data.data1;
                    vm.RoutingData = data.data1[0];
                    vm.OrderCount = data.data2[0];
                }
            });
        }
    }

    function InCodeToDb() {//后焊上线
        var IsOk = true;
        if (!vm.OrderData || !vm.RoutingData) {
            showError('不存在或已完工');
            return false;
        }
        if (vm.OrderData.MaxOverCount - vm.OrderCount.ToTalCount <= 0) {
            showError('工单投入量已达最大允许值，不可再投入');
            vm.Item.InCode = undefined;
            return false;
        }
        if (vm.OrderData.Quantity - vm.OrderCount.ToTalCount == 0) {
            AjaxService.PlayVoice('5611.mp3');
            MyPop.ngConfirm({ text: "投入数量已达到生产量, 是否继续投入?" }).then(function (data) {
                if (vm.IsAuto) {
                    Save();//上线
                }
            });
        }
        else if (vm.IsAuto) {
            Save();
        }
    }

    function showError(mes)
    {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function Save() {//上线认证
        var en = {};
        en.WorkOrder = vm.Item.WorkOrder;
        en.InternalCode = vm.InCodeSave;
        en.RoutingId = vm.RoutingData.ID;
        console.log(en);
        vm.promise = AjaxService.ExecPlan("MesMxWOrderHH", "save", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderCount = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
                //打印
                if (vm.RoutingData.IsPrint || vm.IsPrint) {
                    var postData = {}, list = [];

                    list.push(en.InternalCode);

                    postData.ParaData = JSON.stringify({});
                    postData.OutList = list;

                    AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
                        console.log(data);
                    }, function (err) {
                        console.log(err);
                    })
                }
                vm.InCodeSave = undefined;

            }
            else if (data.data[0].MsgType == 'Error') {//一般错误认证
                showError(data.data[0].Msg);
                vm.InCodeSave = undefined;
            }
            else if (data.data[0].MsgType == 'SSError') {
                showError(data.data[0].Msg);
                NgSave();//弹出不良录入         
                vm.InCodeSave = undefined;
            }
        })
    }

    //不良
    function NgSave() {
        var e = {};
        e.RoutingName = vm.RoutingData.RoutingName;//工艺流程
        e.ProcedureName = vm.RoutingData.ProcedureName;//当前工序
        e.MaterialName = vm.OrderData.MaterialName;//产品名称
        e.MaterialCode = vm.OrderData.MaterialCode;//产品编号
        e.WorkOrder = vm.Item.WorkOrder;//工单
        e.boProcedureID = vm.RoutingData.boProcedureID;//工序id
        e.RoutingId = vm.RoutingData.ID;//当前工艺路由
       
        if (vm.Item.InCode == null) {
            e.InCode = vm.InCodeSave;//内控码
        }
        if (vm.InCodeSave == null) {
            e.InCode = vm.Item.InCode;//内控码
        }
        console.log(e);
        Open(e);
    }
    //function Insert() {
    //    Open({});
    //}

    //function Edit(e) {
    //    Open(e);
    //}

    function Open(item) {
        Dialog.OpenDialog("WorkOrderAssNgDialogHH", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }
    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
}
