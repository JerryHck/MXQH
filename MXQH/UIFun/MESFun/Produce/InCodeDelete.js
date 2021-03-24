'use strict';

angular.module('app')
.controller('InCodeDeleteCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { CreateBy: $rootScope.User.UserNo };
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
   
    vm.DeleteItemRemark = DeleteItemRemark;

    vm.InsertItemRemark = InsertItemRemark;

    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    GetItemRemakList();

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
            DeleteCode();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {

        DeleteCode2();

        //var en = {};
        //en.name = "InternalCode";
        //en.value = vm.DeleteItem.InternalCode;
        //AjaxService.GetPlan("MesPlanMain", en).then(function (data) {
        //    var mss = "生产条码 [" + vm.DeleteItem.InternalCode + '] ';
        //    if (!data.InternalCode) {
        //        vm.DeleteItem.InternalCode = undefined;
        //        //toastr.error(mes);
        //        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有上线' });
        //        AjaxService.PlayVoice('error.mp3');
        //    }
        //    else {
        //        AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
        //            if (data2.InternalCode) {
        //                vm.DeleteItem.InternalCode = undefined;
        //                //toastr.error(mes);
        //                var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过SN码[' + data2.SNCode + "], 不可再解绑" };
        //                vm.MesList.splice(0, 0, Msg);
        //                AjaxService.PlayVoice('error.mp3');
        //            }
        //            else if (vm.IsAuto) {
        //                DeleteCode2();
        //            }
        //        })
        //    }
        //});
    }

    function DeleteCode2() {
        var en = angular.copy(vm.DeleteItem);
        console.log(en)
        vm.promise = AjaxService.ExecPlan("MESDeleteCode", 'delete', en).then(function (data) {

            if (data.data[0].MsgType == "Error") {
                //toastr.error(mes);
                var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].Msg };
                vm.MesList.splice(0, 0, Msg);
                AjaxService.PlayVoice('error.mp3');
                vm.DeleteItem.InternalCode = undefined;
                vm.OrderList = data.data1;
                vm.Focus = 0;
            }
            else if (data.data[0].MsgType == "Success") {
                var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg };
                AjaxService.PlayVoice('success.mp3');
                vm.MesList.splice(0, 0, Msg);
                vm.DeleteItem.InternalCode = undefined;
                vm.Focus = 0;
            }
            
        });
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanExcel("MESDeleteCode", 'Excel', vm.Ser).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }


    function InsertItemRemark() {
        vm.promise = AjaxService.PlanInsert("MESCodeDelRemark", vm.NewItemType).then(function (data) {
            toastr.success("新增成功");
            vm.NewItemType = {};
            GetItemRemakList();
        })
    }

    function GetItemRemakList() {
        AjaxService.GetPlans("MESCodeDelRemark").then(function (data) {
            vm.ItemRemarkList = data;

        })
    }

    function DeleteItemRemark(type) {
        MyPop.Confirm({ text: "确定要删除该备注吗" }, function () {
            AjaxService.PlanDelete("MESCodeDelRemark", type).then(function (data) {
                toastr.success("删除成功");
                GetItemRemakList();
            })
        });
    }

}
]);