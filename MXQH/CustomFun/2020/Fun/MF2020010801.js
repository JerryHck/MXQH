'use strict';

angular.module('app')
.controller('CtrlGF', ['$rootScope', 'Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window', '$filter',
function ($rootScope, Dialog, $scope, $http, AjaxService, toastr, $window, $filter) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page2 = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Focus = 0;
    vm.Insert = Insert;
    vm.Edit = Edit;
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

    function Insert() {
        Open({});
    }

    function Edit(e) {
        console.log(e);
        Open(e);
    }

    function Open(item) {
        Dialog.OpenDialog("RMORepairDialogGF", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("SelectProRepairGF", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function PageChange2() {
        vm.promise = AjaxService.GetPlansPage("SelectRMORepairGF", GetContition2(), vm.page2.index, vm.page2.size).then(function (data) {
            vm.List2 = data.List;
            vm.page2.total = data.Count;
        });
    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("SelectRMORepairGF", GetContition2()).then(function (data) {
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
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: '%'+vm.Ser.SNCode+'%' });
        }
        if (vm.Ser.CreateBy) {
            list.push({ name: "CreateBy", value: vm.Ser.CreateBy });
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
      
        if (vm.Ser.ModifyBy) {
            list.push({ name: "ModifyBy", value: '%' + vm.Ser.ModifyBy + '%' });
        }
        if (vm.Ser.BSN) {
            list.push({ name: "BSN", value: '%' + vm.Ser.BSN + '%' });
        }

        list.push({ name: "IsRepair", value: '1' });
        

        return list;
    }
}]);
