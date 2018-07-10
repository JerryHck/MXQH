'use strict';

angular.module('app')
.controller('CreateEntityCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
function ($scope, $http, Dialog, AjaxService) {

    var vm = this;
    vm.isEnExists = isEnExists;
    //保存实体
    vm.SaveEntity = SaveEntity;
    vm.SelectEn = SelectEn;
    vm.Cancel = Cancel;
    vm.DeleteEn = DeleteEn;

    vm.TbChecked = TbChecked;
    vm.CheckChange = CheckChange;

    GetList();
    Cancel();
    vm.ConfigOrderWay = { Table: "EntityProperty", Column: "OrderWay" };
    vm.ConfigColumnType = { Table: "EntityProperty", Column: "ColumnType" };
    vm.ConfigRelationType = { Table: "EntityProperty", Column: "RelationType" };


    function SelectEn(item) {
        vm.SelectedEn = angular.copy(item);
        vm.EnTable = { Name: vm.SelectedEn.TableName, DbSchema: vm.SelectedEn.TableSchema };
        getEntityProList();
        //console.log(item);
    }

    //保存实体
    function SaveEntity() {
        Cancel();
    }

    //初始化数据
    function Cancel() {
        vm.SelectedEn = {};
        vm.SelectedEn.Level = 3;
        vm.isAddOpen = false;
        vm.TbColunms = undefined;
        vm.PropertyList = [];
    }

    //删除
    function DeleteEn(item) {
        
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
            vm.PropertyList = [];
            vm.SelectedEn.TableSchema = vm.EnTable.DbSchema;
            vm.SelectedEn.TableName = vm.EnTable.Name;
            vm.promise = AjaxService.GetTbColumns(vm.EnTable.DbSchema, vm.EnTable.Name, vm.SelectedEn.ConnectName).then(function (data) {
                vm.TbColunms = data;
            });
        }
    }
    function getEntityProList() {
        if (vm.SelectedEn.EntityName) {
            var en = {};
            en.name = "EntityName";
            en.value = vm.SelectedEn.EntityName;
            vm.promise = AjaxService.GetPlans("PlanProperty", en).then(function (data) {
                vm.PropertyList = data;
            });
        }
    }

    function TbChecked(item) {
        var check = false;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                check = true; break;
            }
        }
        return item.isCheck = check;
    }

    function CheckChange(item) {
        var check = false, index=-1;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                check = true; index = i; break;
            }
        }

        if (item.isCheck) {
            var check = false;
            for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
                if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                    check = true; break;
                }
            }
            if (!check) {
                var en = {};
                en.EntityName = vm.SelectedEn.EntityName;
                en.ColumnName = item.ColumnName;
                en.ColumnType = 0;
                en.RelationType = "";
                en.OrderWay = "NON";
                en.OrderNum = 0;
                en.IsKey = item.IsKey;
                vm.PropertyList.push(en);
            }
        } else {
            vm.PropertyList.splice(index, 1)
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