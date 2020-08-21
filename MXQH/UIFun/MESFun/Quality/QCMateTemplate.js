'use strict';

angular.module('app')
.controller('QCMateTemplateCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
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
    vm.Search = Search;
    vm.SendCode = SendCode;
    vm.CodeTypeSelect = CodeTypeSelect;
    vm.add = add;
    vm.alter = alter;


    //获取类型
    AjaxService.GetTableConfig("MateTemplate", "QCType").then(function (data) {
        vm.CodeList = data;
    });


    function SendCode(item) {    
        vm.SelectId = item.ClInf;
        vm.SelectedType = angular.copy(item);
        CodeTypeSelect();
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
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
        vm.promise = AjaxService.GetPlansPage("QcMateTemplate", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    //获取模板列表
    function CodeTypeSelect() {
        var en = { name: "QCType", value: vm.SelectId };
        vm.promise = AjaxService.GetPlans("QualityTemplate", en).then(function (data) {
            vm.Template = data;
        });

    }
  
    function GetContition() {
        var list = [];
       
        if (vm.Ser.e_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.e_MaterialCode });
        }
        list.push({ name: "QCType", value: vm.SelectId });
        if (vm.Ser.TempName) {
            list.push({ name: "Name", value: vm.Ser.TempName, tableAs: 'c' });
        }

        return list;
    }
    function GetContition3() {
        var list = [];
        return list;
    }
}]);
