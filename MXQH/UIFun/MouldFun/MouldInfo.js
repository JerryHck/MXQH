'use strict';
angular.module('app')
.controller('MouldInfoCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Add = Add;//新增
    vm.Edit = Edit;//查看
    vm.Search = Search;
    vm.Export = Export;
    DataBind();
    function Export() {
        vm.promise = AjaxService.GetPlanOwnExcel("MouldInfo", GetCondition()).then(function (data) {
            console.log(data);
            $window.location.href = data.File;
        });
    }
    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("MouldInfo", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //查询条件
    function GetCondition() {
        var li = [];
        li.push({ name: "Deleted", value: '0' });
        if (vm.Ser.Code) {
            li.push({ name: "Code", value: '%' + vm.Ser.Code + '%' });
        }
        if (vm.Ser.Name) {
            li.push({ name: "Name", value: '%' + vm.Ser.Name + '%' });
        }
        return li;
    }
    //查看
    function Edit(id) {
        var resolve = {
            ItemData: function () {
                return { ID: id };
            }
        }
        Open(resolve);
    }
    //新增
    function Add() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Open(resolve);
    }
    //弹出框
    function Open(resolve) {
        Dialog.open("MouldDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

}
])