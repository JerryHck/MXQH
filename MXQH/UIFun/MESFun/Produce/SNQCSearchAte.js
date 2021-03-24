﻿'use strict';

angular.module('app')
.controller('SNQCSearchCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.KeyDonwSnCode = KeyDonwSnCode;

    function Search() {
        PageChange();
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Ser.SN) {
            PageChange();
        }
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlan("MESSNCode", "review", vm.Ser).then(function (data) {
            vm.Data = data;
            if (vm.Data.data3 && vm.Data.data3[0]) {
                var en = { name: "BSN", value: vm.Data.data3[0].InternalCode };
                AjaxService.GetPlans("MESAucAtetest", en).then(function (data2) {
                    vm.ATEData = data2;
                    vm.KeysData = Object.keys(data2[0]);
                })
            }
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESWPOPIEGateTrans", "bsnreview", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);