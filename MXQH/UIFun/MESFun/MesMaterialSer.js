'use strict';
angular.module('app')
.controller('MesMaterialSerCtrl', ['$rootScope', '$scope', 'ItemData', '$http', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData,$http,$uibModalInstance, AjaxService, toastr, $window) {

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
        vm.promise = AjaxService.GetPlansPage("MesMXMaterial", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.a_MaterialCode });
        }
        if (vm.Ser.a_MaterialName) {
            list.push({ name: "MaterialName", value: vm.Ser.a_MaterialName });
        }
        return list;
    }

    function Cancel(item) {
        $uibModalInstance.close(item);
    }

}]);
