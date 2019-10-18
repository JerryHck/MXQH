'use strict';

angular.module('app')
.controller('WPOMateCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;
    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.a_MateCode });
        }
        vm.promise = AjaxService.GetPlansPage("WPOMate", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function Add() {
        Open({});
    }

    function Edit(item) {
        Open(item);
    }

    function Delete(item) {
        AjaxService.GetPlan("WPOFun", { name: "AucMateId", value: item.Id }).then(function (data) {
            if (!data.Id) {
                AjaxService.PlanDelete("WPOMate", item).then(function (data) {
                    toastr.success('删除成功');
                    PageChange();
                });
            }
            else {
                toastr.error('料号已经被使用不可再删除');
            }
        });
        
    }

    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_MateCode) {
            list.push({ name: "MateCode", value: vm.Ser.a_MateCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("WPOMate", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function Open(item) {
        vm.NewItem = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("WPOMateDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
