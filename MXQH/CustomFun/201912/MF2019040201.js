'use strict';

angular.module('app')
.controller('WpoParaSetCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;

    GetList()

    function GetList() {
        AjaxService.GetPlans("WPOPackagePara").then(function (data) {
            vm.ParList = data;
        })
    }

    function Insert() {
        AjaxService.PlanInsert("WPOPackagePara", vm.NewItem).then(function (data) {
            vm.NewItem = {};
            toastr.success('新增成功');
            GetList();
        })
    }

    function Edit(item) {
        var en = {};
        en.SetName = item.SetName;
        en.SetValue = item.SetValue;
        en.SetDesc = item.SetDesc;
        AjaxService.PlanUpdate("WPOPackagePara", en).then(function (data) {
            vm.NewItem = {};
            toastr.success('更新成功');
            item.isEdit = !item.isEdit;
        })
    }

    function Delete(item) {
        var en = {};
        en.SetName = item.SetName;
        AjaxService.PlanDelete("WPOPackagePara", en).then(function (data) {
            toastr.success('删除成功');
            GetList();
        })
    }
}
]);