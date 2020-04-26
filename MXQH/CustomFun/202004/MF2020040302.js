﻿'use strict';

angular.module('app')
.controller('SOAgentCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.IsCodeExist = IsCodeExist;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = {};
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("QZSOAgent", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }
    //编码是否重复
    function IsCodeExist(isEdit) {
        console.log(isEdit);
        if (isEdit) {//Edit
            if (vm.NowItem.Code!=vm.EditItem.Code) {
                vm.promise = AjaxService.GetPlan("QZSOAgent", { name: "Code", value: vm.EditItem.Code }).then(function (data) {
                    vm.NowItem.ItemForm.item_Code.$setValidity('unique', !data.Code);
                });
            }            
        } else {//Add
            vm.promise = AjaxService.GetPlan("QZSOAgent", { name: "Code", value: vm.NewItem.Code }).then(function (data) {
                vm.InsertForm.Code.$setValidity('unique', !data.Code);
            });
        }
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        AjaxService.GetPlansTop("QZSO", { name: "SOAgentID", value: item.ID }).then(function (data) {
            if (data.length == 0) {
                vm.promise = AjaxService.PlanDelete("QZSOAgent", en).then(function (data) {
                    PageChange();
                    toastr.success('删除成功');
                });
            } else {
                toastr.error("存在该客户销售单，不能删除！");
            }
        });
      
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.ModifyBy = vm.EditItem.ModifyBy;
        en.ModifyDate = vm.EditItem.ModifyDate;
        en.Name = vm.EditItem.Name;
        en.Code = vm.EditItem.Code;
        en.Contact = vm.EditItem.Contact;
        en.ContactNumber = vm.EditItem.ContactNumber;
        en.Remark = vm.EditItem.Remark;
        en.CreateBy = vm.EditItem.CreateBy;
        en.CreateDate = vm.EditItem.CreateDate;
        vm.promise = AjaxService.PlanUpdate("QZSOAgent", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("QZSOAgent", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("QZSOAgent", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_Code) {
            list.push({ name: "Code", value: '%' + vm.Ser.a_Code+'%', tableAs: "a" });
        }
        if (vm.Ser.a_Name) {
            list.push({ name: "Name", value: '%' + vm.Ser.a_Name + '%', tableAs: "a" });
        }
        return list;
    }

}]);
