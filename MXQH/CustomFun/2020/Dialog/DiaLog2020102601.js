'use strict';

angular.module('AppSet')
.controller('WorkOrderWasteCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window', '$rootScope',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window, $rootScope) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.InItem = ItemData;
    vm.IsCha = false;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;
    vm.InsertItem = InsertItem;
    vm.DeleteItem = DeleteItem;

    if (vm.InItem.MO && vm.InItem.MO.DocNo) {
        vm.IsSer = true;
        GetData(vm.InItem.MO.DocNo, 'S');
    }

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
        en.MainID = vm.InItem.ID;
        vm.promise = AjaxService.ExecPlan("MOMateIssue", "check", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
                vm.ThisForm = {};
                vm.DtlList = [];
            }
            else if (data.data[0].MsgType == "Success") {
                if (type != 'S') {
                    toastr.success("单据扫描成功");
                    Preview();
                }
                vm.ThisForm = data.data1[0];
                vm.DtlList = data.data2;
                vm.InDtlList = data.data3;
            }
        });
    }

    function DeleteItem(index) {
        vm.InDtlList.splice(index, 1);
    }

    function InsertItem() {
        if (vm.selectedMate) {
            vm.SelectItem = angular.copy(vm.selectedMate);
            vm.InDtlList = vm.InDtlList || [];
            var b = false;
            for (var i = 0, len = vm.InDtlList.length; i < len; i++) {
                if (vm.InDtlList[i].MateCode == vm.selectedMate.MateCode) {
                    b = true; break;
                }
            }
            if (!b) {
                vm.InDtlList.push(angular.copy(vm.selectedMate));
            }
            vm.selectedMate = undefined;
        }
    }

    function Save() {
        var en = { MOID: vm.ThisForm.ID };

        var list = [];
        for (var i = 0, len = vm.InDtlList.length; i < len; i++) {
            if (vm.InDtlList[i].DumpNum) {
                if (vm.InDtlList[i].DumpNum + vm.InDtlList[i].HaveDump > vm.InDtlList[i].IssuedQty) {
                    toastr.error("行号【" + vm.InDtlList[i].RowNo + "】料号【" + vm.InDtlList[i].MateCode + "】累计损耗数量【" + (vm.InDtlList[i].DumpNum + vm.InDtlList[i].HaveDump) + "】大于领料数量【" + vm.DtlList[i].IssuedQty + "】")
                    return;
                }
                list.push(vm.InDtlList[i]);
            }
        }
        if (list.length == 0) {
            toastr.error("没有填写数据")
            return;
        }
        en.DtlList = JSON.stringify(list);
        en.TempColumns = "DtlList";

        en.DocNo = "";
        var SNList = [{ name: "MESMOWaste", col: "DocNo", parm: "DocNo", charName: "" }];
        en.SNColumns = JSON.stringify(SNList);

        vm.promise = AjaxService.ExecPlan("MOMateIssue", "save", en).then(function (data) {
            toastr.success("储存成功");
            $uibModalInstance.close(true);
        });
    }

    function Preview() {
        var en = {};
        en.TbName = "MESMOWaste";
        en.ClName = "DocNo";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.InItem.DocNo = data.data[0] ? data.data[0].SN : "";
        })
    }

    function OK(item) {
        $uibModalInstance.close(vm.IsCha);
    }
    function Cancel() {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(false);
    }

}]);
