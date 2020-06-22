'use strict';
angular.module('app')
.controller('OverInputDialogCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window','$uibModalInstance','ItemData',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window, $uibModalInstance,ItemData) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.GetMoInfo = GetMoInfo;
    vm.Item = ItemData.ID ? ItemData : { Status: 0 };
    vm.IsEdit = ItemData.ID ? true : false;
    Init();
    console.log($rootScope.User);
    function Init() {
        if (ItemData.ID) {
            GetMoInfo(ItemData.WorkOrderID);
        } else {
            GetDocNo();
        }
    }
    //function Search() {
    //    //1、SourceHelper DLL文件名
    //    //2、SourceHelper.SQLHelper Class全名
    //    //3、TestDll 调用的函数
    //    //4、参数        
    //    AjaxService.CallDll('Mes4OA', 'Mes4OA.Test4OA', 'TestFun', { json: "jsons" }).then(function (data) {         
    //        console.log(data);
    //    })
    //}

    function GetMoInfo(id) {
        AjaxService.ExecPlan("MesPlanDetail", "GetMO", { WorkOrderID: id }).then(function (data) {
            if (data.data.length > 0) {
                vm.Item.MaterialCode = data.data[0].MaterialCode;
                vm.Item.MaterialName = data.data[0].MaterialName;
                vm.Item.Quantity = data.data[0].Quantity;
                vm.Item.CompleteQty = data.data[0].CompleteQty;
                vm.Item.DumpQty = data.data[0].DumpQty;
                vm.Item.TotalStartQty = data.data[0].TotalStartQty;                
                vm.Item.TotalOnLineQty = data.data[0].TotalOnLineQty;
                vm.Item.OnLineQty = data.data[0].OnLineQty;
                vm.Item.WorkOrder = data.data[0].WorkOrder;
            }             
        });
    }
    //保存
    function Save(obj) {
        vm.Item.CreateBy = $rootScope.User.UserNo;
        vm.Item.ModifyBy = $rootScope.User.Name;
        if (!vm.Item.Reason) {
            vm.Item.Reason = "";
        }
        var en = {};
        var li = [];
        li.push(vm.Item);
        en.EntityInfo = JSON.stringify(li);
        en.TempColumns = "EntityInfo";
        if (vm.Item.ID) {//编辑
            if (vm.Item.Status==1) {
                toastr.error("核准中单据不允许修改！");
                return;
            }
            vm.promise = AjaxService.ExecPlan("OverInput", "Update",en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    if (vm.Item.Status == 0 && obj == '1') {//存储并提交到OA审批
                        Approve(vm.Item);
                    } else {
                        $uibModalInstance.close('1');
                    }
                    
                } else {
                    toastr.success(data.data[0].Msg);
                }
                
            });
        } else {
            if (vm.Item.Quantity>vm.Item.OnLineQty) {
                toastr.error("当前工单有效投入数小于工单数，无需申请超投！！");
                return;
            }
            var SNList = [{ name: "OverInput", col: "DocNo", parm: "DocNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.ListNo = "";
            vm.promise = AjaxService.ExecPlan("OverInput", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    if (obj == '1') {//存储并提交到OA审批
                        Approve(vm.Item);
                    } else {
                        $uibModalInstance.close('1');
                    }
                    
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
        
    }

    //自动生成计划序号
    function GetDocNo() {
        var en = { TbName: "OverInput", ClName: "DocNo", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.DocNo = data.data[0].SN;
        })
    }


    function Cancel(item) {
        $uibModalInstance.close('1');
    }


    //提交流程到OA
    function Approve(item) {

        AjaxService.ExecPlan("MesPlanDetail", "GetMO", { WorkOrderID: item.WorkOrderID }).then(function (data) {
            if (data.data.length > 0) {
                var oaItem = {};
                oaItem.CreateBy = item.CreateBy;
                oaItem.DocNo = item.DocNo;
                oaItem.WorkOrder = item.WorkOrder;
                oaItem.OverInputQty = item.OverInputQty;
                oaItem.Status = item.Status;
                oaItem.Reason = item.Reason;
                oaItem.MaterialCode = data.data[0].MaterialCode;
                oaItem.MaterialName = data.data[0].MaterialName;
                oaItem.Quantity = data.data[0].Quantity;
                oaItem.CompleteQty = data.data[0].CompleteQty;
                oaItem.DumpQty = data.data[0].DumpQty;
                oaItem.TotalStartQty = data.data[0].TotalStartQty;
                oaItem.OnLineQty = data.data[0].OnLineQty;
                console.log(JSON.stringify(oaItem));
                //vm.promise = AjaxService.CallDll('Mes4OA', 'Mes4OA.OAWorkFlow', 'CreateWorkFlowByJson', { planName: "OverInput4OA", json: JSON.stringify(oaItem) }).then(function (data) {
                //    console.log(data);
                //})
                $uibModalInstance.close('1');
            }
        });

    }

}
])