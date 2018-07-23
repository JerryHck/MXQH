'use strict';

angular.module('app', ['ui.grid', 'ui.grid.autoResize'])
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {

    var vm = this;
    vm.Insert = Insert;
    vm.SelectUser = SelectUser;

    vm.ConfigSex = { Table: "BasicData", Column: "Sex" };

    getList();
    function getList() {
        AjaxService.GetPlans("User").then(function (data) {
            vm.List = data;
        });
    }

    function SelectUser(item) {
        vm.SelectedUser = item;
    }

    function Insert() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        Open("I", resolve);
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