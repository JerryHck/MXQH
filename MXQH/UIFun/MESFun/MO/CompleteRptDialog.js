'use strict';
angular.module('app')
.controller('CompleteRptDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Item = {};
    vm.Save = Save;
    vm.Cancel = Cancel;
    // vm.SelectProduct = SelectProduct;//选择料号
    vm.SelectWorkOrder = SelectWorkOrder;
    Init();
    //初始化
    function Init() {
        if (ItemData.ID) {//编辑
            vm.Item = ItemData;
            GetTotalCompleteQty(vm.Item.WorkOrderID);
        } else {//新增
            vm.Item.CompleteDate = GetCurrentDate();
        }
    }
    //累计完工数量
    function GetTotalCompleteQty(workorderid)
    {
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "GetTotalQty", { WorkOrderID: workorderid }).then(function (data) {
            vm.TotalCompleteQty = data.data[0].CompleteQty;
        });
    }
    //保存
    function Save() {
        var en = {};
        var li = [];
        //if (vm.Item.CompleteQty<vm.Item.ActualRcvQty) {
        //    toastr.error('完工数量不能小于实际入库数量');
        //    return;
        //}
        vm.Item.Quantity = undefined;
        li.push(vm.Item);
        en.EntityInfo = JSON.stringify(li);
        en.TempColumns = "EntityInfo";
        if (vm.Item.ID) {//编辑操作
            vm.promise = AjaxService.ExecPlan("U9MoCompleteRpt", "GetQty", { WorkOrder: vm.Item.WorkOrder }).then(function (data) {
                en.CompleteQty = data.data[0].CompleteQty;
                vm.promise = AjaxService.ExecPlan("CompleteRpt", "Update", en).then(function (data) {
                    if (data.data[0].MsgType == "0") {
                        toastr.error(data.data[0].Msg);
                    } else {
                        toastr.success(data.data[0].Msg);
                        $uibModalInstance.close("1");
                    }
                }).catch(function (data) {
                });
            });
         
        } else {//新增操作
            var SNList = [{ name: "CompleteRpt", col: "DocNo", parm: "ListNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.ListNo = "";
            vm.promise = AjaxService.ExecPlan("CompleteRpt", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    var returnData = "1";
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        }
    }

    //取消
    function Cancel() {
        $uibModalInstance.close("1");
    }

    ////选择料号
    //function SelectProduct() {
    //    var resolve = {
    //        ItemData: function () {
    //            return {};
    //        }
    //    }
    //    Dialog.open("MesMaterialSer", resolve).then(function (data) {
    //        if (data.Id) {
    //            vm.Item.MaterialID = data.Id;
    //            vm.Item.MaterialCode = data.MaterialCode;
    //            vm.Item.MaterialName = data.MaterialName;
    //        }
    //    }).catch(function (reason) {

    //    });
    //}
    //选择工单
    function SelectWorkOrder() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("WorkOrderSer", resolve).then(function (data) {
            if (data.ID) {
                vm.Item.WorkOrderID = data.ID;
                vm.Item.WorkOrder = data.WorkOrder;
                vm.Item.MaterialID = data.MaterialID;
                vm.Item.MaterialCode = data.MaterialCode;
                vm.Item.MaterialName = data.MaterialName;
                GetTotalCompleteQty(data.ID);
            }
        }).catch(function (reason) {

        });
    }

    //获取当前日期
    function GetCurrentDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var rq = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
        return rq;
    }

}
])