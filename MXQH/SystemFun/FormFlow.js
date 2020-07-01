'use strict';

angular.module('app')
.controller('FormFlowCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.pageDetail = { index: 1, size: 10 };
    vm.Ser = {};
    vm.tabIndex = 0;
    vm.PageChange = PageChange;//QC登记列表
    vm.Search = Search;//QC列表查询功能
    vm.Edit = Edit;//编辑QC信息详情
    vm.Cancel = Cancel;//取消
    vm.ChangeTab = ChangeTab;

    PageChange();

    //QC列表查询功能
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    //取消
    function Cancel() {
    }
    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("FunSelect", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.FunName) {
            list.push({ name: "FunName", value: vm.Ser.FunName, tableAs: "a" });
        }
        list.push({ name: "FunType", value: 2, tableAs: "a" });
        list.push({ name: "IsSystem", value: 2, tableAs: "a" });
        return list;
    }
    //tab切换
    function ChangeTab(index) {
        vm.tabIndex = index;
        if (vm.tabIndex == 0) {
            PageChange();
        } else {
        }
    }

    //获取QC登记信息详情
    function Edit(item) {
        Dialog.OpenDialog("FormFlowDialog", item).then(function (data) {
        })
    }
}]);
