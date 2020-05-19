'use strict';
angular.module('app')
.controller('TestDetailCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Cancel = Cancel;
    vm.Item = ItemData;
    vm.page = { pageIndex: 1, pageSize: 12 };
    vm.GetDetail = GetDetail;
    vm.SaveEdit = SaveEdit;
    vm.Edit = Edit;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.Search = Search;
    vm.ClearBSN = ClearBSN;
    vm.IsPass = '1';
    vm.SNList = [];
    vm.MesList = [];
    vm.IsOK = { Table: 'AgingTestIsPass', Column: 'IsPass' };
    Init();
    //Init
    function Init() {
        GetDetail();
    }
    //#region

    //#endregion
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.SNCode) {
            ScanCode(false);
        }
    }
    //编辑
    function Edit(item) {
        for (var i = 0, len = vm.SNList.length; i < len; i++) {
            vm.SNList[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.EditItem.IsPass = vm.EditItem.IsPass ? '1' : '0';
        item.IsEdit = true;
    }
    //保存编辑
    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.IsPass = vm.EditItem.IsPass;
        en.Remark = vm.EditItem.Remark == undefined ? '' : vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("TestDetail", en).then(function (data) {            
            toastr.success('更新成功');
            GetDetail();
        });
    }
    //BSN扫描
    function ScanCode(isForce) {        
        var en = {};
        en.TestRecordID = vm.Item.ID;
        en.pageIndex = vm.page.pageIndex;
        en.pageSize = vm.page.pageSize;
        en.SNCode = vm.SNCode;
        en.IsPass = vm.IsPass;
        en.Remark = vm.Remark == undefined ? '' : vm.Remark;
        en.CreateBy = $rootScope.User.Name;
        console.log(en)
        vm.promise = AjaxService.ExecPlan("TestRecord", "Scan", en).then(function (data) {
            if (data.data[0].MsgType == '0') {//Error
                toastr.error(data.data[0].Msg);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
                vm.SNCode = undefined;
                vm.Remark = undefined;
            } else if (data.data[0].MsgType == '1') {//Scan
                vm.SNCode = undefined;
                vm.Remark = undefined;
                toastr.success(data.data[0].Msg);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.SNList = data.data1;
                vm.page.total = data.data2[0].TestCount;
                vm.Item.TestCount = data.data2[0].TestCount;
                vm.Item.UnPassCount = data.data2[0].UnPassCount;
            }

        });
    }

    //明细
    function GetDetail() {        
        vm.promise = AjaxService.GetPlansPage("TestDetail", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {            
            vm.SNList = data.List;
            vm.page.total = data.Count;
            vm.Item.TestCount = data.Count;
        });
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        GetDetail();
    }
    //查询条件
    function GetCondition() {
        var list = [];
        list.push({ name: "TestRecordID", value: vm.Item.ID });
        if (vm.SerSNCode) {
            list.push({ name: "SNCode", value: vm.SerSNCode });
        }
        return list;
    }
    //删除SN编码
    function ClearBSN(sncode) {
        var en = {};
        if (sncode) {
            en.SNCode = sncode;
        }
        en.TestRecordID = vm.Item.ID;
        vm.promise = AjaxService.ExecPlan('TestDetail', 'Delete', en).then(function (data) {
            if (data.data[0].MsgType == '1') {
                toastr.success(data.data[0].Msg);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
                GetDetail();
            } else {
                toastr.error(data.data[0].Msg);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg });
            }
            
        });
    }

    function Cancel() {
        $uibModalInstance.close('');
    }
}
])