'use strict';

angular.module('app')
.controller('MesRoutingSerCtrl', ['$rootScope', '$scope', '$uibModalInstance', 'ItemData', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $uibModalInstance, ItemData, $http, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.GetPlansPage("BoRouting", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (ItemData.MaterialID) {
            list.push({ name: "ProductID", value: '%'+ItemData.MaterialID + '%' });
        }
        return list;
    }


    function Cancel(item) {
        $uibModalInstance.close(item);
    }

}]);
