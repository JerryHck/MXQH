'use strict';

angular.module('app')
.controller('TPPCCustomerCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Add = Add;
    vm.Edit = Edit;
    vm.SaveAdd = SaveAdd;
    vm.SaveEdit = SaveEdit;
    vm.Search = Search;
    vm.DataBind = DataBind;
    vm.IsUnique = IsUnique;
    vm.Delete = Delete;
    //vm.Cancel = Cancel;
    vm.Ser_IsActive = { Table: 'AgingTestIsPass', Column: 'IsPass' };
    vm.IsActive = { Table: 'AgingTestIsPass', Column: 'IsPass' };

    Init();
    //初始化
    function Init() {
        vm.Ser = {};
        vm.NewItem = {};
        DataBind();
    }
    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("TPDictionary", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    //查询条件
    function GetCondition() {
        var li = [];
        li.push({ name: "TypeCode", value: "PCCustomer" });
        li.push({ name: "TypeName", value: "产品中心客户" });
        if (vm.Ser.Code) {
            li.push({ name: "Code", value: vm.Ser.Code });
        }
        if (vm.Ser.Name) {
            li.push({ name: "Name", value: vm.Ser.Name });
        }
        if (vm.Ser.IsActive) {
            li.push({ name: "IsActive", value: vm.Ser.IsActive });
        }
        return li;
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //添加字典数据
    function Add() {
        vm.IsAdd = true;
        vm.NewItem = {
            TypeCode: 'PCCustomer',
            TypeName: '产品中心客户',
            IsActive: '1',
            OrderNo: 999
        }
    }
    function IsUnique(isEdit) {
        if (isEdit) {//Edit
            if (vm.NowItem.Code != vm.EditItem.Code) {
                vm.promise = AjaxService.GetPlan("TPDictionary", [{ name: "Code", value: vm.EditItem.Code }, { name: "TypeCode", value: vm.EditItem.TypeCode }, { name: "TypeName", value: vm.EditItem.TypeName }]).then(function (data) {
                    vm.NowItem.EditForm.e_Code.$setValidity('unique', !data.Code);
                    flag = !data.Code;
                });
            }
        } else {//Add
            vm.promise = AjaxService.GetPlan("TPDictionary", [{ name: "Code", value: vm.NewItem.Code }, { name: "TypeCode", value: vm.NewItem.TypeCode }, { name: "TypeName", value: vm.NewItem.TypeName }]).then(function (data) {
                vm.InsertForm.Code.$setValidity('unique', !data.Code);
                flag = !data.Code;
            });
        }
    }
    //保存新增信息
    function SaveAdd() {
        vm.NewItem.CreateBy = $rootScope.User.Name;
        vm.NewItem.CreateBy = new Date();
        if (!vm.NewItem.Remark) {
            vm.NewItem.Remark = '';
        }
        vm.promise = AjaxService.PlanInsert("TPDictionary", vm.NewItem).then(function (data) {
            DataBind();
            toastr.success('新增成功');
            vm.IsAdd = false;
        });
    }
    //编辑字典数据
    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.EditItem.IsActive = vm.EditItem.IsActive.toString();
        vm.NowItem = item;
        item.IsEdit = true;
    }

    //保存编辑信息
    function SaveEdit(index) {
        if (!vm.EditItem.Remark) {
            vm.EditItem.Remark = '';
        }
        vm.promise = AjaxService.PlanUpdate("TPDictionary", vm.EditItem).then(function (data) {
            DataBind();
            toastr.success('更新成功');
        });
    }
    //删除客户
    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        AjaxService.GetPlansTop("PCReceivement", { name: "CustomerID", value: item.ID }).then(function (data) {
            if (data.length == 0) {
                vm.promise = AjaxService.PlanDelete("TPDictionary", en).then(function (data) {
                    DataBind();
                    toastr.success('删除成功');
                });
            } else {
                console.log(data);
                toastr.error("存在该客户入库单[" + data[0].DocNo + "]，不能删除！");
            }
        });
    }


}]);
