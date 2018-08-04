'use strict';

angular.module('app')
.controller('AddDialogCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',  '$rootScope',
function ($scope, $http, Dialog, AjaxService, toastr, $rootScope) {
    var vm = this;
    vm.NewItem = { LoadFiles: [] };

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.JsonToDb = JsonToDb;
    vm.SaveToJson = SaveToJson;

    //
    GetList();
    function GetList() {
        vm.promise = AjaxService.GetPlans('Dialog').then(function (data) {
            vm.List = data;
        });
    }

    function Insert() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        Open("I", resolve);
    }

    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Open("U", resolve);
    }

    function Open(type, resolve) {
        Dialog.open("DialogDialog", resolve).then(function (data) {
            GetList();
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
            var en = { CreateBy: $rootScope.User.Emp.EmpNo };
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
        vm.promise = AjaxService.PlanDelete("Dialog", item).then(function (data) {
            toastr.success('删除成功');
            var index = -1;
            for (var i = 0, len = vm.List.length; i < len; i++) {
                if (item.name == vm.List[i].name) {
                    index = i;
                    break;
                }
            }
            vm.List.splice(index, 1);
        });
    }

}
]);