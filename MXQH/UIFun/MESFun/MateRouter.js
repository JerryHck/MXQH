'use strict';

angular.module('app')
.controller('MESProductRouteCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.SelectMate = SelectMate;
    vm.SelectRoute = SelectRoute;
    vm.EditRoute = EditRoute;
    vm.OpenProcedure = OpenProcedure;
    vm.AddProcedure = AddProcedure;
    vm.RepairCheck = RepairCheck;
    vm.ChangeProc = ChangeProc;
    vm.RoProDelete = RoProDelete;
    vm.AddRoute = AddRoute;
    //保存路由
    vm.SaveRoute = SaveRoute;
    vm.isExists = isExists;

    //工艺流程确认
    vm.ProcOk = ProcOk;
    vm.Cancel = Cancel;

    vm.Drop = Drop;
    vm.Drag = Drag;

    vm.Delete = Delete;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    vm.promise = AjaxService.GetPlans("MESMate", [{ name: "State", value: 1 }]).then(function (data) {
        vm.MateList = data;
    });

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

    function ChangeProc() {
        vm.ProcItem.Item2 = vm.ProcItem.ProcedureInfo.LowerFPY;
        vm.ProcItem.Item4 = vm.ProcItem.ProcedureInfo.LowerFPY;
    }

    function GetMateRouter() {
        AjaxService.GetPlans("MesBoRouting", [{ name: "ProductID", value: vm.SelectetMate.Id }]).then(function (data) {
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

    //添加工艺流程
    function AddProcedure() {

        var en = [{ name: "RoutingID", value: vm.SelectedRo.ID },
                { name: "MaterialID", value: vm.SelectetMate.Id },
                { name: "Status", value: 4, type: "!=" }];
        AjaxService.GetPlan("MESPlanExMain", en).then(function (data) {
            //if (data.ID) {
            //    toastr.error("工艺正在生产，无法添加");
            //}
            //else {
                vm.ProcItem = {
                    ID: -1, boRoutingID: vm.SelectedRo.ID, ProcedureInfo: vm.ProcedureList[0],
                    Unit: 'PCS/H/人', Unit: 'PCS/H/人', Remark: "1", StandardCapacity: 3
                };
                vm.SelectedRo.Procedure = vm.SelectedRo.Procedure || [];
                vm.ProIndex = vm.SelectedRo.Procedure.length;
                vm.ProIndex = vm.ProIndex || 0;
                vm.ProcWPList = angular.copy(vm.SelectedRo.Procedure);
                vm.ProcWPList == vm.ProcWPList || [];
                vm.ProcWPList.push(vm.ProcItem);
                ChangeProc();
                $(".procudure").addClass("active");
            //}
        })
    }
    //返修工序选择
    function RepairCheck() {
        vm.RepairTurnList = [];
        for (var j = 0, len2 = vm.ProcWPList.length; j < len2; j++) {
            if (vm.ProcWPList[j].IsCheck) {
                vm.RepairTurnList.push(vm.ProcWPList[j].ProcedureInfo.ID);
            }
        }
    }

    //工艺流程确认
    function ProcOk() {
        //新增时
        var RePair = '';
        vm.RepairTurnList = vm.RepairTurnList || [];
        for (var j = 0, len2 = vm.RepairTurnList.length; j < len2; j++) {
            RePair += vm.RepairTurnList[j] + ','
        }

        if (vm.ProcItem.ID == -1) {
            vm.ProcItem.WorkPart = {};
            vm.ProcItem.WorkPart.RepairTurnStation = RePair;
            var have = false;
            for (var i = 0, len = vm.SelectedRo.Procedure.length; i < len; i++) {
                if (vm.ProcItem.ProcedureInfo.ID == vm.SelectedRo.Procedure[i].ProcedureInfo.ID) {
                    have = true;
                    break;
                }
            }
            if (!have) {
                vm.SelectedRo.Procedure.push(vm.ProcItem);
            }
        }
        else {
            vm.ProcItem.WorkPart.RepairTurnStation = RePair;
            vm.SelectedRo.Procedure[vm.ProIndex] = angular.copy(vm.ProcItem)
        }
        $(".procudure").removeClass("active");
    }

    function AddRoute() {
        vm.NewRoute = {
            ID: -1, RoutingName: "新路由工艺", IsDefault: false, IsControl: false, Procedure: [],
            ProductID: vm.SelectetMate.Id
        };
        vm.editRoute = true;
        vm.SelectedRo = vm.NewRoute;
    }

    function RoProDelete(index, item) {
        if (item.ID == -1) {
            vm.SelectedRo.Procedure.splice(index, 1);
        }
        else {
            var en = [{ name: "RoutingID", value: vm.SelectedRo.ID },
                { name: "MaterialID", value: vm.SelectetMate.Id },
                { name: "Status", value: 4, type: "!=" }];
             AjaxService.GetPlan("MESPlanExMain", en).then(function (data) {
                if (data.ID) {
                    toastr.error("工艺正在生产，无法删除流程");
                }
                else {
                    vm.SelectedRo.Procedure.splice(index, 1);
                }
            })
        }
    }

    //保存工艺
    function SaveRoute() {
        if (vm.SelectedRo.Procedure.length == 0) {
            toastr.error("工艺最少需要一条流程,请添加");
            return;
        }
        var en = angular.copy(vm.SelectedRo);
        var list = [];
        for (var j = 0, len2 = en.Procedure.length; j < len2; j++) {
            var p = {};
            p.ID = en.Procedure[j].ID;
            p.IsPrint = en.Procedure[j].IsPrint || false;
            p.Item1 = en.Procedure[j].Item1 || "0";
            p.Item2 = en.Procedure[j].Item2 || "0";
            p.Item3 = en.Procedure[j].Item3 || "0";
            p.Item4 = en.Procedure[j].Item4 || "0";
            p.boProcedureID = en.Procedure[j].ProcedureInfo.ID;
            p.Remark = en.Procedure[j].Remark || "";
            p.StandardCapacity = en.Procedure[j].StandardCapacity || 16;
            p.Unit = en.Procedure[j].Unit;
            p.RepairTurnStation = en.Procedure[j].WorkPart.RepairTurnStation || "";
            p.OrderNum = j + 1;
            list.push(p);
        }
        en.Procedure = undefined;
        en.ProList = JSON.stringify(list);
        en.TempColumns = "ProList";
        console.log(en);
        vm.promise = AjaxService.ExecPlan("MesBoRouting", "save", en).then(function (data) {
            toastr.success("工艺保存成功");
            console.log(data);
            GetMateRouter();
            vm.editRoute = false;
            vm.NewRoute = {};
        })
    }

    //删除工艺
    function Delete(Id) {
        AjaxService.ExecPlan("MesBoRouting", "delete", { ID: Id }).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success("删除成功");
                GetMateRouter();
            }
        })
    }

    // drop
    function Drop(rol, index) {
        var en = angular.copy(rol);
        vm.SelectedRo.Procedure.splice(vm.DragIndex, 1);
        vm.SelectedRo.Procedure.splice(index, 0, en);
    }

    //
    function Drag(rol, index) {
        vm.DragIndex = index;
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
