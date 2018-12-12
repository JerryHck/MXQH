'use strict';

angular.module('app')
.controller('OrderOnLineCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = { CreateBy: $rootScope.User.UserNo };
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


    //获取包装信息
    AjaxService.GetPlans("MESOrder", [{name:"ExtendOne", type:"null"}]).then(function (data) {
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
            InCodeToDb();
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorOrder) {
            var en = {};
            en.WorOrder = vm.Item.WorOrder;
            AjaxService.ExecPlan("MESOrderOnLine", "order", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorOrder + '] ';
                vm.OrderData = undefined;
                if (!data.data[0] || !data.data[0].WorOrder) {
                    vm.Item.WorOrder = undefined;
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

    function InCodeToDb() {
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
        if (vm.OrderData.Quantity - vm.OrderCount.ToTalCount <= 0) {
            MyPop.ngConfirm({ text: "投入数量已达到生产量, 是否继续投入?" }).then(function (data) {
                Check();
            });
        }
        else {
            Check();
        }
    }

    function showError(mes)
    {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function Check() {
        var en = {};
        en.name = "InternalCode";
        en.value = vm.Item.InCode;
        AjaxService.GetPlan("InternalCode", en).then(function (data) {
            var mss = "内控码 [" + vm.Item.InCode + '] ';
            if (!data.InternalCode) {
                vm.Item.InCode = undefined;
                showError(mss + '  不存在');
            }
            else if (vm.IsAuto) {
                Save();
            }
        });
    }

    function Save() {
        var en = {};
        en.WorOrder = vm.Item.WorOrder;
        en.InternalCode = vm.Item.InCode;
        en.RoutingId = vm.RoutingData.ID;
        en.CreateBy = $rootScope.User.UserNo;
        vm.promise = AjaxService.ExecPlan("MESOrderOnLine", "save", en).then(function (data) {
            if (data.data[0].MsgType == 'Seccuss') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderCount = data.data1[0];
                //打印
                if (vm.RoutingData.IsPrint) {
                    var postData = {}, list = [];

                    list.push(en.InternalCode);

                    postData.ParaData = JSON.stringify({});
                    postData.OutList = JSON.stringify(list);

                    AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
                        console.log(data);
                    }, function (err) {
                        console.log(err);
                    })
                }
                vm.Item.InCode = undefined;

            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.Item.InCode = undefined;
            }
        })
    }

    //不良
    function NgSave() {

    }
}
]);