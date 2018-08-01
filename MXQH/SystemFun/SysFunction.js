'use strict';

angular.module('app')
.controller('FunctionCtrl', ['$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($scope, $http, Dialog, toastr, AjaxService, MyPop) {

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
    vm.Delete = Delete;
    //功能
    vm.SelectFun = SelectFun;
    vm.AddFun = AddFun;
    vm.SaveFun = SaveFun;
    vm.FunDrop = FunDrop;
    vm.FunDrag = FunDrag;

    //
    vm.OpenFunIcon = OpenFunIcon;
    vm.FunLoadDrop = FunLoadDrop;
    vm.FunLoadDrag = FunLoadDrag;
    vm.FunLoadDelete = FunLoadDelete;
    vm.FunLoadAdd = FunLoadAdd;
    vm.SaveFunInfo = SaveFunInfo;
    vm.Cancel = Cancel;
    vm.SelectedRoot = { FunNo: '' };
    vm.editFun = false;

    var en = {};
    en.name = 'FunType';
    en.value = 1
    vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
        vm.List = data;
    });

    //查询所有功能
    function SelectAllFun() {
        if (!showPop(vm.editFun)) {
            vm.SelectedRoot = { FunNo: '' };
            var en = {};
            en.name = 'FunType';
            en.value = 2
            vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
                vm.FunList = data;
            });
        }
    }

    //选择根目录
    function SelectRoot(root) {
        if (!showPop(vm.editFun)) {
            if (vm.editFun) return;
            vm.SelectedRoot = root;
            vm.FunList = root.FunList || [];
            angular.forEach(vm.List, function (r) {
                r.selected = false;
            });
            root.selected = true;
        }
    }

    //root drop
    function RootDrop(root, index) {
        if (!showPop(vm.editFun)) {
            var en = angular.copy(root);
            vm.List.splice(vm.RootIndex, 1);
            vm.List.splice(index, 0, en);
        }
    }

    //
    function RootDrag(root, index) {
        if (!showPop(vm.editFun)) {
            vm.RootIndex = index;
        }
    }

    //添加根目录
    function AddRoot() {
        if (!showPop(vm.editFun)) {
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
            vm.SelectedRoot = root;
            vm.IsEditing = true;
            vm.editRootItem = root;
            vm.List.push(root);
        }
    }

    function EditRoot(root) {
        if (!showPop(vm.editFun)) {
            if (vm.IsEditing = true) {
                DoneRootEdit();
            }
            root.selected = true;
            root.editing = true;
            vm.editRootItem = root;
            vm.IsEditing = true;
        }
    };

    function OpenIcon() {
        if (!showPop(vm.editFun)) {
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
    }

    function DoneRootEdit() {
        if (!showPop(vm.editFun)) {
            if (vm.editRootItem) {
                vm.editRootItem.editing = false;
                vm.editRootItem.selected = false;
                vm.IsEditing = false;
            }
        }
    }

    function SaveRoot() {
        save(vm.List, "1");
    }

    //root drop
    function FunDrop(f, index) {
        if (!MyPop.Show((vm.SelectedRoot.FunNo == ''), '没有选择目录，不能排序功能！') && !showPop(vm.editFun)) {
            var en = angular.copy(f);
            vm.FunList.splice(vm.FunIndex, 1);
            vm.FunList.splice(index, 0, en);
        }
    }

    //
    function FunDrag(f, index) {
        if (!MyPop.Show((vm.SelectedRoot.FunNo == ''), '没有选择目录，不能排序功能！') && !showPop(vm.editFun)) {
            vm.FunIndex = index;
        }
    }

    function Delete(funNo) {
        if (!showPop(vm.editFun)) {
            var json = {};
            json.FunNo = funNo;
            vm.promise = AjaxService.EditBack("sp_DeleteFunction", json).then(function (data) {
                toastr.success('删除成功');
                reflashData();
                //更新功能基本信息
                AjaxService.LoginAction("ReflashRoot");
            })
        }
    }

    function SelectFun(fun) {
        if (!showPop(vm.editFun)) {
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
    }

    function AddFun()
    {
        if (!showPop(vm.editFun)) {
            angular.forEach(vm.FunList, function (f) {
                f.selected = false;
            });
            vm.editFun = true;
            vm.SelectedFun = {};
            vm.SelectedFun.selected = true;
            vm.SelectedFun.FunNo = '-1';
            vm.SelectedFun.FunName = '新功能';
            vm.SelectedFun.FunImge = 'glyphicon glyphicon-chevron-right';
            vm.SelectedFun.SysNo = vm.SelectedRoot.SysNo;
            vm.SelectedFun.ParFunNo = vm.SelectedRoot.FunNo;
            vm.SelectedFun.FunLoad = [];
            vm.FunList.push(vm.SelectedFun);
        }
    }

    function OpenFunIcon() {
        var resolve = {
            Data: function () {
                return vm.SelectedFun.FunImge;
            }
        };
        Dialog.open("IconDailog", resolve).then(function (data) {
            vm.SelectedFun.FunImge = data;
        }).catch(function (reason) {
        });
    }

    function SaveFun()
    {
        save(vm.FunList, "2");
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

    function FunLoadAdd() {
        if (!vm.editFun) return;
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
                vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
                vm.SelectedFun.FunLoad.push(en);
            }
        }
    }

    function Cancel() {
        //vm.SelectedFun = undefined;
        vm.editFun = false;
        console.log($scope.FormFun);
    }

    function SaveFunInfo() {

        vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
        angular.forEach(vm.SelectedFun.FunLoad, function (l, i) {
            l.Id = l.Id || -1;
            l.SortNo = i;
        });
        var en = angular.copy(vm.SelectedFun);
        en.FunLoad = undefined;
        en.ListLoad = JSON.stringify(vm.SelectedFun.FunLoad);
        en.FunHtml = vm.SelectedFun.FunHtml || '';
        en.Controller = vm.SelectedFun.Controller || '';
        en.ControllerAs = vm.SelectedFun.ControllerAs || '';
        en.FunDesc = vm.SelectedFun.FunDesc || '';
        en.OrderBy = vm.FunList.Length || 1;
        en.CreateBy = "Sys";
        en.TempColumns = 'ListLoad';
        vm.promise = AjaxService.EditBack("sp_SaveFunction", en).then(function (data) {
            //更新数据
            reflashData();
            //更新功能基本信息
            AjaxService.LoginAction("ReflashRoot");
            toastr.success('储存成功');
        })
    }

    function reflashData() {
        var en = {};
        en.name = 'FunType';
        en.value = 1
        vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
            vm.List = data;
            angular.forEach(data, function (r) {
                if (r.FunNo == vm.SelectedRoot.FunNo) {
                    vm.FunList = r.FunList || [];
                    r.selected = true;
                    vm.SelectedFun = undefined;
                    vm.editFun = false;
                    return;
                }
            });
        }); 
    }

    function showPop(show)
    {
        return MyPop.Show(show, '功能信息还在编辑，请先保存！')
    }

    function save(list, type) {
        if (!showPop(vm.editFun)) {
            var List = [];
            angular.forEach(list, function (r, i) {
                var en = {};
                en.FunNo = r.FunNo;
                en.FunName = r.FunName;
                en.OrderBy = i;
                en.FunImge = r.FunImge;
                List.push(en);
            });
            var json = {};
            json.FunType = type;
            json.SysNo = "MXQH";
            json.RootList = JSON.stringify(List);
            json.TempColumns = 'RootList';
            vm.promise = AjaxService.EditBack("sp_SaveFunctionRoot", json).then(function (data) {
                toastr.success('储存成功');
                //更新功能基本信息
                AjaxService.LoginAction("ReflashRoot");
            })
        }
    }
}
]);