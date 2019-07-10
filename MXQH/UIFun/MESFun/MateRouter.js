'use strict';

angular.module('app')
.controller('MESProductRouteCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.SelectMate = SelectMate;
    vm.SelectRoute = SelectRoute;
    vm.EditRoute = EditRoute;
    vm.OpenProcedure = OpenProcedure;
    vm.AddProcedure = AddProcedure;

    vm.Cancel = Cancel;

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
        vm.SelectetMate = angular.copy(item);
        GetMateRouter();
    }

    function EditRoute(route) {
        route.editing = true;
    }

    function SelectRoute(route) {
        vm.SelectedRo = angular.copy(route);
    }

    function Cancel() {
        vm.editRoute = false;
    }

    function GetMateRouter() {
        AjaxService.GetPlans("MesBoRouting", [{ name: "ProductID", value: vm.SelectetMate.Id }]).then(function (data) {
            vm.MateRouteList = data;
        });
    }

    function OpenProcedure(item, index) {
        vm.ProcItem = angular.copy(item);
        vm.ProIndex = index;
        $(".procudure").addClass("active");
    }

    function AddProcedure() {
        vm.ProcItem = { ID: -1, boRoutingID: vm.SelectedRo.ID, ProcedureInfo: vm.ProcedureList[0] };
        vm.ProIndex = pr.SelectedRo.Procedure.length;
        $(".procudure").addClass("active");
    }

}]);
