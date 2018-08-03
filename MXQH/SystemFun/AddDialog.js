'use strict';

angular.module('app')
.controller('AddDialogCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'Form',
function ($scope, $http, Dialog, AjaxService, toastr, Form) {
    var vm = this;
    vm.NewItem = { LoadFiles: [] };

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;

    //
    GetList();
    function GetList() {
        vm.promise = AjaxService.GetJson('Dialog.json', '').then(function (data) {
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