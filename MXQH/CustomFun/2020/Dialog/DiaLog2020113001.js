'use strict';

angular.module('AppSet')
.controller('U9LLCheckInDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.InItem = ItemData;
    vm.IsCha = false;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;

    GetData(vm.InItem.PickDocNo, 'S');

    //获取备料单信息
    AjaxService.GetPlans("vwLLMOIssueDoc", [{ name: "DocState", value: 2, type: "!=" }
        , { name: "Cancel_Canceled", value: false, type: "=", action: "and" }
    ]).then(function (data) {
        vm.LLDocList = data;
    })

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.ThisForm.DocNo) {
            GetData(vm.ThisForm.DocNo, 'G');
        }
    }

    function GetData(docNo, type) {
        if (!docNo) return;
        var en = {};
        en.DocNo = docNo;
        en.SerType = type;
        vm.promise = AjaxService.ExecPlan("U9MOIssueDocCheck", "getLL", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
                vm.ThisForm = {};
                vm.DtlList = [];
            }
            else if (data.data[0].MsgType == "Success") {
                if (type == 'S') {
                    vm.ThisForm = data.data1[0];
                    vm.DtlList = data.data2;
                    vm.ThisForm.Remark = vm.InItem.Remark;
                    vm.ThisForm.NeedTime = vm.InItem.NeedTime;
                }
                else if (type != 'S') {
                    AjaxService.GetPlan("WMSPicking", { name: "PickDocID", value: data.data1[0].ID }).then(function (data2) {
                        if (data2.ID) {
                            toastr.error('单据【' + docNo + '】已经在【' + data2.RegTime + '】进行过确认登记');
                            vm.ThisForm = {};
                            vm.DtlList = [];
                        }
                        else {
                            vm.ThisForm = data.data1[0];
                            vm.ThisForm.NeedTime = vm.ThisForm.BusinessCreatedOn;
                            vm.DtlList = data.data2;
                            toastr.success("单据扫描成功");
                        }
                    })
                }
            }
        });
    }

    function Save() {
        var en = {};
        en.PickDocID = vm.ThisForm.ID;
        en.PickDocNo = vm.ThisForm.DocNo;
        en.WorkOrder = vm.ThisForm.WorkOrder;
        en.MOMateCode = vm.ThisForm.MOMateCode;
        en.MOMateName = vm.ThisForm.MOMateName;
        en.MateSpecs = vm.ThisForm.MOMateSPECS;
        en.NeedTime = vm.ThisForm.NeedTime;
        en.Remark = vm.ThisForm.Remark;
        en.DtlList = JSON.stringify(vm.DtlList);
        en.TempColumns = "DtlList";
        vm.promise = AjaxService.ExecPlan("WMSPicking", "save", en).then(function (data) {

            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                vm.ThisForm = {};
                vm.DtlList = [];
                vm.IsCha = true;
                toastr.success("登记成功");
            }
        });
    }

    function OK(item) {
        $uibModalInstance.close(vm.IsCha);
    }
    function Cancel() {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(vm.IsCha);
    }

}]);