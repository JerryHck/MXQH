﻿'use strict';

angular.module('app')
.controller('SnWeigthCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = {};
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.SnWeigth = SnWeigth;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;
    vm.ChangeMonitor = GetWeigth;

    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }
    //获取kom口信息
    AjaxService.GetComPortList().then(function (data) {
        vm.ComList = JSON.parse(data);
        vm.ComName = vm.ComList[0];
        GetWeigth();
    })

    function GetWeigth() {
        AjaxService.GetComWeigth(vm.ComName || "Com1", function (data) {
            console.log(data);
            if (data.MesType == "Success") {
                $scope.$apply(function () {
                    vm.Weigth = data.Data;
                });
            }
        });
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
        }
        vm.promise = AjaxService.GetPlansPage("MESSnCodeWeigth", list, vm.page.index, vm.page.size).then(function (data) {
            vm.DeleteList = data.List;
            vm.page.total = data.Count;
        });
    }


    //计重录入
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.SNCode && vm.Weigth) {
            console.log()
            SnWeigth();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function SnWeigth() {
        if (!vm.Weigth) {
            toastr.error("重量还未输入");
            return;
        }
        var en = { SNCode: vm.SNCode, Weigth: vm.Weigth };
        AjaxService.ExecPlan("MESSnCodeWeigth", "weigth", en).then(function (data) {
            vm.Range = data.data[0];
            if (data.data1[0].MsgType == "Error") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data1[0].MsgText });
                AjaxService.PlayVoice('error.mp3');
            }
            else if (data.data1[0].MsgType == "Success") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data1[0].MsgText });
                vm.Weigth = undefined;
                console.log(vm.Range)
                AjaxService.PlayVoice('success.mp3');
            }
            vm.SNCode = undefined;
        });
    }

    function ExportExcel() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("MESSnCodeWeigth", list).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }
}
]);