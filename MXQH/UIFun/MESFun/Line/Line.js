'use strict';

angular.module('app')
.controller('LineManageCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectDept = SelectDept;

    DataBindDept();
    function DataBindDept() {
        vm.promise = AjaxService.GetPlans("MesOrg", {name:"IsWorkShop",value:1}).then(function (data) {
            vm.DeptList = data;
        });

    }
    function SelectDept(item) {
        console.log(item);
        vm.SelectedDeptID = item.ID;
        //vm.SelectedDeptID = 1;
        vm.SelectedDeptCode = item.DepartCode;
        vm.DeptName = item.DepartName;
        Search();
    }
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.NewItem.OrganizationID = vm.SelectedDeptID;
        vm.promise = AjaxService.PlanInsert("AssemblyLine", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }

    function Delete(item) {
        vm.promise = AjaxService.ExecPlan("AssemblyLine", "Delete", {ID:item.ID}).then(function (data) {
            if (data.data[0].MsgType == '1') {
                PageChange();
                toastr.success(data.data[0].Msg);
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.OrganizationID = vm.EditItem.OrganizationID;
        en.Code = vm.EditItem.Code;
        en.Name = vm.EditItem.Name;
        en.ListNo = vm.EditItem.ListNo;
        en.TS = vm.EditItem.TS;
        vm.promise = AjaxService.PlanUpdate("AssemblyLine", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("AssemblyLine", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("AssemblyLine", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [{name:"OrganizationID",value: vm.SelectedDeptID }];
        return list;
    }

}]);
