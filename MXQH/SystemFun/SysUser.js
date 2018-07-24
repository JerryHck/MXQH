'use strict';

angular.module('app', ['ui.grid', 'ui.grid.autoResize'])
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {

    var vm = this;
    vm.Insert = Insert;
    vm.SelectUser = SelectUser;
    vm.EditEmp = EditEmp;
    vm.change = change;
    vm.CancelEmp = CancelEmp;
    vm.SaveEmp = SaveEmp;

    vm.ConfigSex = { Table: "BasicData", Column: "Sex" };

    getList();
    function getList() {
        AjaxService.GetPlans("User").then(function (data) {
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
    }

    function EditEmp() {
        vm.isEditEmp = !vm.isEditEmp;
    }

    function SaveEmp() {
        AjaxService.PlanUpdate("Employee", vm.EmpItem).then(function (data) {
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
        AjaxService.PlanUpdate("UserBasic", en).then(function (data) {
            toastr.success('成功');
        });
    }

    function Open(type, resolve) {
        Dialog.open("UserDailog", resolve).then(function (data) {
            //GetList();
            //console.log(data);
        }).catch(function (reason) {
            //console.log(reason);
        });
    }
}
]);