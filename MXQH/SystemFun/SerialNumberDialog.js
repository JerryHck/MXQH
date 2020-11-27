'use strict';
angular.module('app').controller('SerialNumberDialogCtrl', SerialNumberDialogCtrl);

SerialNumberDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'MyPop', 'Form', 'ItemData', 'toastr', 'AjaxService'];

function SerialNumberDialogCtrl($scope, $uibModalInstance, MyPop, Form, ItemData, toastr, AjaxService) {

    var vm = this;
    vm.form = Form[ItemData.ClName ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.isExists = isExists;
    vm.AddCom = AddCom;
    vm.Item.Compose = vm.Item.Compose == undefined || vm.Item.Compose == null ? [] : vm.Item.Compose;
    vm.Item.StsInfo = "S";
    vm.Item.IsByPara = vm.Item.IsByPara ? '1' : '0';

    vm.RSOption = { Table: "SerialNumber", Column: "ResetSerial" };
    vm.CTOption = { Table: "SerialNumber", Column: "CharType" };

    vm.DragCom = DragCom;
    vm.DropCom = DropCom;
    vm.DeleteCom = DeleteCom;
    vm.AddCom = AddCom;
    vm.PreView = PreView;
    vm.PreViewOnly = PreViewOnly;
    vm.GetOneSn = GetOneSn;

    for (var i = 0, len = vm.Item.Compose.length; i < len; i++) {
        if (vm.Item.Compose[i].CharType == "YC") {
            vm.Item.Compose[i].YCYear = parseInt(vm.Item.Compose[i].CValue.substr(0, 4));
            vm.Item.Compose[i].CTo = vm.Item.Compose[i].CValue.substr(4, 1)
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 7 ? vm.Item.Compose[i].CValue.substr(7) : undefined;
        }
        else if (vm.Item.Compose[i].CharType == "MC") {
            vm.Item.Compose[i].MCMonth = vm.Item.Compose[i].CValue.substr(0, 2);
            vm.Item.Compose[i].CTo = vm.Item.Compose[i].CValue.substr(2, 1)
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 5 ? vm.Item.Compose[i].CValue.substr(5) : undefined;
        }
        else if (vm.Item.Compose[i].CharType == "DC") {
            vm.Item.Compose[i].MCMonth = vm.Item.Compose[i].CValue.substr(0, 2);
            vm.Item.Compose[i].CTo = vm.Item.Compose[i].CValue.substr(0, 1)
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 3 ? vm.Item.Compose[i].CValue.substr(3) : undefined;
        }
        else if (vm.Item.Compose[i].CharType == "SER" && vm.Item.Compose[i].CValue.length > 1) {
            vm.Item.Compose[i].CTo = vm.Item.Compose[i].CValue.substr(0, 1)
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 3 ? vm.Item.Compose[i].CValue.substr(3) : undefined;
        }
        else if ((vm.Item.Compose[i].CharType == "CarryUp" || vm.Item.Compose[i].CharType == "CarryDown") && vm.Item.Compose[i].CValue.length > 1) {
            vm.Item.Compose[i].CTo = "";
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 2 ? vm.Item.Compose[i].CValue.substr(2) : undefined;
        }
        else if (vm.Item.Compose[i].CharType == "YearPre3To") {
            vm.Item.Compose[i].YearPre3 = parseInt(vm.Item.Compose[i].CValue.substr(0, 3));
            vm.Item.Compose[i].CTo = vm.Item.Compose[i].CValue.substr(3, 1)
            vm.Item.Compose[i].CEx = vm.Item.Compose[i].CValue.length > 6 ? vm.Item.Compose[i].CValue.substr(6) : undefined;
        }
    }

    function AddCom() {
        var en = angular.copy(vm.NewCom);
        en.CValue = en.CValue || '';
        vm.Item.Compose.push(angular.copy(vm.NewCom));
        vm.NewCom = {};
    }

    //储存
    vm.Save = function () {
        AjaxService.ExecPlan("SerialNumberSet", "save", GetSaveData()).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(vm.Item);
        })
    };

    function GetOen() {
        var list = [];
        list.push({ name: "TbName", value: vm.Item.TbName });
        list.push({ name: "ClName", value: vm.Item.ClName });
        vm.promise = AjaxService.GetPlans("SerialNumberInfo", list).then(function (data) {
            vm.Item.Info = data;
        });
    }

    function DragCom(com, index) {
        vm.ComIndex = index;
    }

    function DropCom(com, index) {
        var en = angular.copy(com);
        vm.Item.Compose.splice(vm.ComIndex, 1);
        vm.Item.Compose.splice(index, 0, en);
    }

    function DeleteCom(index) {
        MyPop.ngConfirm({ text: "确定要删除该编码序列吗" }).then(function () {
            vm.Item.Compose.splice(index, 1);
        })
    }

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.TbName && vm.Item.ClName) {
            var en = [{ name: "TbName", value: vm.Item.TbName },
                { name: "ClName", value: vm.Item.ClName },
            ];
            AjaxService.GetPlan('SerialNumberSet', en).then(function (data) {
                vm.DialogForm.TbName.$setValidity('unique', !data.TbName);
                vm.DialogForm.ClName.$setValidity('unique', !data.TbName);
            });
        }
    }

    function PreView() {
        AjaxService.ExecPlan("SerialNumberSet", "save", GetSaveData()).then(function (data) {
            vm.PKData = data.data[0];
            toastr.success('储存成功');
            vm.form = Form[1];
        })
    }

    function GetOneSn() {
        var en = {};
        en.TbName = vm.Item.TbName;
        en.ClName = vm.Item.ClName;
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "getSn", en).then(function (data) {
            vm.PKData = data.data[0];
            GetOen();
        })
    }

    function PreViewOnly() {
        var en = {};
        en.TbName = vm.Item.TbName;
        en.ClName = vm.Item.ClName;
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.PKData = data.data[0];
        })
    }

    function GetSaveData() {
        var en = angular.copy(vm.Item);
        en.CreateBy = undefined;
        en.ModifyDate = undefined;
        en.Action = vm.form.index > 0 ? "U" : "I";
        var listCom = [];
        for (var i = 0, len = vm.Item.Compose.length; i < len; i++) {
            var com = vm.Item.Compose[i];
            if (com.CharType == "YC") {
                com.CValue = com.YCYear + com.CTo + (com.CEx ? "Ex" : "") + (com.CEx||"");
            }
            else if (com.CharType == "MC") {
                com.CValue = com.MCMonth + com.CTo + (com.CEx ? "Ex" : "") + (com.CEx || "");
            }
            else if (com.CharType == "SER" || com.CharType == "DC") {
                com.CValue = (com.CTo || "") + (com.CEx ? "Ex" : "") + (com.CEx || "");
            }
            else if ((vm.Item.Compose[i].CharType == "CarryUp" || vm.Item.Compose[i].CharType == "CarryDown")) {
                com.CValue = (com.CEx ? "Ex" : "") + (com.CEx || "");
            }
            else if (com.CharType == "YearPre3To") {
                com.CValue = com.YearPre3 + com.CTo + (com.CEx ? "Ex" : "") + (com.CEx || "");
            }
            com.CValue = com.CValue || "";
            com.PartChar = com.PartChar || "";
            com.CharOrder = i;
            listCom.push(com);
        }
        en.IsByPara = en.IsByPara||'0';
        en.StsInfo = en.StsInfo || 'S';
        en.Compose = JSON.stringify(listCom);
        en.Info = JSON.stringify(vm.Item.Info || []);
        en.TempColumns = "Compose,Info";
        return en;
    }

}
