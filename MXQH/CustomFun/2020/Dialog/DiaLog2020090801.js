'use strict';

angular.module('AppSet')
.controller('BlMOOSLabelImportCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.WorkOrder ? 1 : 0];    vm.Item = angular.copy(ItemData);;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.ImportFile = ImportFile;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.CalToOut = CalToOut;

    //获取包装信息-未完工的资料
    AjaxService.GetPlans("MesMxWOrder", [
        //{ name: "Status", value: 4, type: "!=" },
        { name: "WorkOrder", value: "AMO%", type: "not like", action: "" },
        { name: "WorkOrder", value: "HMO%", type: "not like", action: "and" }
    ]).then(function (data) {
        vm.OrderList = data;
        for (var i = 0, len = vm.OrderList.length; i < len; i++) {
            vm.OrderList[i].FirstChar = vm.OrderList[i].WorkOrder.substring(0, 1);
        }
    })


    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorkOrder";
            en.value = vm.Item.WorkOrder;
            AjaxService.GetPlan("MESPackageMain", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.ID) {
                    vm.Item.WorkOrder = undefined;
                    toastr.error(mss + '  不存在或未进行包装登记');
                }
                else {
                    vm.PackMain = data;
                    vm.PackMain.ToTalBox = Math.ceil(vm.PackMain.Order.Quantity / vm.PackMain.PerBoxQuantity);
                    
                    AjaxService.GetPlan("BlMOPackOSLabel", en).then(function (data) {
                        vm.BLOSData = data;
                        CalToOut(vm.PackMain.ToTalBox, vm.BLOSData.PerPackNum);
                    })
                }
            });
        }
    }

    function CalToOut(box, per) {
        per = per == 0 ? 1 : per;
        vm.NeedCount = Math.ceil(box / per);
    }

    function ImportFile(fileData) {
        var en = { fileName: fileData.AttachSn + fileData.FileType, MOID:  vm.PackMain.AssemblyPlanDetailID.toString() };
        vm.promise = AjaxService.Custom("GetOutLabelList", en).then(function (data) {
            vm.OSNlist = data;
        })
    }

    function Save() {
        var en = { fileName: vm.FileData.AttachSn + vm.FileData.FileType };
        en.strJson = JSON.stringify({ ID: vm.PackMain.AssemblyPlanDetailID, PerPackNum: vm.BLOSData.PerPackNum, PrintNum: vm.BLOSData.PrintNum, Remark: "" });
        en.listJson = JSON.stringify(vm.OSNlist || []);
        en.fileName = en.fileName || '';
        vm.promise = AjaxService.Custom("SaveOutLebel", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText)
                vm.ErrList = data.data1;
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success("保存成功")
                $uibModalInstance.close();
            }
        })
    };

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
