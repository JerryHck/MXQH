'use strict';
angular.module('app')
.controller('SyQPoorCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.ItemData = {};
    vm.NewTopType = {};//新增当前没有的大类
    //vm.GetTreeData = GetTreeData;
    vm.Add = Add;//新增弹出框
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.DataBind = DataBind;
    vm.searchTreeView = searchTreeView;
    vm.AddNewTopType = AddNewTopType;//新增顶级分类
    vm.SaveTopType = SaveTopType;//保存顶级分类
    vm.IsAddTop = false;
    
    //vm.Cancel = Cancel;
    GetTreeData();

    //绑定数据
    function GetTreeData() {
        var condition = [{ name: "PID", value: "-1" }];
        vm.promise = AjaxService.GetPlans("QPoorType", []).then(function (poorType) {
            vm.promise = AjaxService.GetPlans("QPoorTreeView", condition).then(function (data) {
                console.log(poorType);
                //增加nodes属性
                for (var i = 0; i < poorType.length; i++) {
                    poorType[i].nodes = [];
                }
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < poorType.length; j++) {
                        if (poorType[j].text == data[i].TopType) {
                            poorType[j].nodes.push(data[i]);                            
                        }
                    }
                }
                $('#tree').treeview({
                    data: poorType,
                    levels: 3,
                    emptyIcon: "glyphicon",
                    onNodeSelected: function (event, data) {//节点选中时间
                        vm.selectedNode = data.nodeId;                        
                        $(this).treeview("expandNode", [data.nodeId]);
                        vm.ItemData = { PID: data.ID, TopType: data.TopType, ParentType: data.text, Layer: data.Layer };
                        vm.PID = data.ID;
                        vm.TopType = data.TopType;
                        //vm.ParentType = data.text;//data.ParentType == undefined ? data.TopType : data.ParentType;
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
            });
        })
      
    }

    //查询树状节点
    function searchTreeView(value, attr) {
        var arr = $('#tree').treeview('search', [value, attr]);
    }

    //获取所选分类下的子分类
    function DataBind() {
        var condition2 = [{ name: "PID", value: vm.PID }, { name: "TopType", value: vm.TopType }]
        vm.promise = AjaxService.GetPlansPage("QPoorTreeView", condition2, vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        })
    }

    //新增 物料分类
    function Add() {
        $(".pro-file").addClass("active");
        vm.IsEdit = false;
        //vm.ItemData = { PID: vm.PID,TopType:vm.TopType,ParentType:vm.ParentType, };
        console.log(vm.ItemData);
    }

    ////弹出框--放弃按钮
    //function Cancel() {
    //    $(".pro-file").removeClass("active");
    //}

    //编辑 物料分类
    function Edit(item) {
        $(".pro-file").addClass("active");
        vm.IsEdit = true;
        vm.ItemData.ID = item.ID;
        vm.ItemData.ParentType = item.ParentType;
        vm.ItemData.Code = item.Code;
        vm.ItemData.text = item.text;
        vm.ItemData.TopType = item.TopType;
        vm.ItemData.Layer = item.Layer;
        console.log(vm.ItemData);
    }

    //保存 物料分类
    function Save() {
        if (vm.IsEdit) {//修改
            var en = {};
            var li = [];
            en.TempColumns = "List";
            li.push(vm.ItemData);
            en.List = JSON.stringify(li);
            vm.promise = AjaxService.ExecPlan("QPoorTreeView", "Update", en).then(function (data) {
                console.log(data);
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
            console.log(en);
            vm.promise = AjaxService.ExecPlan("QPoorTreeView", "Add", en).then(function (data) {
                console.log(data);
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
        vm.promise = AjaxService.ExecPlan("QPoorTreeView", "Delete", {ID:id}).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                GetTreeData();
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }
    //新增顶级分类
    function AddNewTopType(flag){
        vm.IsAddTop = flag;
    }
    //保存顶级分类
    function SaveTopType(flag) {
        vm.IsAddTop = flag;
        console.log(vm.ItemData);
        console.log(vm.NewTopType);
        vm.ItemData.TopType = vm.NewTopType.TopType;
    }
    
}
])

