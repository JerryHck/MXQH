'use strict';

angular.module('app')
.controller('TanapaCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.codePage = { pageIndex: 1, pageSize: 50 }
    vm.SelectCode = SelectCode;
    vm.Ser = {};
    vm.Material = {};
    vm.SendPlace = {};

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.DataBindCode = DataBindCode;//绑定料品列表
    DataBindCode();
    //料品列表数据
    function DataBindCode() {
        //[{ name: "MaterialCode", value: vm.Ser.MaterialCode }],
        vm.promise = AjaxService.GetPlans("MesMXMaterial", [{ name: "State", value: 1 }]).then(function (data) {
            vm.CodeList = data;
            //vm.codePage.totalCode = data.Count;
        });
    }
    //选择料号Tanapa信息
    function SelectCode(item) {
        vm.SelectedCode = item.MaterialCode;
        vm.Material.MaterialID = item.Id;
        vm.Material.MaterialCode = item.MaterialCode;
        vm.Material.MaterialName = item.MaterialName;
        vm.Ser.MaterialID = item.Id;
        Search();
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.SendPlace = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {

        if (parseFloat(vm.NewItem.MaxWeight) < parseFloat(vm.NewItem.MinWeight)) {
            toastr.error('数据有误，“最大重量”小于“最小重量”！');
            return;
        }
        vm.NewItem.MaterialID = vm.Material.MaterialID
        vm.NewItem.SendPlaceID = vm.SendPlace.ID
        if (!vm.NewItem.IsValid) {
            vm.NewItem.IsValid = 1;
        }
        vm.promise = AjaxService.PlanInsert("MESbaTanapa", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        vm.SendPlace = item.SendPlace;
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("MESbaTanapa", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        console.log(vm.EditItem);
        if (parseFloat(vm.EditItem.MaxWeight) < parseFloat(vm.EditItem.MinWeight)) {
            toastr.error('数据有误，“最大重量”小于“最小重量”！');
            return;
        }
        en.ID = vm.EditItem.ID;
        en.SendPlaceID = vm.SendPlace.ID;
        en.MaxWeight = vm.EditItem.MaxWeight;
        en.MinWeight = vm.EditItem.MinWeight;
        en.Tanapa = vm.EditItem.Tanapa;
        en.Model = vm.EditItem.Model;
        en.Ean = vm.EditItem.Ean;
        en.UserGuide = vm.EditItem.UserGuide;
        en.Charger = vm.EditItem.Charger;
        en.Antenna = vm.EditItem.Antenna; 
        en.BeltClip = vm.EditItem.BeltClip;
        en.Battery = vm.EditItem.Battery;
        en.RadioKit = vm.EditItem.RadioKit;
        en.Description = vm.EditItem.Description;
        vm.promise = AjaxService.PlanUpdate("MESbaTanapa", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {      
        vm.promise = AjaxService.GetPlansPage("MESbaTanapa", GetContition(), vm.page.index, vm.page.size).then(function (data) {            
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function GetContition() {
        var list = [];
        if (vm.Ser.MaterialID) {
            list.push({ name: "MaterialID", value: vm.Ser.MaterialID });
        }
        return list;
    }

}]);
