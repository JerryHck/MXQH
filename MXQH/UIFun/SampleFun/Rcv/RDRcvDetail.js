'use strict';
angular.module('app')
.controller('RDRcvDetailCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
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
    vm.SNList = [];
    vm.MesList = [];
    vm.IsSN = 1;
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
        if (vm.IsSN=='0') {
            AjaxService.GetPlan("MesPlanDetail", { name: "WorkOrder", value: vm.SNCode }).then(function (data) {
                vm.WorkOrder = data;
            });
        }
    }
    //编辑
    function Edit(item) {
        for (var i = 0, len = vm.SNList.length; i < len; i++) {
            vm.SNList[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }
    //保存编辑
    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.Progress = vm.EditItem.Progress;
        en.Status = vm.EditItem.Status;
        en.Remark = vm.EditItem.Remark == undefined ? '' : vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("RDRcvDetail", en).then(function (data) {
            toastr.success('更新成功');
            GetDetail();
        });
    }
    //BSN扫描
    function ScanCode(isForce) {
        var en = {};
        if (vm.Item.DocType=='旧料入库') {
            if (vm.Item.MaterialID) {
                en.MaterialID = vm.Item.MaterialID;
            } else {
                toastr.error("请选择料号！");
                return;
            }
        }
        en.RcvID = vm.Item.ID;
        en.IsSN = vm.IsSN;
        en.pageIndex = vm.page.pageIndex;
        en.pageSize = vm.page.pageSize;
        en.SNCode = vm.SNCode;
        en.Remark = vm.Remark == undefined ? '' : vm.Remark;
        en.Status = vm.Status;
        en.Progress = vm.Progress;
        en.DocType=vm.Item.DocType
        en.CreateBy = $rootScope.User.Name;
        vm.promise = AjaxService.ExecPlan("RDRcvDetail", "Scan", en).then(function (data) {            
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
                vm.page.total = data.data2[0].RcvCount;
                vm.Item.RcvCount = data.data2[0].RcvCount;
            }

        });
    }

    //明细
    function GetDetail() {
        vm.promise = AjaxService.ExecPlan("RDRcvDetail", "GetList", GetCondition()).then(function (data) {
            console.log(data);
            vm.SNList = data.data;
            vm.page.total = data.data1[0].Count;
            vm.Item.RcvCount = data.data1[0].Count;
        });
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        GetDetail();
    }
    //查询条件
    function GetCondition() {
        var en = {};
        en.RcvID = vm.Item.ID;
        //list.push({ name: "RcvID", value: vm.Item.ID });
        if (vm.SerSNCode) {
            en.SNCode=vm.SerSNCode
        }
        en.pageIndex = vm.page.pageIndex;
        en.pageSize = vm.page.pageSize;
        return en;
    }
    //删除SN编码
    function ClearBSN(sncode) {
        var en = {};
        if (sncode) {
            en.SNCode = sncode;
        }
        en.RcvID = vm.Item.ID;
        vm.promise = AjaxService.ExecPlan('RDRcvDetail', 'Delete', en).then(function (data) {
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