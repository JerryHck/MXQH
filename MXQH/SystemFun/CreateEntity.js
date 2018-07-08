'use strict';

angular.module('app')
.controller('CreateEntityCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
function ($scope, $http, Dialog, AjaxService) {

    var vm = this;
    vm.isEnExists = isEnExists;
    //保存实体
    vm.SaveEntity = SaveEntity;
    vm.SelectEn = SelectEn;

    vm.SelectedEn = {};
    vm.SelectedEn.Level = 3;

    GetList();

    function SelectEn(item) {
        vm.SelectedEn = angular.copy(item);
        vm.EnTable = { Name: vm.SelectedEn.TableName, DbSchema: vm.SelectedEn.TableSchema };
        //console.log(item);
    }

    //保存实体
    function SaveEntity() {
        vm.isAddOpen = false;
    }

    //編輯
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Open("U", resolve);
    }

    $scope.$watch(function () { return vm.EnTable; }, getTableList);


    //删除
    function Delete(item) {
        var en = {};
        en.SysNo = item.SysNo;
        en.CompanyNo = item.Company.CompanyNo;
        vm.promise = AjaxService.Action('Sys_System', en, "Delete").then(function (data) {
            GetList();
            toastr.success('删除');
        });
    }

    function GetList() {
        vm.promise = AjaxService.GetPlans("PlanEntity").then(function (data) {
            vm.List = data;
        });
    }
    function getTableList() {
        if (vm.EnTable) {
            vm.promise = AjaxService.GetTbColumns(vm.EnTable.DbSchema, vm.EnTable.Name, vm.SelectedEn.ConnectName).then(function (data) {
                vm.TbColunms = data;
            });
        }
    }

    //验证实体是否存在
    function isEnExists() {
        if (vm.Item.SysNo) {
            var en = { name: "SysNo", value: vm.Item.SysNo };
            vm.promise = AjaxService.GetTbView('Sys_System', en).then(function (data) {
                $scope.SystemForm.No.$setValidity('unique', !data);
            });
        }
    }
}
]);