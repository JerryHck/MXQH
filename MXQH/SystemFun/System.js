'use strict';

angular.module('app')
.controller('SystemCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
function ($scope, $http, Dialog, AjaxService) {

    var vm = this;
    //編輯
    vm.Edit = Edit;
    //删除
    vm.Delete = Delete;
    //Dialog
    vm.Insert = Insert;


    GetList();

    //編輯
    function Insert() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        Open("I", resolve);
    }

    //編輯
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Open("U", resolve);
    }


    //删除
    function Delete(item) {
        var en = {};
        en.SysNo = item.SysNo;
        en.CompanyNo = item.Company.CompanyNo;
        vm.promise = AjaxService.ExecPlan('System', "delete", en).then(function (data) {
            GetList();
            toastr.success('删除');
        });
    }

    function GetList() {
        vm.promise = AjaxService.GetPlans("System").then(function (data) {
            vm.List = data;
        }).catch(function (mes) { console.log(mes); });
    }

    function Open(type, resolve) {
        Dialog.open("SystemDialog", resolve).then(function (data) {
            GetList();
            //console.log(data);
        }).catch(function (reason) {
            //console.log(reason);
        });
    }
}
]);