'use strict';
angular.module('app')
.controller('EquipMoCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    Init();
    //初始化
    function Init() {
        vm.Ser = {};
        vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
        vm.DataBind = DataBind;
        vm.Search = Search;
        vm.Add = Add;
        vm.Edit = Edit;

    }
    //DataBind();
    //绑定数据
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("EquipMORelate", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].TotalCount;
        });
    }


    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //查询条件
    function GetCondition() {
        vm.page.Code = vm.Ser.Code == '' ? undefined : vm.Ser.Code;
        vm.page.Name = vm.Ser.Name == '' ? undefined : vm.Ser.Name;

    }


    //编辑
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
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
        Dialog.open("EquipMoRDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

}
])