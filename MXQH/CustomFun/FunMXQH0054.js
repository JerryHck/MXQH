'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    
    AjaxService.GetPlans("SerialNumberSet").then(function (data) { vm.POData = data; })

    function PageChange() {
        var list = [];
        vm.promise = AjaxService.GetPlansPage("EnProcExcel", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        vm.promise = AjaxService.GetPlanOwnExcel("EnProcExcel", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);