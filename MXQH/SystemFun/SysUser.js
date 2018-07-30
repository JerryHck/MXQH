'use strict';

angular.module('app', ['ui.grid', 'ui.grid.autoResize'])
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'MyPop', '$rootScope',
function ($scope, $http, Dialog, AjaxService, toastr, MyPop, $rootScope) {

    var vm = this;
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
    //选择角色
    vm.SelectRole = SelectRole;
    //新增角色
    vm.InsertRole = InsertRole;
    //编辑角色
    vm.EditRole = EditRole;
    //删除角色
    vm.DeleteRole = DeleteRole;
    //新增用户角色
    vm.InsertUserRole = InsertUserRole;
    //新增用户角色-选择角色改变
    vm.SelectUserRole = SelectUserRole;
    //删除用户角色
    vm.DeleteUserRole = DeleteUserRole;
    //新增角色功能
    vm.InsertRoleFun = InsertRoleFun;
    //更新角色功能
    vm.UpdateRoleFun = UpdateRoleFun;
    vm.DeleteRoleFun = DeleteRoleFun;

    vm.ConfigSex = { Table: "BasicData", Column: "Sex" };

    getList();
    getListRole();

    function getList() {
        vm.promise = AjaxService.GetPlans("User").then(function (data) {
            vm.List = data;
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

    function SaveEmp() {
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
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        Open("I", resolve);
    }

    function change() {
        var en = {};
        en.UserNo = vm.SelectedUser.UserNo;
        en.State = vm.SelectedUser.State;
        vm.promise = AjaxService.PlanUpdate("UserBasic", en).then(function (data) {
            toastr.success('成功');
        });
    }

    function Open(type, resolve) {
        Dialog.open("UserDailog", resolve).then(function (data) {
            getList();
        }).catch(function (reason) {
        });
    }


    function getListRole() {
        vm.promise = AjaxService.GetPlans("Role").then(function (data) {
            vm.ListRole = data;
        });
    }

    function SelectRole(item) {
        vm.SelectedRole = item;
        getListRoleFun();
    }

    function InsertRole() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        OpenRole("I", resolve);
    }

    function EditRole(role) {
        var resolve = {
            ItemData: function () {
                return role;
            }
        };
        OpenRole("U", resolve);
    }

    function DeleteRole(role) {
        MyPop.Confirm({ text: "确定要删除该角色吗" }, function () {
            var en = {};
            en.RoleSn = role.RoleSn;
            vm.promise = AjaxService.PlanDelete("Role", en).then(function (data) {
                toastr.success('删除成功');
                getListRole();
            });
        });
    }

    function OpenRole(type, resolve) {
        Dialog.open("RoleDailog", resolve).then(function (data) {
            getListRole();
        }).catch(function (reason) {
        });
    }

    function InsertUserRole() {
        var en = {};
        en.UserNo = vm.SelectedUser.UserNo;
        en.RoleSn = vm.newUserRole;
        en.CreateBy = "SYS";
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
            }
        }
    }

    function DeleteUserRole(ur) {
        vm.promise = AjaxService.PlanDelete("UserRole", ur).then(function (data) {
            toastr.success('移除成功');
            getListUserRole();
        });
    }

    function getListRoleFun() {
        var en = { name: "RoleSn", value: vm.SelectedRole.RoleSn };
        AjaxService.GetPlans("RoleFun", en).then(function (data) {
            vm.RoleHaveFun = data;
        });
    }

    function InsertRoleFun() {
        var en = {};
        en.RoleSn = vm.SelectedRole.RoleSn;
        en.FunNo = vm.NewRoleFun;
        en.CreateBy = "SYS";
        vm.promise = AjaxService.PlanInsert("RoleFun", en).then(function (data) {
            toastr.success('新增成功');
            getListRoleFun();
        });
    }

    function UpdateRoleFun(rf) {
        AjaxService.PlanUpdate("RoleFun", rf).then(function (data) {
        });
    }

    function DeleteRoleFun(rf) {
        AjaxService.PlanDelete("RoleFun", rf).then(function (data) {
            toastr.success('删除成功');
            getListRoleFun();
        });
    }
}
]);