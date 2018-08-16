'use strict';

angular.module('app')
.controller('DialogCtrl', ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$rootScope',
function ($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    vm.form = Form[ItemData.name ? 1 : 0];
    vm.NewItem = ItemData.name ? ItemData : { LoadFiles: [] };
    vm.NewItem.CreateBy = $rootScope.User.Emp.EmpNo;
    vm.NewItem.Action = ItemData.name ? "U" : "I";
    vm.isExists = isExists;
    vm.LoadAdd = LoadAdd;

    vm.Save = Save;
    vm.DeleteLoad = DeleteLoad;
    vm.LoadDrop = LoadDrop;
    vm.LoadDrag = LoadDrag;
    //取消
    vm.cancel = cancel;


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
}
]);