'use strict';
angular.module('app')
.controller('MaterialTypeCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.ItemData = {};
    vm.GetTreeData = GetTreeData;
    vm.Add = Add;
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    GetTreeData();

    //绑定数据
    function GetTreeData() {
        var condition = [{ name: "PID", value: "-1" }]
        vm.promise = AjaxService.GetPlans("MesMaterialType", condition).then(function (data) {
            $('#tree').treeview({
                data: data,
                levels: 3,
                emptyIcon: "glyphicon",
                onNodeSelected: function (event, data) {//节点选中时间
                    vm.selectedNode = data.nodeId;
                    $(this).treeview("expandNode", [data.nodeId]);
                    vm.PID = data.ID;
                    DataBind();
                }
            });
            if (!vm.selectedNode) {
                $("#tree").treeview("selectNode", [0]);
            }
            else {
                $("#tree").treeview("selectNode", [vm.selectedNode]);
            }
            
        });
    }
    //获取所选分类下的子分类
    function DataBind() {
        var condition2 = [{ name: "PID", value: vm.PID }]
        vm.promise = AjaxService.GetPlans("MesMaterialType", condition2).then(function (data) {
            vm.List = data;
        })
    }

    //新增 物料分类
    function Add() {
        $(".pro-file").addClass("active");
        vm.IsEdit = false;
        vm.ItemData = { PID: vm.PID };
    }
    //编辑 物料分类
    function Edit(item) {
        $(".pro-file").addClass("active");
        vm.IsEdit = true;
        vm.ItemData.ID = item.ID;
        vm.ItemData.TypeCode = item.TypeCode;
        vm.ItemData.text = item.text;
    }

    //保存 物料分类
    function Save() {
        if (vm.IsEdit) {//修改
            var en = {};
            var li = [];
            en.TempColumns = "List";
            li.push(vm.ItemData);
            en.List = JSON.stringify(li);
            vm.promise = AjaxService.ExecPlan("MesMaterialType", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    GetTreeData();
                } else {
                    toastr.error(data.data[0].Msg);
                }

            });
        }
        else {//新增
            var en = {};
            var li = [];
            en.TempColumns = "List";
            li.push(vm.ItemData);
            en.List = JSON.stringify(li);
            vm.promise = AjaxService.ExecPlan("MesMaterialType", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    GetTreeData();
                } else {
                    toastr.error(data.data[0].Msg);
                }
                
            });
        }
    }

    //删除 物料分类
    function Delete(id) {
        vm.page.ID = id;
        vm.promise = AjaxService.ExecPlan("MesMaterialType", "Delete", vm.page).then(function (data) {
            if (data.data[0].MsgType == "0") {
                toastr.error(data.data[0].Msg);
            } else {
                toastr.success(data.data[0].Msg);
                GetTreeData();
            }
        });
    }
}
])

