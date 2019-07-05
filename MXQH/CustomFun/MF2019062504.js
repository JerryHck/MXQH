'use strict';

angular.module('app')
.controller('ctrl-BR', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.AddBoRouting = AddBoRouting;

    

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.NewItem.IsDefault = false;
        vm.NewItem.IsControl = false;
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("mxqh_BoRouting", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }
    function AddBoRouting() {
        var en = {};
        en.ProductID = vm.NewItem.ProductID;
        en.RoutingName = vm.NewItem.RoutingName;
        vm.promise = AjaxService.ExecPlan("mxqh_BoRouting", 'add', en).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                SaveInsert();
            }
            else {
                toastr.error(data.data[0].Msg);
            }

        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("mxqh_BoRouting", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.ProductID = vm.EditItem.ProductID;
        en.RoutingName = vm.EditItem.RoutingName;
        en.IsDefault = vm.EditItem.IsDefault;
        en.IsControl = vm.EditItem.IsControl;
        
        vm.promise = AjaxService.ExecPlan("mxqh_BoRouting", 'alter', en).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                vm.promise = AjaxService.PlanUpdate("mxqh_BoRouting", en).then(function (data) {
                    PageChange();
                    toastr.success('更新成功');

                });
            }
            else {
                toastr.error(data.data[0].Msg);
            }

        });
     
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("mxqh_BoRouting", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("mxqh_BoRouting", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_ProductID) {
            list.push({ name: "ProductID", value: vm.Ser.a_ProductID });
        }
        return list;
    }




}]);
