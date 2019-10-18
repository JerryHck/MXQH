'use strict';

angular.module('app')
.controller('WPOAteSerCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.a_BSN) {
            list.push({ name: "BSN", value: vm.Ser.a_BSN });
        }
        if (vm.Ser.a_MODEL_NAME) {
            list.push({ name: "MODEL_NAME", value: vm.Ser.a_MODEL_NAME });
        }
        if (vm.Ser.a_STATE) {
            list.push({ name: "STATE", value: vm.Ser.a_STATE });
        }
        vm.promise = AjaxService.GetPlansPage("WPOAtetest_Out", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_BSN) {
            list.push({ name: "BSN", value: vm.Ser.a_BSN });
        }
        if (vm.Ser.a_MODEL_NAME) {
            list.push({ name: "MODEL_NAME", value: vm.Ser.a_MODEL_NAME });
        }
        if (vm.Ser.a_STATE) {
            list.push({ name: "STATE", value: vm.Ser.a_STATE });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("WPOAtetest_Out", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
