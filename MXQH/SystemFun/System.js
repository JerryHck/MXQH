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
    vm.SystemInit = SystemInit;

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

    function SystemInit() {
        //系统数据初始化
        AjaxService.LoginAction("ReInit");
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
            //更新功能基本信息
            AjaxService.LoginAction("ReInit");
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