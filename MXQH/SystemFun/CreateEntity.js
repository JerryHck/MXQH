'use strict';

angular.module('app')
.controller('CreateEntityCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {

    var vm = this;
    vm.EnAdd = EnAdd;
    vm.Edit = Edit;
    //保存实体
    vm.SaveEntity = SaveEntity;
    vm.SelectEn = SelectEn;
    vm.Cancel = Cancel;
    vm.DeleteEn = DeleteEn;
    vm.DeletePro = DeletePro;

    vm.TbChecked = TbChecked;
    vm.CheckChange = CheckChange;
    vm.setClass = setClass;

    vm.isExists = isExists;


    GetList();
    Cancel();
    vm.ConfigOrderWay = { Table: "EntityProperty", Column: "OrderWay" };
    vm.ConfigColumnType = { Table: "EntityProperty", Column: "ColumnType" };
    vm.ConfigRelationType = { Table: "EntityProperty", Column: "RelationType" };

    $scope.$watch(function () { return vm.EnTable; }, getTableList);

    function SelectEn(item) {
        vm.SelectedEn = angular.copy(item);
        vm.EnTable = { Name: vm.SelectedEn.TableName, DbSchema: vm.SelectedEn.TableSchema };
        getEntityProList();
        vm.isEditing = false;
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
        vm.isEditing = false;
        vm.isAdd = false;
    }

    //删除
    function DeleteEn(item) {
        
    }


    function EnAdd() {
        Cancel();
        vm.isAddOpen = true;
        vm.isEditing = true;
        vm.isAdd = true;
    }

    function Edit() {
        vm.isAddOpen = true;
        vm.isEditing = true;
        vm.isAdd = false;
    }

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
        if (vm.isEditing) {
            vm.PropertyList = [];
            isProEmpty();
        }

        if (vm.EnTable) {
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
                en.ColumnType = "0";
                en.RelationType = "";
                en.OrderWay = "NON";
                en.OrderNum = 0;
                en.IsKey = item.IsKey;
                vm.PropertyList.push(en);
            }
        } else {
            vm.PropertyList.splice(index, 1)
        }
        isProEmpty();
    }

    //删除属性
    function DeletePro(pro) {
        var index = -1;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (pro.ColumnName == vm.PropertyList[i].ColumnName) {
                index = i; break;
            }
        }
        vm.PropertyList.splice(index, 1);
        isProEmpty();
    }

    //验证实体是否存在
    function isExists(name) {
        if (name) {
            var en = { name: "EntityName", value: name };
            AjaxService.GetPlan('PlanEntity', en).then(function (data) {
                console.log(data)
                var v = !data.EntityName;
                $scope.EntityForm.entityName.$setValidity('unique', v);
                if (!v) {
                    toastr.warning('实体名称已被使用了！');
                } else {
                    isProEmpty();
                }
            });
        }
    }

    function isProEmpty() {
        if (vm.PropertyList) {
            var v = vm.PropertyList.length > 0;
            $scope.EntityForm.entityName.$setValidity('neetPro', v);
            if (!v && vm.SelectedEn.EntityName) {
                toastr.warning('实体属性还没有，需要重新添加哦！');
            }
        }
    }

    function setClass(type)
    {
        var c = "";
        switch (type) {
            case '0': c = "panel-default"; break;
            case '1': c = "panel-primary"; break;
            case '2': c = "panel-danger"; break;
        }
        return c;
    }
}
]);