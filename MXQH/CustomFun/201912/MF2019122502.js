'use strict';

angular.module('app')
.controller('Repairctrl', ['$rootScope', 'Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window', '$filter',
function ($rootScope, Dialog, $scope, $http, AjaxService, toastr, $window, $filter) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page2 = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Focus = 0;
    vm.Insert = Insert;
    //vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    //vm.Delete = Delete;
    //vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.PageChange2 = PageChange2;
    vm.Search2 = Search2;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;



    function SelectTab(index) {
        vm.Focus = index;
    }
    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    function Search2() {
        vm.page2.index = 1;
        PageChange2();
    }

    //function Insert() {
    //    vm.NewItem = {};
    //    vm.IsInsert = true;
    //}

    function Insert() {
        Open({});
    }

    function Edit(e) {
        console.log(e);
        Open(e);
    }

    function Open(item) {
        Dialog.OpenDialog("RMORepairDialog", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    //function SaveInsert() {
    //    vm.promise = AjaxService.PlanInsert("MESvw_qlBadAcquisitionHH", vm.NewItem).then(function (data) {
    //        PageChange();
    //        toastr.success('新增成功');
    //        vm.IsInsert = false;
    //    });
    //}

    //function Edit(item) {
    //    for (var i = 0, len = vm.List.length; i < len; i++) {
    //        vm.List[i].IsEdit = false;
    //    }
    //    vm.EditItem = angular.copy(item);
    //    item.IsEdit = true;
    //}

    //function Delete(item) {
    //    var en = angular.copy(item);
    //    en.ItemForm = undefined;
    //    vm.promise = AjaxService.PlanDelete("MESvw_qlBadAcquisitionHH", en).then(function (data) {
    //        PageChange();
    //        toastr.success('删除成功');
    //    });
    //}

    //function SaveEdit(index) {
    //    var en = {};
    //    en.IsRepair = vm.EditItem.IsRepair;
    //    en.RepairTime = vm.EditItem.RepairTime;
    //    en.WorOrder = vm.EditItem.WorOrder;
    //    en.CustomerOrder = vm.EditItem.CustomerOrder;
    //    en.MaterialName = vm.EditItem.MaterialName;
    //    en.CustomerName = vm.EditItem.CustomerName;
    //    en.BarCode = vm.EditItem.BarCode;
    //    en.CreateDate = vm.EditItem.CreateDate;
    //    en.FirstPoorName = vm.EditItem.FirstPoorName;
    //    en.SecondPoorName = vm.EditItem.SecondPoorName;
    //    en.CreateName = vm.EditItem.CreateName;
      
    //    vm.promise = AjaxService.PlanUpdate("MESvw_qlBadAcquisitionHH", en).then(function (data) {
    //        PageChange();
    //        toastr.success('更新成功');
    //    });
    //}

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("SelectProRepair", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function PageChange2() {
        vm.promise = AjaxService.GetPlansPage("SelectRMORepair", GetContition2(), vm.page2.index, vm.page2.size).then(function (data) {
            vm.List2 = data.List;
            vm.page2.total = data.Count;
        });
    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("SelectRMORepair", GetContition2()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        var startTime = new Date(vm.Ser.a_CreateDate);
        var endTime = new Date(vm.Ser.b_CreateDate);
        var start = $filter('date')(startTime, "yyyy-MM-dd HH:mm:ss");
        var end = $filter('date')(endTime, "yyyy-MM-dd HH:mm:ss");


        list.push({ name: "IsRepair", value: '0' });
        if (start) {
            list.push({ name: "CreateDate", value: start, type: '>=' });
        }
        if (end) {
            list.push({ name: "CreateDate", value: end, type: '<=' });
        }
        return list;
    }
    function GetContition2() {
        var list = [];
        var startTime2 = new Date(vm.Ser.a_CreateDate2);
        var endTime2 = new Date(vm.Ser.b_CreateDate2);
        var start2 = $filter('date')(startTime2, "yyyy-MM-dd HH:mm:ss");
        var end2 = $filter('date')(endTime2, "yyyy-MM-dd HH:mm:ss");

        //alert(start2 + "   " + end2);
        if (start2) {
            list.push({ name: "ModifyDate", value: start2, type: '>=' });
        }
        if (end2) {
            list.push({ name: "ModifyDate", value: end2, type: '<=' });
        }
        if (vm.Ser.BarCode) {
            list.push({ name: "BarCode", value: '%' + vm.Ser.BarCode + '%' });
        }
        if (vm.Ser.ModifyBy) {
            list.push({ name: "ModifyBy", value: '%' + vm.Ser.ModifyBy + '%' });
        }

        list.push({ name: "IsRepair", value: '1' });

        return list;
    }
}]);
