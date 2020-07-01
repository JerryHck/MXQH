'use strict';
angular.module('app')
.controller('WorkOrderSerCtrl', ['$rootScope', '$scope', 'ItemData', '$http', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData, $http, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 8 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;

    vm.Cancel = Cancel;
    PageChange();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesPlanDetail", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        // list.push({ name: "State", value: '1' });
        list.push({ name: "CompleteType", value: 1 });
        if (vm.Ser.MaterialCode) {
            list.push({ name: "MaterialCode", value: '%' + vm.Ser.MaterialCode + '%' });
        }
        if (vm.Ser.MaterialName) {
            list.push({ name: "MaterialName", value: '%' + vm.Ser.MaterialName + '%' });
        }
        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: '%' + vm.Ser.WorkOrder + '%' });
        }
        return list;
    }

    function Cancel(item) {
        $uibModalInstance.close(item);
    }

}]);
