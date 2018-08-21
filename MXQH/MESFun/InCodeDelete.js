﻿'use strict';

angular.module('app')
.controller('InCodeDeleteCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.DeleteCode = DeleteCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;
   

    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    

    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.WorkOrder });
        }
        if (vm.Ser.DeleteBy) {
            list.push({ name: "DeleteBy", value: vm.Ser.DeleteBy });
        }
        if (vm.Ser.StartDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.StartDate, type: ">=" });
        }
        if (vm.Ser.EndDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.EndDate, type: "<=" });
        }
        vm.promise = AjaxService.GetPlansPage("MESDeleteCode", list, vm.page.index, vm.page.size).then(function (data) {
            vm.DeleteList = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            en.name = "InternalCode";
            en.value = vm.DeleteItem.InternalCode;
            AjaxService.GetPlan("MesPlanMain", en).then(function (data) {
                var mss = "生产条码 [" + vm.DeleteItem.InternalCode + '] ';
                if (!data.InternalCode) {
                    vm.DeleteItem.InternalCode = undefined;
                    //toastr.error(mes);
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有上线' });
                }
                else {
                    AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
                        if (data2.InternalCode) {
                            vm.DeleteItem.InternalCode = undefined;
                            //toastr.error(mes);
                            var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过SN码[' + data2.SNCode + "], 不可再解绑" };
                            vm.MesList.splice(0, 0, Msg);
                        }
                        else if (vm.IsAuto) {
                            DeleteCode();
                        }
                    })
                }
            });
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {
        vm.promise = AjaxService.ExecPlan("MESDeleteCode", 'delete', vm.DeleteItem).then(function (data) {
            var mss = "内部码 [" + vm.DeleteItem.InternalCode + '] 解绑成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.DeleteItem.InternalCode = undefined;
            vm.Focus = 0;
        });
    }

    function ExportExcel() {
        var sheet = {};
        sheet.SheetName = "内部码解绑记录信息表";
        sheet.ColumnsName = ["内部码", "原工单", "品名", "现工单", '现品名', '操作者', '操作日期', '备注']
        sheet.FirstColunms = false;
        vm.promise = AjaxService.ExecPlanToExcel("MESDeleteCode", 'Excel', vm.Ser, sheet).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }
}
]);