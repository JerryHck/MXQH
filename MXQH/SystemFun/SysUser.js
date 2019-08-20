'use strict';

angular.module('app')
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'MyPop', '$rootScope',
function ($scope, $http, Dialog, AjaxService, toastr, MyPop, $rootScope) {

    var vm = this;
    vm.getList = getList;
    //新增用户
    vm.Insert = Insert;
    //选择用户
    vm.SelectUser = SelectUser;
    //编辑员工信息
    vm.EditEmp = EditEmp;
    //用户状态改变
    vm.change = change;
    //取消编辑
    vm.CancelEmp = CancelEmp;
    //保存员工信息
    vm.SaveEmp = SaveEmp;
    //新增用户角色
    vm.InsertUserRole = InsertUserRole;
    //新增用户角色-选择角色改变
    vm.SelectUserRole = SelectUserRole;
    //删除用户角色
    vm.DeleteUserRole = DeleteUserRole;
    vm.GetData = GetData;
    vm.Reset = Reset;

    vm.ConfigSex = { Table: "BasicData", Column: "Sex" };
    vm.UserType = 'E';

    getList();
    getListRole();
    GetLogin();

    function getList() {
        var en = { name: "UserType", value: vm.UserType }
        vm.promise = AjaxService.GetPlans("User", en).then(function (data) {
            vm.List = data;
            vm.SelectedUser = undefined;
        });
    }

    function SelectUser(item) {
        vm.SelectedUser = item;
        var en = { name: "EmpNo", value: item.EmpNo };
        AjaxService.GetPlan("Employee", en).then(function (data) {
            vm.EmpItem = data;
            vm.PreEmpItem = angular.copy(data);
        });
        getListUserRole();
    }

    function EditEmp() {
        vm.isEditEmp = !vm.isEditEmp;
    }

    function Reset(item) {
        Dialog.OpenDialog("ResetUserPwdDialog", item);
    }

    function SaveEmp() {
        vm.EmpItem.OrgSn = vm.EmpItem.OrgSn || "1";
        vm.promise = AjaxService.PlanUpdate("Employee", vm.EmpItem).then(function (data) {
            toastr.success('保存成功');
            vm.isEditEmp = !vm.isEditEmp;
        });
    }

    function CancelEmp() {
        vm.EmpItem = angular.copy(vm.PreEmpItem);
        vm.isEditEmp = !vm.isEditEmp;
    }

    function Insert() {
        Dialog.OpenDialog("UserDialog", { UserType: vm.UserType }).then(function (data) {
            getList();
        }).catch(function (reason) {
        });
    }

    function change() {
        var en = {};
        en.UserNo = vm.SelectedUser.UserNo;
        en.State = vm.SelectedUser.State;
        vm.promise = AjaxService.PlanUpdate("UserBasic", en).then(function (data) {
            toastr.success('成功');
        });
    }

    function getListRole() {
        vm.promise = AjaxService.GetPlans("Role").then(function (data) {
            vm.ListRole = data;
        });
    }

    function InsertUserRole() {
        var en = {};
        en.UserNo = vm.SelectedUser.UserNo;
        en.RoleSn = vm.newUserRole;
        en.CreateBy = $rootScope.User.UserNo;
        vm.promise = AjaxService.PlanInsert("UserRole", en).then(function (data) {
            toastr.success('新增成功');
            getListUserRole();
        });
    }

    function getListUserRole() {
        var en = { name: "UserNo", value: vm.SelectedUser.UserNo };
        AjaxService.GetPlans("UserRole", en).then(function (data) {
            vm.UserHaveRole = data;
        });
    }

    function SelectUserRole() {
        vm.UserHaveRole = vm.UserHaveRole || [];
        for (var i = 0, len = vm.UserHaveRole.length; i < len; i++) {
            if (vm.UserHaveRole[i].RoleSn == vm.newUserRole) {
                toastr.error('角色已经添加，请选择其他角色！');
                vm.newUserRole = undefined;
                break
            }
        }
    }

    function DeleteUserRole(ur) {
        vm.promise = AjaxService.PlanDelete("UserRole", ur).then(function (data) {
            toastr.success('移除成功');
            getListUserRole();
        });
    }

    function GetData() {
        var s = '';
        switch (vm.UserType) {
            case 'E': s = '员工'; break;
            case 'C': s = '客户'; break;
            case 'S': s = '供应商'; break;
        }
        return s;
    }

    function GetLogin() {
        var en = {};
        //呼叫的方法
        en.Method = 'GetOnline';
        //呼叫的实体参数
        en.PlanName = ""
        en.Intervel = 5;
        //传送的参数字符串
        en.Json = "[]";
        AjaxService.GetServerSocket(en, "Online", function (data) {
            $scope.$apply(function () {
                vm.OnList = JSON.parse(data);
                vm.List = vm.List || [];
                for (var i = 0, len = vm.List.length; i < len; i++) {
                    checkOnlien(vm.List[i]);
                }
            });
        })
    }

    function checkOnlien(user) {
        user.IsOn = false;
        if (vm.OnList) {
            for (var i = 0, len = vm.OnList.length; i < len; i++) {
                if (user.UserNo.toUpperCase() == vm.OnList[i].UserNo.toUpperCase()) {
                    user.IsOn = true;
                    return;
                }
            }
        }
    }
}
]);