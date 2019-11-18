'use strict';

angular.module('app')
.controller('WorkOrderAGCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { Order: false, InCode: true, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto =true ;
    vm.Ageing = '0'; // 为0 是老化上线    1为老化下线
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.InCodeToDb = InCodeToDb;
    //vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    //vm.ChangePro = ChangePro;
    vm.IsFisnish = true;

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.IsPass = { Table: 'AgingTestIsPass', Column: 'IsPass' };

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            if (vm.IsFisnish) {
                vm.InCodeControl = angular.copy(vm.Item.InCode);
                
                InCodeToDb();
            }
            else {
                showError("您扫描太快了，请等待系统处理完成")
            }
        }
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function InCodeToDb() {
        
        if (vm.InCodeControl == undefined) return;
        var en = {};
        en.InternalCode = vm.InCodeControl;
        AjaxService.ExecPlan("MesMxAgeingTest", 'ass', en).then(function (data) {
            if (data.data[0].MsgType == 'Error') {
                vm.Item.InCode = undefined;
                showError(data.data[0].Msg);
            }
            else if (data.data[0].MsgType == 'Success') {
                vm.OrderData = data.data1[0];
                vm.ProcedureList = data.data2;
                vm.ProcedureItem = vm.ThisWo == vm.OrderData.ID ? vm.ProcedureItem : undefined;
                vm.ThisWo = vm.OrderData.ID;
                if (vm.Ageing == '0') {//上线
                    SaveUp();
                } else if (vm.Ageing == '1') {//下线
                    SaveDown();
                }
                   
            }
        });
    }

    function SaveUp() {
        var en = {};
        vm.Item.InCode = undefined;
        en.InternalCode = vm.InCodeControl;
        vm.promise = AjaxService.ExecPlan("MesMxAgeingTest", "SaveUp", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.PassCount = data.data1[0].ToTalCount;
                AjaxService.PlayVoice('success.mp3');
                vm.InCodeControl = undefined;
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeControl = undefined;
            }
            vm.IsFisnish = true;
        })
    }

    function SaveDown() {
        var en = {};
        vm.Item.InCode = undefined;
        en.InternalCode = vm.InCodeControl;
        vm.promise = AjaxService.ExecPlan("MesMxAgeingTest", "SaveDown", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.PassCount = data.data1[0].ToTalCount;
                AjaxService.PlayVoice('success.mp3');
                vm.InCodeControl = undefined;
            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeControl = undefined;
            }
            vm.IsFisnish = true;
        })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesAgingTest", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MesAgingTest", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: '%' + vm.Ser.InternalCode + '%' });
        }
        if (vm.Ser.MaterialCode) {
            list.push({ name: "MaterialCode", value: '%' + vm.Ser.MaterialCode + '%' });
        }
        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: '%' + vm.Ser.WorkOrder + '%' });
        }
        if (vm.Ser.IsPass) {
            list.push({ name: "IsPass", value:vm.Ser.IsPass });
        }

        return list;
    }
  
}
]);