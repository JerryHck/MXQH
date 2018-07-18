'use strict';

angular.module('app')
.controller('AddDailogCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'Form',
function ($scope, $http, Dialog, AjaxService, toastr, Form) {
    var vm = this;
    vm.Insert = Insert;
    vm.isExists = isExists;
    vm.LoadAdd = LoadAdd;
    vm.NewItem = { LoadFiles: [] };
    vm.Save = Save;
    vm.Edit = Edit;
    vm.DeleteLoad = DeleteLoad;
    vm.LoadDrop = LoadDrop;
    vm.LoadDrag = LoadDrag;
    vm.SaveToJson = SaveToJson;
    vm.Delete = Delete;

    //
    GetList();
    function GetList() {
        vm.promise = AjaxService.GetJson('Dialog.json', '').then(function (data) {
            vm.List = data;
        });
    }

    function Insert() {
        vm.isAdd = !vm.isAdd;
        vm.form = Form[0];
    }

    function Edit(item) {
        vm.isAdd = !vm.isAdd;
        vm.form = Form[1];
        vm.NewItem = item;
    }

    function LoadAdd() {
        if (vm.loadFile) {
            var have = false;
            angular.forEach(vm.NewItem.LoadFiles, function (f) {
                if (f == vm.loadFile) {
                    have = true; return;
                }
            });
            if (!have) {
                vm.NewItem.LoadFiles.push(vm.loadFile);
                vm.loadFile = undefined;
            }
        }
    }

    function Save() {
        if (vm.form.index == 0) {
            vm.List.push(vm.NewItem);
            vm.NewItem = { LoadFiles: [] };
        }
        vm.isAdd = !vm.isAdd;
    }

    function DeleteLoad(index) {
        vm.NewItem.LoadFiles.splice(index, 1);
    }

    function isExists(name) {
        if (name) {
            var have = false;
            for (var i = 0, len = vm.List.length; i < len; i++) {
                if (name == vm.List[i].name) {
                    have = true;
                    break;
                }
            }
            vm.DailogForm.name.$setValidity('unique', !have);
        }
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

    function SaveToJson() {
        vm.promise = AjaxService.AddDailog(JSON.stringify(vm.List)).then(function (data) {
            toastr.success('储存成功');
        });
    }
    
    function Delete(item) {
        var index = -1;
        for (var i = 0, len = vm.List.length; i < len; i++) {
            if (item.name == vm.List[i].name) {
                index = i;
                break;
            }
        }
        vm.List.splice(index, 1);
        vm.promise = AjaxService.AddDailog(JSON.stringify(vm.List)).then(function (data) {
            toastr.success('删除成功');
            GetList();
        });
    }

}
]);