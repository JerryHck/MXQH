'use strict';

angular.module('AppSet')
.controller('SystemUserCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = { aUserType: "E", aState:'S' };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("User", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aEmpNo) {
            list.push({ name: "EmpNo", value: vm.Ser.aEmpNo, tableAs:"a" });
        }
        if (vm.Ser.aChiFirstName) {
            list.push({ name: "ChiFirstName", value: vm.Ser.aChiFirstName, tableAs:"a" });
        }
        if (vm.Ser.aUserType) {
            list.push({ name: "UserType", value: vm.Ser.aUserType, tableAs:"a" });
        }
        if (vm.Ser.aState) {
            list.push({ name: "State", value: vm.Ser.aState, tableAs:"a" });
        }
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);