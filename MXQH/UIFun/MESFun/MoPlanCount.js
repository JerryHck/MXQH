'use strict';

angular.module('app')
.controller('MoPlanCountCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.SelectedMo = {};
    vm.Option = {
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    };
    vm.MesList = [];

    vm.SelectMo = SelectMo;
    vm.SelectArr = SelectArr;
    vm.AddArrange = AddArrange;
    vm.ChangeMo = ChangeMo;
    //排班
    vm.SaveArrange = SaveArrange;
    vm.OpenMoDialog = OpenMoDialog;

    vm.Cancel = Cancel;
    vm.DeletePer = DeletePer;
    vm.DeleteArr = DeleteArr;

    ////获取全部排产
    //GetMoArrange();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    var conList = [
        { name: "WorkOrder", value: "20%", type: "not like" },
    ];
    //工单获取
    vm.promise = AjaxService.GetPlans("MesMxWOrder", conList).then(function (data) {
        vm.MoList = data;
    });

    function SelectMo(item) {
        if (!MyPop.Show(vm.editArrange, '功能信息还在编辑，请先保存！')) {
            vm.SelectedMo = item;
            GetMoArrange();
            vm.MesLis = [];
            vm.SelectedArrange = {};
        }
    }

    function OpenMoDialog() {
        Dialog.OpenDialog("MESMODialog", {}).then(function (data) {
            vm.SelectedMo = data;
            GetMoArrange();
            vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
                vm.SelectedArrange.WorkOrder = vm.SelectedMo.WorkOrder;
                vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName, ERPQuantity:vm.SelectedMo.ERPQuantity };
                vm.SelectedArrange.LineId = data2.Plan.Line.ID;
                vm.SelectedArrange.Line = { Name: data2.Plan.Line.Name };
                vm.SelectedArrange.LineLeader = data2.Plan.Line.UserName.Id;
                vm.SelectedArrange.MesUser = { Name: data2.Plan.Line.UserName.Name };
                vm.SelectedArrange.StandPerson = data2.Plan.Line.LineNumber
            })
            vm.MesLis = [];
        })
    }

    function SelectArr(item) {
        if (!MyPop.Show(vm.editArrange, '功能信息还在编辑，请先保存！')) {
            console.log(item)
            vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
                vm.OrderData = data2;
                vm.SelectedArrange = angular.copy(item);
                //vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName, ERPQuantity: vm.SelectedMo.ERPQuantity };
                vm.SelectedArrange.LineId=data2.Plan.Line.ID,
                vm.SelectedArrange.Line = { Name: data2.Plan.Line.Name }
            })
            vm.promise = AjaxService.GetPlans("MoPlanCountHis", { name: "PlanDateId", value: item.Id }).then(function (data) {
                vm.HisList = data;
            })
        }
    }

    function Cancel() {
        vm.editArrange = false;
        vm.IsCopy = false;
        if (vm.SelectedArrange.Id == -1) {
            vm.NewArrange = {};
            vm.SelectedArrange = {};
        }
    }


    function GetMoArrange() {
        vm.promise = AjaxService.GetPlans("MoPlanCount", [{ name: "WorkOrder", value: vm.SelectedMo.WorkOrder }]).then(function (data) {
            vm.ArrangeList = data;
        });
    }

    function AddArrange() {
        vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
            vm.OrderData = data2;
            vm.NewArrange = {
                Id: -1,
                PlanDate: (new Date()).Format("yyyy-MM-dd"),
                WorkOrder: vm.SelectedMo.WorkOrder,
                Order: { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName, ERPQuantity: vm.SelectedMo.ERPQuantity },
                LineId: data2.Plan.Line.ID,
                Line: { Name: data2.Plan.Line.Name },
                LineLeader: data2.Plan.Line.UserName.Id,
                MesUser: { Name: data2.Plan.Line.UserName.Name },
                StandPerson: data2.Plan.Line.LineNumber
            };
            vm.editArrange = true;
            vm.SelectedArrange = vm.NewArrange;
        })
    }

    //保存排班
    function SaveArrange() {
        var en = angular.copy(vm.SelectedArrange);
        en.Order = undefined;
        en.Line = undefined;
        en.MesUser = undefined;
        en.Dtl = undefined;
        vm.promise = AjaxService.ExecPlan("MoPlanCount", "save", en).then(function (data) {
            if (data.data[0].MsgType == "Seccuss") {
                toastr.success("排产保存成功");
                vm.editArrange = false;
                //vm.SelectedArrange = undefined;
                vm.NewArrange = {};
                GetMoArrange();
            }
            else {
                toastr.error(data.data[0].MsgText);
            }
        })
    }

    //改变工单
    function ChangeMo() {
        GetMoArrange();
        vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
            vm.SelectedArrange.WorkOrder= vm.SelectedMo.WorkOrder;
            vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName };
            vm.SelectedArrange.LineId= data2.Plan.Line.ID;
            vm.SelectedArrange.Line= { Name: data2.Plan.Line.Name };
            vm.SelectedArrange.LineLeader= data2.Plan.Line.UserName.Id;
            vm.SelectedArrange.MesUser= { Name: data2.Plan.Line.UserName.Name };
            vm.SelectedArrange.StandPerson= data2.Plan.Line.LineNumber
        })
        vm.MesLis = [];
    }

    //删除排班
    function DeleteArr(item) {
        vm.promise = AjaxService.ExecPlan("MESMoLineArrange", "del", item).then(function (data) {
            toastr.success("排班保存成功");
            GetMoArrange();
        })
    }

    //删除排班人员
    function DeletePer(index) {
        MyPop.ngConfirm({ text: "确定要删除吗?" }).then(function (data) {
            vm.SelectedArrange.Dtl.splice(index, 1);
            CalPer();
        });
    }

    //验证是否存在
    function isExists() {
        if (vm.SelectedRo.RoutingName) {
            var en = [{ name: "RoutingName", value: vm.SelectedRo.RoutingName },
                { name: "ID", value: vm.SelectedRo.ID, type: "!=" }];
            AjaxService.GetPlan('BoRouting', en).then(function (data) {
                vm.RouteForm.RouteName.$setValidity('unique', !data.RoutingName);
            });
        }
    }

}]);
