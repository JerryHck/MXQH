'use strict';

angular.module('app')
.controller('RoleCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'MyPop', '$rootScope',
function ($scope, $http, Dialog, AjaxService, toastr, MyPop, $rootScope) {

    var vm = this;

    vm.page = { index: 1, size: 7 };

    vm.getListRole = getListRole;
    //选择角色
    vm.SelectRole = SelectRole;
    //新增角色
    vm.InsertRole = InsertRole;
    //编辑角色
    vm.EditRole = EditRole;
    //删除角色
    vm.DeleteRole = DeleteRole;
    //新增角色功能
    vm.InsertRoleFun = InsertRoleFun;
    //更新角色功能
    vm.UpdateRoleFun = UpdateRoleFun;
    vm.DeleteRoleFun = DeleteRoleFun;
    //新增角色用户
    vm.InsertRoleUser = InsertRoleUser;
    //删除角色用户
    vm.DeleteRoleUser = DeleteRoleUser;

    vm.changeRoleFun = changeRoleFun;
    vm.changeRoleUser = changeRoleUser;

    getListRole();

    function getListRole() {
        var list = [];
        if (vm.UserRole) {
            list.push({ name: "RoleName", value: "%"+ vm.UserRole+"%" });
        }
        vm.promise = AjaxService.GetPlansPage("Role", list, vm.page.index, vm.page.size).then(function (data) {
            //vm.ListRole = data;
            vm.ListRole = data.List;
            vm.page.total = data.Count;
        });
    }

    function SelectRole(item) {
        vm.SelectedRole = item;
        getListRoleFun();
        getListRoleUser();
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
        Dialog.open("RoleDialog", resolve).then(function (data) {
            getListRole();
        }).catch(function (reason) {
        });
    }

    function InsertRoleUser() {
        var en = {};
        en.RoleSn = vm.SelectedRole.RoleSn;
        en.UserNo = vm.NewRoleUser;
        en.CreateBy = $rootScope.User.UserNo;
        vm.promise = AjaxService.PlanInsert("UserRole", en).then(function (data) {
            toastr.success('新增成功');
            vm.NewRoleUser = undefined;
            getListRoleUser();
        });
    }

    function getListRoleUser() {
        var en = { name: "RoleSn", value: vm.SelectedRole.RoleSn };
        AjaxService.GetPlans("UserRole", en).then(function (data) {
            vm.RoleUserList = data;
        });
    }

    function getListRoleFun() {
        var en = { name: "RoleSn", value: vm.SelectedRole.RoleSn };
        AjaxService.GetPlans("RoleFun", en).then(function (data) {
            vm.RoleHaveFun = data;
        });
    }

    function changeRoleUser() {
        //change先执行，而值还未赋值给scope
        setTimeout(function () {
            vm.RoleUserList = vm.RoleUserList || [];
            for (var i = 0, len = vm.RoleUserList.length; i < len; i++) {
                if (vm.RoleUserList[i].UserNo == vm.NewRoleUser) {
                    toastr.error('用户已经添加，请选择其他用户！');
                    vm.NewRoleUser = undefined;
                    break;
                }
            }
        }, 2);
    }

    function changeRoleFun() {
        setTimeout(function () {
            vm.RoleHaveFun = vm.RoleHaveFun || [];
            for (var i = 0, len = vm.RoleHaveFun.length; i < len; i++) {
                if (vm.RoleHaveFun[i].FunNo == vm.NewRoleFun) {
                    toastr.error('功能已经添加，请选择其他功能！');
                    vm.NewRoleFun = undefined;
                    break;
                }
            }
        }, 2);
    }

    function InsertRoleFun() {
        var en = {};
        en.RoleSn = vm.SelectedRole.RoleSn;
        en.FunNo = vm.NewRoleFun;
        en.CreateBy = $rootScope.User.UserNo;
        vm.promise = AjaxService.PlanInsert("RoleFun", en).then(function (data) {
            toastr.success('新增成功');
            vm.NewRoleFun = undefined;
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

    function DeleteRoleUser(ru) {
        AjaxService.PlanDelete("UserRole", ru).then(function (data) {
            toastr.success('删除成功');
            getListRoleUser();
        });
    }
}
]);