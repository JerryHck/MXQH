﻿'use strict';

angular.module('app')
.controller('SerialNumberCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = { StsInfo: "S" };

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.Open = Open;
    vm.Copy = Copy;
    vm.Delete = Delete;
    vm.Preview = Preview;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    
    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("SerialNumberSet", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            for (var i = 0, len = vm.List.length; i < len; i++) {
                Preview(vm.List[i]);
            }

            vm.page.total = data.Count;
        });
    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("SerialNumberSet", list).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
        var list = [];
        if (vm.Ser.TbName) {
            list.push({ name: "TbName", value: vm.Ser.TbName });
        }
        if (vm.Ser.ClName) {
            list.push({ name: "ClName", value: vm.Ser.ClName });
        }
        if (vm.Ser.StsInfo) {
            list.push({ name: "StsInfo", value: vm.Ser.StsInfo });
        }
        return list;
    }

    function Copy(item) {
        var newItem = angular.copy(item);
        newItem.ClName = undefined;
        Open(newItem);
    }

    function Open(item) {
        Dialog.OpenDialog("SerialNumberDialog", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function Preview(item) {
        var en = {};
        en.TbName = item.TbName;
        en.ClName = item.ClName;
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            item.PrevSN = data.data[0] ? data.data[0].SN : "";
        })
    }

    function Delete(item) {
        AjaxService.PlanDelete("Vender", item).then(function (data) {
            toastr.success('删除成功');
            PageChange();
        });
    }

}]);
