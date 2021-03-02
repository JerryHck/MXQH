'use strict';

angular.module('app')
.controller('ProRouterCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.SelectMate = SelectMate;
    vm.ChangeMateType = ChangeMateType;
    vm.SelectRoute = SelectRoute;
    vm.EditRoute = EditRoute;
    vm.OpenProcedure = OpenProcedure;
    vm.AddRoute = AddRoute;
    //保存路由
    vm.SaveRoute = SaveRoute;

    //工艺流程确认
    vm.Cancel = Cancel;

    vm.Delete = Delete;

    ChangeMateType();

    function ChangeMateType() {
        var list = [{ name: "State", value: 1 }, { name: "MaterialTypeID", value: vm.MateType }];
        vm.promise = AjaxService.GetPlans("MESMate", list).then(function (data) {
            vm.MateList = data;
        });
    }

    //vm.promise = AjaxService.GetPlans("MESMate", [{ name: "State", value: 1 }]).then(function (data) {
    //    vm.MateList = data;
    //});

    vm.promise = AjaxService.GetPlans("MESBoProcedure").then(function (data) {
        vm.ProcedureList = data;
    });

    function SelectMate(item) {
        if (!MyPop.Show(vm.editRoute, '功能信息还在编辑，请先保存！')) {
            vm.SelectetMate = angular.copy(item);
            GetMateRouter();
        }
    }

    function EditRoute(route) {
        route.editing = true;
    }

    function SelectRoute(route) {
        if (!MyPop.Show(vm.editRoute, '功能信息还在编辑，请先保存！')) {
            vm.SelectedRo = angular.copy(route);
        }
    }

    function Cancel() {
        vm.editRoute = false;
        vm.NewRoute = {};
    }

    function GetMateRouter() {
        AjaxService.GetPlans("MESRouteMate", [{ name: "ProductID", value: vm.SelectetMate.Id }]).then(function (data) {
            vm.MateRouteList = data;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].IsDefault) {
                    vm.SelectedRo = angular.copy(data[i]); break;
                }
            }
        });
    }

    function OpenProcedure(item, index) {
        vm.ProcItem = angular.copy(item);
        vm.ProcWPList = angular.copy(vm.SelectedRo.Procedure);
        vm.ProIndex = index;
        if (item.WorkPart && item.WorkPart.RepairTurnStation && vm.ProcWPList && vm.ProcWPList.length > 0) {
            vm.RepairTurnList = item.WorkPart.RepairTurnStation.split(',');
            for (var i = 0, len = vm.RepairTurnList.length; i < len; i++) {
                for (var j = 0, len2 = vm.ProcWPList.length; j < len2; j++) {
                    if (vm.RepairTurnList[i] == vm.ProcWPList[j].boProcedureID) {
                        vm.ProcWPList[j].IsCheck = true;
                    }
                }
            }
        }

        $(".procudure").addClass("active");
    }

    function AddRoute() {
        vm.NewRoute = {
            ID: -1, IsDefault: false, IsControl: false,
            ProductID: vm.SelectetMate.Id
        };
        vm.editRoute = true;
        vm.SelectedRo = vm.NewRoute;
    }

    //保存工艺
    function SaveRoute() {
        var en = {};
        en.ID = vm.SelectedRo.ID;
        en.ProductID = vm.SelectedRo.ProductID;
        en.RouteID = vm.SelectedRo.Route.ID;
        en.IsDefault = vm.SelectedRo.IsDefault;
        en.IsControl = vm.SelectedRo.IsControl;
        en.IsShow = vm.SelectedRo.IsShow == undefined ? true : vm.SelectedRo.IsShow;
        vm.promise = AjaxService.ExecPlan("MESRouteMate", "save", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success("工艺保存成功");
                GetMateRouter();
                vm.editRoute = false;
                vm.NewRoute = {};
            }
        })
    }

    //删除该关系
    function Delete(Id) {
        AjaxService.ExecPlan("MESRouteMate", "delete", { ID: Id }).then(function (data) {
            console.log(data)
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success("删除成功");
                GetMateRouter();
            }
        })
    }

}]);
