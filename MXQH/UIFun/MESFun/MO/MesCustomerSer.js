'use strict';

angular.module('app')
.controller('MesCustomerSerCtrl', ['$rootScope', '$scope', '$http', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http,$uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.Cancel = Cancel;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("baCustom", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Code) {
            list.push({ name: "Code", value: '%'+vm.Ser.a_Code+'%' });
        }
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: '%' + vm.Ser.a_Name + '%' });
        }
        return list;
    }

    function Cancel(item) {
        $uibModalInstance.close(item);
    }

}]);
