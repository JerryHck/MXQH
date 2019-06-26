'use strict';

angular.module('app')
.controller('MesMaterialCtrl', ['Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function (Dialog, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

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
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MesMXMaterial", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function Insert() {
        Open({});
    }

    function Edit(item) {
        Open(item);
    }

    function Open(item) {
        Dialog.OpenDialog("MaterialDialog", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
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

}]);
