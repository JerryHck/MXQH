'use strict';

angular.module('AppSet')
.controller('SysTableCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.Open = Open;
    vm.Add = Add;
    vm.Delete = Delete;
    vm.OpenSer = OpenSer;

    $scope.$watch(function () { return vm.Ser.aConnectName; }, FirtLoad);


    function FirtLoad() {
        if (vm.Ser.aConnectName) {
            Search();
        }
    }

    ////Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    function Add() {
        var en = { ConnectName: vm.Ser.aConnectName };
        Open(en);
    }

    function Open(item) {
        Dialog.OpenDialog("SysTableDialog", item).then(function (data) {
            if (data) {
                Search();
            }
        }, function () { })
    }

    function Delete(item) {
        vm.promise = AjaxService.ExecPlan("TableMain", "delete", item).then(function (data) {
            PageChange();
            toastr.success("删除成功");
        })

    }

    function OpenSer(item) {
        Dialog.OpenDialog("SysTableSetHisDialog", item).then(function (data) {

        }, function (data) { })
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("TableMain", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.aTableName) {
            list.push({ name: "TableName", value: vm.Ser.aTableName, tableAs:"a" });
        }
        if (vm.Ser.aTableDesc) {
            list.push({ name: "TableDesc", value: vm.Ser.aTableDesc, tableAs: "a" });
        }
        
        list.push({ name: "ConnectName", value: vm.Ser.aConnectName, tableAs:"a" });
        
        return list;
    }

}]);
