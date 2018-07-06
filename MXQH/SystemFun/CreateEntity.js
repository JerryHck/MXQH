'use strict';

angular.module('app')
.controller('CreateEntityCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
function ($scope, $http, Dialog, AjaxService) {

    var vm = this;
    //保存实体
    vm.SaveEntity = SaveEntity;

    vm.NewEntity = {};
    vm.NewEntity.Level = 3;

    GetList();

    //保存实体
    function SaveEntity() {
        vm.isAddOpen = false;
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
        vm.promise = AjaxService.Action('Sys_System', en, "Delete").then(function (data) {
            GetList();
            toastr.success('删除');
        });
    }

    function GetList() {
        vm.promise = AjaxService.GetPlans("PlanEntity").then(function (data) {
            console.log(data);
            vm.List = data;
        });
    }

    function Open(type, resolve) {
        Dialog.open("SystemDailog", resolve).then(function (data) {
            GetList();
            //console.log(data);
        }).catch(function (reason) {
            //console.log(reason);
        });
    }
}
]);