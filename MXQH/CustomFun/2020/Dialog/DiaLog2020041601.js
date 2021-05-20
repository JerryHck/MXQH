'use strict';

angular.module('AppSet')
.controller('bcPiecePriceHisCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

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
        vm.promise = AjaxService.GetPlansPage("bcPiecePriceHis", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [{name:"Code", value:ItemData.Code}];
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);