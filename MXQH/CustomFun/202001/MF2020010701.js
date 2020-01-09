'use strict';

angular.module('app')
.controller('CrtlRMOGF', ['$rootScope', 'Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window', '$filter',
function ($rootScope, Dialog, $scope, $http, AjaxService, toastr, $window, $filter) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Focus = 0;
    vm.Edit = Edit;

    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.NgSave = NgSave;


    function Search() {
        vm.page.index = 1;
        PageChange();
    }


    function Edit(e) {

        console.log(e);
        Open(e);

    }


    //不良
    function NgSave() {
        var e = {};
        Open(e);
    }


    function Open(item) {
        Dialog.OpenDialog("ProRegisterDialogGF", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }





    function SaveEdit(index) {
        var en = {};
        en.WorOrder = vm.EditItem.WorOrder;//工单
        en.CustomerOrder = vm.EditItem.CustomerOrder;//客户订单
        en.MaterialName = vm.EditItem.MaterialName;//产品名称
        en.CustomerName = vm.EditItem.CustomerName;//客户名称
        en.SendPlaceName = vm.EditItem.SendPlaceName;//出货地
        en.SecondPoorName = vm.EditItem.SecondPoorName;//不良种类
        en.SecondPoorName = vm.EditItem.SecondPoorName;//不良原因

        vm.promise = AjaxService.PlanUpdate("", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("RMOSelectGF", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("", GetContition2()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
        var list = [];
        //if (vm.Ser.InternalCode) {
        //    list.push({ name: "InternalCode", value: '%' + vm.Ser.InternalCode + '%' });
        //}

        //if (vm.Ser.SNCode) {
        //    list.push({ name: "SNCode", value: '%' + vm.Ser.SNCode + '%' });
        //}

        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: '%' + vm.Ser.WorkOrder + '%' });
        }
        return list;
    }

}]);
