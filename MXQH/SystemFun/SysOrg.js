'use strict';
angular.module('app')
.controller('SysOrgCtrl', ['$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.ItemData = {};
    vm.GetTreeData = GetTreeData;
    vm.Add = Add;
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.searchTreeView = searchTreeView;
    GetTreeData();

    vm.options = {
        //data: data, //data属性是必须的，是一个对象数组    Array of Objects.
        color: "", //所有节点使用的默认前景色，这个颜色会被节点数据上的backColor属性覆盖.        String
        backColor: "#a39b9f", //所有节点使用的默认背景色，这个颜色会被节点数据上的backColor属性覆盖.     String
        borderColor: "#e85959", //边框颜色。如果不想要可见的边框，则可以设置showBorder为false。        String
        //nodeIcon: "glyphicon glyphicon-stop", //所有节点的默认图标
        //checkedIcon: "glyphicon glyphicon-check", //节点被选中时显示的图标         String
        collapseIcon: "glyphicon glyphicon-minus", //节点被折叠时显示的图标        String
        expandIcon: "glyphicon glyphicon-plus", //节点展开时显示的图标        String
        emptyIcon: "glyphicon", //当节点没有子节点的时候显示的图标              String
        enableLinks: false, //是否将节点文本呈现为超链接。前提是在每个节点基础上，必须在数据结构中提供href值。        Boolean
        highlightSearchResults: true, //是否高亮显示被选中的节点        Boolean
        levels: 2, //设置整棵树的层级数  Integer
        multiSelect: false, //是否可以同时选择多个节点      Boolean
        onhoverColor: "#ad658a", //光标停在节点上激活的默认背景色      String
        //selectedIcon: "glyphicon glyphicon-stop", //节点被选中时显示的图标     String

        searchResultBackColor: "", //当节点被选中时的背景色
        searchResultColor: "", //当节点被选中时的前景色

        selectedBackColor: "#413a3e", //当节点被选中时的背景色
        selectedColor: "#ef9bc7", //当节点被选中时的前景色

        showBorder: true, //是否在节点周围显示边框
        showCheckbox: false, //是否在节点上显示复选框
        showIcon: true, //是否显示节点图标
        showTags: false, //是否显示每个节点右侧的标记。前提是这个标记必须在每个节点基础上提供数据结构中的值。
        uncheckedIcon: "glyphicon glyphicon-unchecked", //未选中的复选框时显示的图标，可以与showCheckbox一起使用
        onNodeSelected: function (event, data) {//节点选中事件
            vm.selectedNode = data.nodeId;
            $(this).treeview("expandNode", [data.nodeId]);
            vm.PID = data.ID;
        }
    }

    //绑定数据
    function GetTreeData() {
        var condition = [{ name: "OrgSn", value: "ORG001" }]
        vm.promise = AjaxService.GetPlans("SysOrg", condition).then(function (data) {
            vm.options.data = data;
            $('#tree').treeview(vm.options);
            if (!vm.selectedNode) {
                $("#tree").treeview("selectNode", [0]);
            }
            else {
                $("#tree").treeview("selectNode", [vm.selectedNode]);
            }
            $('#tree').treeview('collapseAll', { silent: true });
        });
    }

    //查询树状节点
    function searchTreeView(value, attr) {
        var arr = $('#tree').treeview('search', [value, attr]);
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

