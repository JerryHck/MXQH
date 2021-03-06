﻿'use strict';

angular.module('app')
.controller('SnCodeDeleteCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.DeleteCode = DeleteCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;

    GetItemRemakList();
    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }



    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.DeleteBy) {
            list.push({ name: "DeleteBy", value: vm.Ser.DeleteBy });
        }
        if (vm.Ser.StartDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.StartDate, type: ">=" });
        }
        if (vm.Ser.EndDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.EndDate, type: "<=" });
        }
        vm.promise = AjaxService.GetPlansPage("MESSnDelete", list, vm.page.index, vm.page.size).then(function (data) {
            vm.DeleteList = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            DeleteCode();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {
        if (vm.IsAuto) {
            DeleteCode2();
        }
        //var en = {};
        //en.name = "InternalCode";
        //en.value = vm.DeleteItem.InternalCode;
        //AjaxService.GetPlan("MESSNCode", en).then(function (data) {
        //    var mss = "生产条码 [" + vm.DeleteItem.InternalCode + '] ';
        //    if (!data.InternalCode) {
        //        vm.DeleteItem.InternalCode = undefined;
        //        //toastr.error(mes);
        //        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有绑定SN码' });
        //    }
        //    else {
        //        vm.SNCode = data.SNCode;
        //        var sub = data.SNCode.substring(0, 2);
        //        if (sub != '83' && sub != '93' && sub != '45' && !checkMonth(sub)) {
        //            vm.DeleteItem.InternalCode = undefined;
        //            //toastr.error(mes);
        //            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '不允许解绑该SN码[' + data.SNCode + ']' });
        //        }
        //        else if (vm.IsAuto) {
        //            DeleteCode2();
        //        }
        //    }
        //});
    }

    function checkMonth(s) {
        var b = false;
        switch (s) {
            case "01":
            case "02":
            case "03":
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "10":
            case "11":
            case "12":
                b = true; break;
        }
        return b;
    }

    function DeleteCode2() {
        var en = angular.copy(vm.DeleteItem);
        vm.DeleteItem = {};
        vm.promise = AjaxService.ExecPlan("MESSnDelete", 'delete', en).then(function (data) {
            if (data.data[0].MesType == 'Error') {
                showError(data.data[0].Msg);
            }
            else if (data.data[0].MesType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderData = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
            }
        });
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESSnDelete", 'excel', vm.Ser).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    function GetItemRemakList() {
        AjaxService.GetPlans("MESCodeDelRemark").then(function (data) {
            vm.ItemRemarkList = data;

        })
    }
}
]);