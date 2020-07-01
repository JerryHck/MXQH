'use strict';

angular.module('app')
.controller('SystemSettingCtrl', ['$scope', 'toastr', 'Dialog', 'AjaxService', 'MyPop',
function ($scope, toastr, Dialog, AjaxService, MyPop) {

    var vm = this;
    vm.Save = Save;
    vm.AddCon = AddCon;
    vm.DeleteCon = DeleteCon;
    vm.AddCustom = AddCustom;
    vm.DeleteCustom = DeleteCustom;

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
        vm.promise = AjaxService.LoginAction("ReInit");
    }

    function AddCon() {
        var en = {};
        en.providerName = "System.Data.SqlClient";
        vm.Setting.Connects.Connects.push(en);
    }

    function DeleteCon(item,index) {
        //验证是否被使用
        if (!item.name) {
            vm.Setting.Connects.Connects.splice(index, 1);
            return;
        }

        var en = { name: "ConnectName", value: item.name };
        vm.promise = AjaxService.GetPlansTop("PlanEntity", en, 1).then(function (data) {
            if (data.length > 0) {
                MyPop.ngConfirm({ text: "已经被实体使用，确定要移除吗" }).then(function (data2) {
                    vm.Setting.Connects.Connects.splice(index, 1);
                })
            }
            else {
                AjaxService.GetPlansTop("JobSet", [{ name: "JobExecMethod", value: item.name }, { name: "ToPlanName", value: item.name, action: "or" }]).then(function (data3) {
                    if (data3.length > 0) {
                        MyPop.ngConfirm({ text: "已经被任务计划使用，确定要移除吗" }).then(function (data2) {
                            vm.Setting.Connects.Connects.splice(index, 1);
                        })
                    }
                    else {
                        vm.Setting.Connects.Connects.splice(index, 1);
                    }
                })
            }
        });
    }

    function AddCustom() {
        var en = {};
        vm.Setting.CustomSets = vm.Setting.CustomSets || {};
        vm.Setting.CustomSets.CustomSets = vm.Setting.CustomSets.CustomSets || [];
        vm.Setting.CustomSets.CustomSets.push(en);
    }

    function DeleteCustom(item, index) {
        //验证是否被使用
        if (!item.name) {
            vm.Setting.CustomSets.CustomSets.splice(index, 1);
            return;
        }
        MyPop.ngConfirm({ text: "配置有可能已经被是使用，确定要删除吗" }).then(function (data2) {
            vm.Setting.CustomSets.CustomSets.splice(index, 1);
        })
    }


    function GetList() {

        var en = {};

        vm.promise = AjaxService.BasicCustom("GetSysSet", {}).then(function (data) {
            vm.Setting = data;
        }).catch(function (mes) { });
    }

    function Save() {

        var en = {};
        en.strJson = JSON.stringify(vm.Setting);
        vm.promise = AjaxService.BasicCustom("SaveSysSet", en).then(function (data) {
            toastr.success("保存成功");
            vm.IsEdit = !vm.IsEdit;
            GetList();
        })
    }

}
]);