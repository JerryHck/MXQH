'use strict';

angular.module('app')
.controller('FunctionCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
function ($scope, $http, Dialog, AjaxService) {

    var vm = this;
    //查询所有功能
    vm.SelectAllFun = SelectAllFun;
    //选择跟目录
    vm.SelectRoot = SelectRoot;
    //添加根目录
    vm.AddRoot = AddRoot;
    //编辑根目录
    vm.EditRoot = EditRoot;
    vm.DoneRootEdit = DoneRootEdit;
    //rootDrop
    vm.RootDrop = RootDrop;
    //
    vm.RootDrag = RootDrag;


    vm.SelectedRoot = '';

    GetList();

    function GetList() {
        var en = {};
        en.name = 'FunType';
        en.value = 1
        vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
            vm.List = data;
        });
    }

    //查询所有功能
    function SelectAllFun() {
        vm.RootName = undefined;
        vm.SelectedRoot = '';
        var en = {};
        en.name = 'FunType';
        en.value = 2
        vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
            vm.FunList = data;
        });
    }

    //选择根目录
    function SelectRoot(root) {
        vm.SelectedRoot = root.FunNo;
        vm.FunList = root.FunList;
        angular.forEach(vm.List, function (r) {
            r.selected = false;
            r.editing = false;
        });
        root.selected = true;
    }

    //添加根目录
    function AddRoot()
    {
        var root = {};
        root.FunNo = "-1";
        root.FunName = "新根目录";   
        root.OrderBy = vm.List ? vm.List.Length : 0;
        root.FunType = 1;
        root.SysNo = 'MXQH';
        root.selected = true;
        root.editing = true;

        vm.RootName = root.FunName;

        angular.forEach(vm.List, function (r) {
            r.selected = false;
            r.editing = false;
        });

        vm.List.push(root);
    }

    //root drop
    function RootDrop(root, index)
    {
        var en  =  angular.copy(root);
        vm.List.splice(vm.RootIndex, 1);
        vm.List.splice(index, 0, en);
    }

    //
    function RootDrag(root, index)
    {
        vm.RootIndex = index;
    }

    function EditRoot(root) {
        if (root && root.selected) {
            vm.RootName = root.FunName;
            root.editing = true;
        }
    };

    function DoneRootEdit(root)
    {
        root.FunName = vm.RootName;
        root.editing = false;
    }
}
]);