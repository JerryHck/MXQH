'use strict';

angular.module('app')
.controller('WPOPackListCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.StateList = [{ State: 0, Name: '包装中' }, { State: 1, Name: '已包装' }, { State: 2, Name: '拆包中' }];
    vm.Ser = { State: 0 };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Print = Print;
    vm.UnDo = UnDo;
    vm.OpenRePack = OpenRePack;

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
        if (vm.Ser.a_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.a_AuctusWPO });
        }
        if (vm.Ser.a_PackageSN) {
            list.push({ name: "PackageSN", value: vm.Ser.a_PackageSN });
        }
        if (vm.Ser.State != undefined) {
            list.push({ name: "State", value: vm.Ser.State });
        }
        vm.promise = AjaxService.GetPlansPage("WPOPackPrint", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        var list = [];
        if (vm.Ser.a_AucMateCode) {
            list.push({ name: "AucMateCode", value: vm.Ser.a_AucMateCode });
        }
        if (vm.Ser.a_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.a_AuctusWPO });
        }
        if (vm.Ser.a_PackageSN) {
            list.push({ name: "PackageSN", value: vm.Ser.a_PackageSN });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("WPOPackPrint", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

    //补打印
    function Print(item) {

        var postData = {}, list = [];
        list.push();
        postData.ParaData = JSON.stringify(item);
        postData.OutList = list;

        AjaxService.Print(item.TemplateId, item.TemplateVersion, postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function UnDo(item) {
        var en = {};
        en.Id = item.Id;
        en.State = 2;
        AjaxService.PlanUpdate("WPOPackage", en).then(function (data) {
            toastr.success("拆包成功");
            PageChange();
        })
    }

    function OpenRePack(item) {
        var NewItem = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("WPORePackageDialog", NewItem).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
