'use strict';

angular.module('app')
.controller('AddDialogCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {
    var vm = this;
    vm.NewItem = { LoadFiles: [] };
    vm.page = { index: 1, size: 16 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.JsonToDb = JsonToDb;
    vm.SaveToJson = SaveToJson;
    vm.Search = Search;
    vm.KeyDonwSer = KeyDonwSer;
    vm.PageChange = PageChange;

    //
    PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function KeyDonwSer(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Ser.name) {
            Search();
        }
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.name) {
            list.push({ name: "name", value: vm.Ser.name });
        }
        vm.promise = AjaxService.GetPlansPage("Dialog", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function Insert() {
        Open({});
    }

    function Edit(item) {
        Open(item);
    }

    function Open(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("DialogDialog", resolve).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }
    
    function SaveToJson() {
        vm.promise = AjaxService.AddDialog(JSON.stringify(vm.List)).then(function (data) {
            toastr.success('储存成功');
        });
    }

    function JsonToDb() {
        vm.promise = AjaxService.GetJson('Dialog.json', '').then(function (data) {
            var List = [], listLoad = [];
            var en = {};
            en.TempColumns = "List,ListLoad";
            for (var i = 0, len = data.length; i < len; i++) {
                var wait = false;
                var enR = {};
                enR.name = data[i].name;
                enR.templateUrl = data[i].templateUrl;
                enR.controller = data[i].controller;
                enR.controllerAs = data[i].controllerAs;
                enR.size = enR.size || '';
                enR.backdrop = enR.backdrop || '';
                List.push(enR);
                for (var j = 0, len2 = data[i].LoadFiles.length; j < len2; j++) {
                    var enL = {};
                    enL.name = data[i].name;
                    enL.LoadName = data[i].LoadFiles[j].LoadName;
                    enL.SortNo = j;
                    listLoad.push(enL);
                }
            }
            en.List = JSON.stringify(List);
            en.ListLoad = JSON.stringify(listLoad);

            AjaxService.ExecPlan("Dialog", 'import', en).then(function (data) {
                toastr.success('导入路由成功');
            });
        });
    }

    function Delete(item) {
        var en = {};
        en.name = item.name;
        console.log(item);
        vm.promise = AjaxService.PlanDelete("Dialog", en).then(function (data) {
            AjaxService.PlanDelete("DailogLoad", en).then(function (data2) {
                toastr.success('删除成功');
                var index = -1;
                for (var i = 0, len = vm.List.length; i < len; i++) {
                    if (item.name == vm.List[i].name) {
                        index = i;
                        break;
                    }
                }
                vm.List.splice(index, 1);
            })
        });
    }

}
]);