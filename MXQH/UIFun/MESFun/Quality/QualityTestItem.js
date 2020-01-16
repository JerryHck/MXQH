'use strict';
angular.module('app')
.controller('QualityTestItemCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 2, maxSize: 10 };
    vm.ItemData = {};
    vm.GetTreeData = GetTreeData;
    vm.Add = Add;//新增弹出框    
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.DataBind = DataBind;
    vm.searchTreeView = searchTreeView;

    //vm.Cancel = Cancel;
    GetTreeData();

    //绑定数据
    function GetTreeData() {
        var condition = [{ name: "PID", value: "-1" }];
        vm.promise = AjaxService.GetPlans("QualityPropertyT", condition).then(function (poorType) {
            var topNode = [{ID:-1,PID:-1,text:'所有分类',nodes:poorType}]
            $('#tree').treeview({
                data: topNode,
                levels: 5,
                emptyIcon: "glyphicon",
                showTags: true,                
                onNodeSelected: function (event, data) {//节点选中事件
                    vm.ItemData = {};
                    vm.selectedNode = data.nodeId;
                    $(this).treeview("expandNode", [data.nodeId]);
                    vm.PID = data.ID;
                    vm.page.pageIndex = 1;
                    DataBind();
                }
            });
            if (!vm.selectedNode) {
                $("#tree").treeview("selectNode", [0]);
            }
            else {
                $("#tree").treeview("selectNode", [vm.selectedNode]);
            }
            $('#tree').treeview('collapseAll', { silent: true });
        })
    }

    //查询树状节点
    function searchTreeView(value, attr) {
        var arr = $('#tree').treeview('search', [value, attr]);
    }

    //获取所选分类下的子分类
    function DataBind() {
        var condition = [{ name: "PID", value: vm.PID }]
        vm.promise = AjaxService.GetPlansPage("QualityProperty", condition, vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            console.log(data)
            vm.List = data.List;
            vm.page.total = data.Count;
        })
    }

    //新增 物料分类
    function Add() {
        $(".pro-file").addClass("active");
        vm.ItemData.OrderNo = 0;
        vm.IsEdit = false;
    }


    //编辑 物料分类
    function Edit(item) {
        $(".pro-file").addClass("active");
        vm.IsEdit = true;
        vm.ItemData.ID = item.ID;
        vm.ItemData.PID = vm.PID
        vm.ItemData.Code = item.Code;
        vm.ItemData.text = item.text;
        vm.ItemData.OrderNo = item.OrderNo;
    }

    //保存 物料分类
    function Save() {
        var en = {};
        var li = [];
        vm.ItemData.PID = vm.PID
        li.push(vm.ItemData);
        en.TempColumns = "List";
        en.List = JSON.stringify(li);
        if (!vm.IsEdit) {//新增           
            vm.promise = AjaxService.ExecPlan("QualityProperty", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    GetTreeData();
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });            
        } else {//修改
            vm.promise = AjaxService.ExecPlan("QualityProperty", "Update", en).then(function (data) {
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
        vm.promise = AjaxService.ExecPlan("QualityProperty", "Delete", { ID: id }).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                GetTreeData();
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }

}
])

