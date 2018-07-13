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
    vm.AddPro = AddPro;
    vm.DeletePro = DeletePro;

    vm.TbChecked = TbChecked;
    vm.CheckChange = CheckChange;
    vm.setClass = setClass;

    vm.SaveProClass = SaveProClass;
    vm.EditProClass = EditProClass;
    vm.AddProRelCon = AddProRelCon;
    vm.DeleteProCon = DeleteProCon;
    vm.CancelProCon = CancelProCon;

    vm.isExists = isExists;
    vm.isProExists = isProExists;


    GetList();
    Cancel();
    vm.ConfigOrderWay = { Table: "EntityProperty", Column: "OrderWay" };
    vm.ConfigColumnType = { Table: "EntityProperty", Column: "ColumnType" };
    vm.ConfigRelationType = { Table: "EntityProperty", Column: "RelationType" };
    vm.EntityRelationType = { Table: "EntityRelation", Column: "ColumnType" };
    vm.EntityRelationExp = { Table: "EntityRelation", Column: "Expression" };
    vm.EntityRelationAss = { Table: "EntityRelation", Column: "Associate" };
    vm.ProItem = { };
    vm.newRelCon = { ParenType: '0', ChildType: '0' };

    $scope.$watch(function () { return vm.EnTable; }, getTableList);
    $scope.$watch(function () { return vm.ProItem.EntityName; }, getChildTableList);

    function SelectEn(item) {
        vm.SelectedEn = angular.copy(item);
        vm.EnTable = { Name: vm.SelectedEn.TableName, DbSchema: vm.SelectedEn.TableSchema };
        getEntityProList();
        vm.isEditing = false;
    }

    //保存实体
    function SaveEntity() {
        console.log(vm.SelectedEn);
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
        vm.isProAdd = false;
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
            AjaxService.GetTbColumns(vm.EnTable.DbSchema, vm.EnTable.Name, vm.SelectedEn.ConnectName).then(function (data) {
                vm.TbColunms = data;
            });
        }
    }

    function getChildTableList() {
        vm.ProItem.RelateList = [];
        vm.TbChildColunms = [];
        if (vm.ProItem.EntityName) {
            AjaxService.GetColumns(vm.ProItem.EntityName).then(function (data) {
                vm.TbChildColunms = data;
            });
        }
        if (vm.RelateList && vm.RelateList.length > 0) {
            vm.ProItem.RelateList = vm.RelateList;
        }
        vm.RelateList = [];
    }

    function AddPro() {
        var en = {};
        vm.ProItem = en;
        vm.isProAdd = !vm.isProAdd;
    }

    function AddProRelCon() {
        vm.ProItem.RelateList = vm.ProItem.RelateList || [];
        vm.ProItem.RelateList.push(angular.copy(vm.newRelCon));
        $scope.ClassForm.Pro.$setValidity('neetList', true);
        vm.newRelCon.ParentKey = undefined;
        vm.newRelCon.ChildKey = undefined
    }

    function DeleteProCon(index) {
        vm.ProItem.RelateList.splice(index, 1);
        if (vm.ProItem.RelateList.length == 0) {
            vm.newRelCon.Associate = "";
        }
        else if (vm.ProItem.RelateList.length == 1) {
            vm.ProItem.RelateList[0].Associate = "";
        }
        $scope.ClassForm.Pro.$setValidity('neetList', vm.ProItem.RelateList.length > 0);
    }


    function getEntityProList() {
        if (vm.SelectedEn.EntityName) {
            var en = {};
            en.name = "EntityName";
            en.value = vm.SelectedEn.EntityName;
            vm.promise = AjaxService.GetPlans("PlanProperty", en).then(function (data) {
                vm.PropertyList = data;
                isProEmpty();
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

    //添加类 列表
    function SaveProClass() {
        if (vm.IsProEdit) {}
        else {
            var en = {};
            en.ColumnName = vm.ProItem.ColumnName;
            en.EntityName = vm.SelectedEn.EntityName;
            en.ColumnType = vm.ProItem.ColumnType;
            en.RelationType = vm.ProItem.RelationType;
            en.OrderWay = "NON";
            en.OrderNum = 0;
            en.IsKey = 0;
            en.RelateList = vm.ProItem.RelateList;
            vm.PropertyList.push(en);
        }
        vm.IsProEdit = false;
        vm.isProAdd = !vm.isProAdd
    }

    function EditProClass(pro) {
        vm.ProItem = pro;
        vm.RelateList = pro.RelateList ? angular.copy(pro.RelateList) : [];
        vm.isProAdd = true;
        vm.IsProEdit = true;
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

    function CancelProCon() {
        vm.isProAdd = !vm.isProAdd;
        vm.IsProEdit = false;
    }

    //验证实体是否存在
    function isExists(name) {
        if (name) {
            var en = { name: "EntityName", value: name };
            AjaxService.GetPlan('PlanEntity', en).then(function (data) {
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

    function isProExists(name) {
        if (name) {
            var have = false;
            for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
                if (name == vm.PropertyList[i].ColumnName) {
                    have = true;
                    $scope.ClassForm.Pro.$setValidity('unique', false);
                    break;
                }
            }
            if (!have) {
                var en = [{ name: "EntityName", value: vm.SelectedEn.EntityName },
                    { name: "ColumnName", value: name }];
                AjaxService.GetPlan('PlanProperty', en).then(function (data) {
                    var v = !data.ColumnName;
                    $scope.ClassForm.Pro.$setValidity('unique', v);
                    $scope.ClassForm.Pro.$setValidity('neetList', vm.ProItem.RelateList.length > 0);
                });
            }
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