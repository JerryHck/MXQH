'use strict';

angular.module('app')
.controller('PackOnlineDeleteCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

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
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
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
        vm.promise = AjaxService.GetPlansPage("MESPackOnlineDelete", list, vm.page.index, vm.page.size).then(function (data) {
            vm.DeleteList = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.BSN) {
            DeleteCode();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {
        var en = {};
        if (vm.IsAuto) {
            DeleteCode2();
        }
    }

    function DeleteCode2() {
        vm.promise = AjaxService.ExecPlan("MESPackOnlineDelete", 'delete', vm.DeleteItem).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                //toastr.error(mes);
                var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg };
                vm.MesList.splice(0, 0, Msg);
                vm.DeleteItem.BSN = undefined;
                vm.Focus = 0;
            }
            else if (data.data[0].MsgType == "Success") {
                var mss = "条码 [" + vm.DeleteItem.BSN + '] 解绑成功';
                var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
                AjaxService.PlayVoice('success.mp3');
                vm.MesList.splice(0, 0, Msg);
                vm.DeleteItem.BSN = undefined;
                vm.Focus = 0;
            }
            
        });
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESPackOnlineDelete", 'Excel', vm.Ser).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

}
]);