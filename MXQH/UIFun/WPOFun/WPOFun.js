'use strict';

angular.module('app')
.controller('AuctusWPOFunCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', 'MyPop',
function ($rootScope, $scope, Dialog, AjaxService, toastr, MyPop) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = { State: 0 };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.Finish = Finish;
    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.AucWPO) {
            list.push({ name: "AucWPO", value: vm.Ser.AucWPO });
        }
        if (vm.Ser.MO) {
            list.push({ name: "MO", value: vm.Ser.MO });
        }
        list.push({ name: "State", value: vm.Ser.State });
        
        vm.promise = AjaxService.GetPlansPage("WPOFunPackNum", list, vm.page.index, vm.page.size).then(function (data) {
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

    //完工/返完工
    function Finish(item, state) {
        var en = {};
        en.Id = item.Id;
        en.State = state;
        var txt = state == 1 && item.PackCount.HavePackNum < item.AucPOQty ? "该工单还未包装完成， 是否确定要强制完工?" :
              (state == 1 ? "确定要完工吗?" : "确定要返工吗?");
        MyPop.ngConfirm({ text: txt }).then(function (data) {
            AjaxService.PlanUpdate("WPOFun", en).then(function (data) {
                toastr.success('储存成功');
                Search();
            });
        });
    }

    function Delete(item) {
        AjaxService.GetPlan("WPOPackage", { name: "MOId", value: item.Id }).then(function (data) {
            if (!data.Id) {
                AjaxService.PlanDelete("WPOFun", item).then(function (data) {
                    toastr.success('删除成功');
                    PageChange();
                });
            }
            else {
                toastr.error('工单已经包装不可再删除');
            }
        });
    }

    function Open(item) {
        vm.NewItem = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("WPOFunDialog", vm.NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
