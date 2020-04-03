'use strict';
angular.module('app')
.controller('CompleteRptCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.Search = Search;
    vm.Export = Export;
    Init();
    //初始化
    function Init() {
        DataBind();
    }

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    //导出
    function Export() {
        vm.page.pageSize = 100000;
        vm.promise = AjaxService.GetPlanExcel("CompleteRpt", 'GetList', vm.page).then(function (data) {
            $window.location.href = data.File;
            vm.page.pageSize = 10;
        });
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
        Dialog.open("CompleteRptDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(item) {
        vm.promise = AjaxService.ExecPlan("U9MoCompleteRpt", "GetQty", { WorkOrder: item.WorkOrder }).then(function (data) {
            var en = { ID: item.ID, CompleteQty: data.data[0].CompleteQty };
            vm.promise = AjaxService.ExecPlan("CompleteRpt", "Delete", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    DataBind();
                    toastr.success(data.data[0].Msg);
                } else {
                    toastr.error(data.data[0].Msg);
                }

            });
        });
    }

}
])