'use strict';

angular.module('app')
.controller('FunctionCtrl', ['$scope', '$http', 'Dialog', 'toastr', 'AjaxService',
function ($scope, $http, Dialog, toastr, AjaxService) {

    var vm = this;
    //查询所有功能
    vm.SelectAllFun = SelectAllFun;
    //选择跟目录
    vm.SelectRoot = SelectRoot;
    //添加根目录
    vm.AddRoot = AddRoot;
    //编辑根目录
    vm.EditRoot = EditRoot;
    //图标窗口
    vm.OpenIcon = OpenIcon;
    //编辑根目录
    vm.DoneRootEdit = DoneRootEdit;
    //rootDrop
    vm.RootDrop = RootDrop;
    //调整根目录顺序
    vm.RootDrag = RootDrag;
    //保存根目录
    vm.SaveRoot = SaveRoot;
    //删除
    vm.DeleteRoot = DeleteRoot;
    //功能
    vm.SelectFun = SelectFun;
    vm.AddFun = AddFun;

    //
    vm.FunLoadDrop = FunLoadDrop;
    vm.FunLoadDrag = FunLoadDrag;
    vm.FunLoadDelete = FunLoadDelete;
    vm.FunLoadAdd = FunLoadAdd;
    vm.SaveFunInfo = SaveFunInfo;

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
        });
        root.selected = true;
    }

    //root drop
    function RootDrop(root, index) {
        var en = angular.copy(root);
        vm.List.splice(vm.RootIndex, 1);
        vm.List.splice(index, 0, en);
    }

    //
    function RootDrag(root, index) {
        vm.RootIndex = index;
    }

    //添加根目录
    function AddRoot() {
        var root = {};
        root.FunNo = "-1";
        root.FunName = "新根目录";
        root.OrderBy = vm.List ? vm.List.Length : 0;
        root.FunType = 1;
        root.SysNo = 'MXQH';
        root.FunImge = 'glyphicon glyphicon-chevron-right';
        root.editing = true;
        angular.forEach(vm.List, function (r) {
            r.selected = false;
        });
        vm.SelectedRoot = root.FunNo;
        vm.IsEditing = true;
        vm.editRootItem = root;
        vm.List.push(root);
    }

    function EditRoot(root) {
        if (vm.IsEditing = true) {
            DoneRootEdit();
        }
        root.selected = true;
        root.editing = true;
        vm.editRootItem = root;
        vm.IsEditing = true;
    };

    function OpenIcon() {
        var resolve = {
            Data: function () {
                return vm.editRootItem.FunImge;
            }
        };
        Dialog.open("IconDailog", resolve).then(function (data) {
            vm.editRootItem.FunImge = data;
        }).catch(function (reason) {
        });
    }

    function DoneRootEdit() {
        if (vm.editRootItem) {
            vm.editRootItem.editing = false;
            vm.editRootItem.selected = false;
            vm.IsEditing = false;
        }
    }

    function SaveRoot() {
        var List = [];
        angular.forEach(vm.List, function (r, i) {
            var en = {};
            en.FunNo = r.FunNo;
            en.FunName = r.FunName;
            en.OrderBy = i;
            en.FunImge = r.FunImge;
            List.push(en);
        });
        var json = {};
        json.FunType = '1';
        json.SysNo = 'MXQH';
        json.RootList = JSON.stringify(List);
        json.TempColumns = 'RootList';
        vm.promise = AjaxService.EditBack("sp_SaveFunctionRoot", json).then(function (data) {
            toastr.success('储存成功');
        })
    }

    function DeleteRoot(root) {
        var json = {};
        json.FunNo = root.FunNo;
        vm.promise = AjaxService.EditBack("sp_DeleteFunction", json).then(function (data) {
            toastr.success('删除成功');
            GetList();
        })
    }

    function SelectFun(fun) {
        angular.forEach(vm.FunList, function (f) {
            f.selected = false;
        });

        fun.selected = true;
        vm.editFun = false;
        var en = {};
        en.name = "FunNo";
        en.value = fun.FunNo;
        AjaxService.GetEntity("Function", en).then(function (data) {
            vm.SelectedFun = data;
        });
    }

    function AddFun()
    {
        angular.forEach(vm.FunList, function (f) {
            f.selected = false;
        });
        vm.editFun = true;
        vm.SelectedFun = {};
        vm.SelectedFun.selected = true;
        vm.SelectedFun.FunNo = '-1';
        vm.SelectedFun.FunName = '新功能';
        vm.SelectedFun.FunLoad = [];
        vm.FunList.push(vm.SelectedFun);
    }

    //FunLoad drop
    function FunLoadDrop(load, index) {
        var en = angular.copy(load);
        vm.SelectedFun.FunLoad.splice(vm.LoadIndex, 1);
        vm.SelectedFun.FunLoad.splice(index, 0, en);
    }

    //
    function FunLoadDrag(load, index) {
        vm.LoadIndex = index;
    }

    function FunLoadDelete(index) {
        vm.SelectedFun.FunLoad.splice(index, 1);
    }

    function FunLoadAdd(){
        if (vm.loadFile) {
            var have = false;
            angular.forEach(vm.SelectedFun.FunLoad, function (f) {
                if (f.LoadName == vm.loadFile) {
                    have = true; return;
                }
            });
            if (!have) {
                var en = {};
                en.FunNo = vm.SelectedFun.FunNo;
                en.LoadName = vm.loadFile;
                console.log(en);
                vm.SelectedFun.FunLoad.push(en);
            }
        }
    }

    function SaveFunInfo() {

        var list = [];

        angular.forEach(vm.SelectedFun.FunLoad, function (l, i) {
            l.SortNo = i;
            list.push(l);
        });

        vm.SelectedFun.ListLoad = JSON.stringify(list);
        vm.SelectedFun.TempColumns = 'ListLoad';
        vm.promise = AjaxService.EditBack("sp_SaveFunction", vm.SelectedFun).then(function (data) {
            vm.SelectedFun = undefined;
            toastr.success('储存成功');
        })
    }
}
]);