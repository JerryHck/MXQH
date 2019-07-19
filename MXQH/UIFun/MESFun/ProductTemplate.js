'use strict';

angular.module('app')
.controller('ctrl-PT', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page2 = { index: 1, size: 12 };
    vm.page3 = { index: 1, size: 10 };
    vm.Ser = {};

    vm.SelectId = -1;
    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.PageChangeCodeType = PageChangeCodeType;
    vm.Search = Search;
    vm.SearchCodeType = SearchCodeType;
    vm.ExportExcel = ExportExcel;
    vm.SendCode = SendCode;
    vm.CodeTypeSelect = CodeTypeSelect;
    vm.add = add;
    vm.alter = alter;


    PageChangeCodeType();

    function PageChangeCodeType() {
        vm.promise = AjaxService.GetPlansPage("MESbaBarcodeType", GetContition3(), vm.page2.index, vm.page2.size).then(function (data) {
            vm.CodeList = data.List;
            vm.page2.total = data.Count;
        });

    }

    function SendCode(item) {    
        vm.SelectId = item.ID;
        vm.SelectedType = angular.copy(item);
        vm.page.index = 1;
        vm.promise = AjaxService.GetPlansPage("MesProductTemplate", GetContition2(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
        //console.log(vm.EditItem.TypeID);
        CodeTypeSelect(item.ID);
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function SearchCodeType() {
        vm.page2.index = 1;
        PageChangeCodeType();
    }

    function Insert() {
        //vm.NewItem = {};
        vm.ProductID = {};
        vm.CustomAddrID = {};
        vm.TemplateID = {};
        vm.IsInsert = true;
    }

    function add() {
        var n = {};
        n.TypeID = vm.SelectedType.ID;
        n.ProductId = vm.ProductID.Id;
        n.CustomAddr = vm.CustomAddrID.ID;
        n.TemplateId = vm.TemplateID;
        //console.log(n);
        vm.promise = AjaxService.ExecPlan("MesProductTemplate", 'add', n).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                toastr.success(data.data[0].Msg);
                vm.IsInsert = false;
                PageChange();
            }
            else {
                toastr.error(data.data[0].Msg);
            }

        });
    }

    function alter() {
        var u = {};
        u.ID = vm.EditItem.ID;
        u.TemplateId = vm.EditTemplateID;
        vm.promise = AjaxService.ExecPlan("MesProductTemplate", 'alter', u).then(function (data) {
            if (data.data[0].MsgType == "Success") {
                PageChange();
                toastr.success('更新成功');
            }
            else {
                toastr.error(data.data[0].Msg);
            }

        });
    }


    function Edit(item) {
        console.log(item);
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.EditTemplateID = item.TemplateId;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("MesProductTemplate", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID; //id
        en.TemplateId = vm.EditTemplateID;
        console.log(en);
        vm.promise = AjaxService.PlanUpdate("MesProductTemplate", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesProductTemplate", GetContition2(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    //根据标签类型查询模板编码
    function CodeTypeSelect(TypeID) {
        vm.TemplateID = {};
        vm.promise = AjaxService.GetPlans("MESbaBarcodeTemplate", GetContition4(TypeID)).then(function (data) {
            //console.log(data);
            vm.Template = data;
            //vm.page.total = data.Count;
        });

    }
    function GetContition4(TypeID) {
        var list = [];
        list.push({ name: "TypeID", value: TypeID });
        return list;
    }
  
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MesProductTemplate", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.c_TypeCode) {
            list.push({ name: "TypeCode", value: vm.Ser.c_TypeCode });
        }  
        if (vm.Ser.e_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.e_MaterialCode });
        }
        return list;
    }
    function GetContition2() {
        var list = [];
       
        if (vm.Ser.e_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.e_MaterialCode });
        }
        
        list.push({ name: "TypeID", value: vm.SelectId }, { name: "State", value: 1 });
        return list;
    }
    function GetContition3() {
        var list = [];
        return list;
    }
}]);
