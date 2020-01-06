'use strict';

angular.module('app')
.controller('WPOMateCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.a_MateCode });
        }
        vm.promise = AjaxService.GetPlansPage("WPOMate", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.a_MateCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("WPOMate", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
