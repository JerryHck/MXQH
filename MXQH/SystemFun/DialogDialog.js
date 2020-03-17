'use strict';

angular.module('app')
.controller('DialogCtrl', ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$rootScope',
function ($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    vm.form = Form[ItemData.name ? 1 : 0];
    vm.NewItem = ItemData.name ? ItemData : { IsSystem: false, LoadFiles: [] };
    vm.NewItem.Action = ItemData.name ? "U" : "I";
    vm.isExists = isExists;
    vm.LoadAdd = LoadAdd;

    vm.Save = Save;
    vm.DeleteLoad = DeleteLoad;
    vm.LoadDrop = LoadDrop;
    vm.LoadDrag = LoadDrag;
    //取消
    vm.cancel = cancel;

    vm.ToggleFile = ToggleFile;

    console.log(vm.NewItem)

    function LoadAdd() {
        if (vm.loadFile) {
            var have = false;
            angular.forEach(vm.NewItem.LoadFiles, function (f) {
                if (f == vm.loadFile) {
                    have = true; return;
                }
            });
            if (!have) {
                vm.NewItem.LoadFiles.push({ LoadName: vm.loadFile });
                vm.loadFile = undefined;
            }
        }
    }

    function Save() {
        for (var i = 0, len = vm.NewItem.LoadFiles.length; i < len; i++) {
            vm.NewItem.LoadFiles[i].SortNo = i;
        }
        vm.NewItem.Temp = JSON.stringify(vm.NewItem.LoadFiles);
        vm.NewItem.TempColumns = "Temp";

        AjaxService.ExecPlan("Dialog", 'save', vm.NewItem).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(vm.NewItem);
        });
    }

    function DeleteLoad(index) {
        vm.NewItem.LoadFiles.splice(index, 1);
    }

    function isExists(name) {
        var en = {};
        en.name = "name";
        en.value = name
        AjaxService.GetPlan("Dialog", en).then(function (data) {
            vm.DialogForm.name.$setValidity('unique', !data.name);
        });
    }

    // drop
    function LoadDrop(load, index) {
        var en = angular.copy(load);
        vm.NewItem.LoadFiles.splice(vm.LoadIndex, 1);
        vm.NewItem.LoadFiles.splice(index, 0, en);
    }

    //
    function LoadDrag(load, index) {
        vm.LoadIndex = index;
    }

    //取消
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };


    //切换文件方式
    function ToggleFile(f) {

        //是新增功能的时候--计算中间文件夹
        var dir = !vm.NewItem.CreateDate ? (new Date()).Format("yyyy") : new Date(vm.NewItem.CreateDate).Format("yyyy");

        //添加文件
        if (vm.NewItem.IsSystem) {
            var have = false, index = -1;
            vm.SelectedFun.FunHtml = vm.OriHtml;
            var js = "CustomFun\\" + dir + "\\" + vm.SelectedFun.DialogNo + '.js';
            angular.forEach(vm.SelectedFun.FunLoad, function (f, i) {
                if (f.LoadName == js) {
                    have = true;
                    index = i; return;
                }
            });
            if (have) {
                vm.SelectedFun.FunLoad.splice(index, 1);
            }
        }
        else {
            var have = false;
            vm.OriHtml = vm.SelectedFun.FunHtml;
            vm.SelectedFun.FunHtml = "CustomFun\\" + dir + "\\" + vm.SelectedFun.DialogNo + '.html';
            var js = "CustomFun\\" + dir + "\\" + vm.SelectedFun.DialogNo + '.js';
            angular.forEach(vm.SelectedFun.FunLoad, function (f) {
                if (f.LoadName == js) {
                    have = true; return;
                }
            });
            if (!have) {
                var en = {};
                en.FunNo = vm.SelectedFun.FunNo;
                en.LoadName = js;
                vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
                vm.SelectedFun.FunLoad.push(en);
            }

            //获取js， html文件
            AjaxService.AjaxHandle("GetFileText", dir + "\\" + ItemData.FunNo).then(function (data) {
                vm.NewItem.Content = {};
                vm.NewItem.Content.Html = (data.Html || "").replace(/ControlNew/g, vm.NewItem.ControllerAs);
                vm.NewItem.Content.Js = (data.Js || "").replace(/NewJsCtrl/g, vm.NewItem.Controller);
            })
        }
    }

}
]);