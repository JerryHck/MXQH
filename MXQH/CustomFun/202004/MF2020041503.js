'use strict';

angular.module('AppSet')
.controller('UnusualHourSignCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = { aState: "0" };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Sign = Sign;

    $scope.$watch(function () { return vm.Ser.aState; }, Search);

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("bcUnusualHour", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function Sign(item, state) {
        var en = {};
        en.Id = item.Id;
        en.State = state;
        en.SignBy = $rootScope.User.UserNo;
        en.SignDate = $rootScope.SysTime;
        vm.promise = AjaxService.PlanUpdate("bcUnusualHour", en).then(function (data) {
            toastr.success("审核成功")
            PageChange();
        });
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("bcUnusualHour", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aState) {
            list.push({ name: "State", value: vm.Ser.aState, tableAs:"a" });
        }
        return list;
    }

}]);
