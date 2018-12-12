'use strict';

angular.module('app')
.controller('SnCodeDeleteCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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

    GetItemRemakList();
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
        if (vm.Ser.DeleteBy) {
            list.push({ name: "DeleteBy", value: vm.Ser.DeleteBy });
        }
        if (vm.Ser.StartDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.StartDate, type: ">=" });
        }
        if (vm.Ser.EndDate) {
            list.push({ name: "DeleteDate", value: vm.Ser.EndDate, type: "<=" });
        }
        vm.promise = AjaxService.GetPlansPage("MESSnDelete", list, vm.page.index, vm.page.size).then(function (data) {
            vm.DeleteList = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            DeleteCode();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {
        var en = {};
        en.name = "InternalCode";
        en.value = vm.DeleteItem.InternalCode;
        AjaxService.GetPlan("MESSNCode", en).then(function (data) {
            var mss = "生产条码 [" + vm.DeleteItem.InternalCode + '] ';
            if (!data.InternalCode) {
                vm.DeleteItem.InternalCode = undefined;
                //toastr.error(mes);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有绑定SN码' });
            }
            else {
                vm.SNCode = data.SNCode;
                var sub = data.SNCode.substring(0, 2);
                if (sub != '83' && sub != '93' && sub != '45') {
                    vm.DeleteItem.InternalCode = undefined;
                    //toastr.error(mes);
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '不允许解绑该SN码[' + data.SNCode + ']' });
                }
                else if (vm.IsAuto) {
                    DeleteCode2();
                }
            }
        });
    }

    function DeleteCode2() {
        vm.promise = AjaxService.ExecPlan("MESSnDelete", 'delete', vm.DeleteItem).then(function (data) {
            var mss = "内部码 [" + vm.DeleteItem.InternalCode + '] 解绑SN码[' + vm.SNCode + ']成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.DeleteItem.InternalCode = undefined;
            vm.SNCode = undefined;
            vm.Focus = 0;
        });
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESSnDelete", 'excel', vm.Ser).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    function GetItemRemakList() {
        AjaxService.GetPlans("MESCodeDelRemark").then(function (data) {
            vm.ItemRemarkList = data;

        })
    }
}
]);