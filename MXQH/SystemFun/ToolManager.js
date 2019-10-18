'use strict';

angular.module('app')
.controller('ToolManagerCtrl', ['$scope', 'toastr', 'Dialog', 'AjaxService',
function ($scope, toastr, Dialog, AjaxService) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    //查询
    vm.Search = Search;
    vm.EditTool = EditTool;
    //删除
    vm.Delete = Delete;
    vm.InsertTool = InsertTool;
    vm.Cancel = Cancel;
    vm.Save = Save;
    vm.SaveInTool = SaveInTool;

    vm.InsertType = InsertType;
    vm.SaveInType = SaveInType;
    vm.EditType = EditType;
    vm.DeleteType = DeleteType;
    vm.SaveType = SaveType;

    GetList();
    GetTypeList();
    //編輯
    function InsertTool() {
        vm.ToolIn = true;
        vm.NewTool = {};
    }

    function Search() {
        vm.page.index = 1;
        GetList();
    }

    function InsertType() {
        vm.InType = true;
        vm.NewType = {};
        Preview(vm.NewType);
    }

    function Preview(item) {
        var en = {};
        en.TbName = "ToolType";
        en.ClName = "TCode";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            item.TCode = data.data[0] ? data.data[0].SN : "";
        })
    }

    //編輯
    function EditTool(item) {
        
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }

    function SaveInTool() {
        vm.promise = AjaxService.PlanInsert('ToolPlugin', vm.NewTool).then(function (data) {
            GetList();
            toastr.success('新增成功');
            vm.ToolIn = false;
        });
    }

    function SaveInType() {
        //PK生成设定
        var snList = [{ name: "ToolType", col: "TCode", parm: "TCode" }];
        vm.NewType.SNColumns = JSON.stringify(snList);
        vm.promise = AjaxService.PlanInsert('ToolType', vm.NewType).then(function (data) {
            GetTypeList();
            toastr.success('新增成功');
            vm.InType = false;
            vm.NewType = {};
        });
    }

    function SaveType(index) {
        var en = { TCode: vm.EditTypeItem.TCode, TName: vm.EditTypeItem.TName, Remark: vm.EditTypeItem.Remark };
        AjaxService.PlanUpdate('ToolType', en).then(function (data) {
            toastr.success('更新成功');
            GetTypeList();
        });
        
    }

    function EditType(item) {
        for (var i = 0, len = vm.TypeList.length; i < len; i++) {
            vm.TypeList[i].IsEdit = false;
        }
        vm.EditTypeItem = angular.copy(item);
        item.IsEdit = true;
    }

    function Save(index) {
        var en = { Id: vm.EditItem.Id, Name: vm.EditItem.Name, TCode: vm.EditItem.TCode, PathLink: vm.EditItem.PathLink, Remark: vm.EditItem.Remark}
        vm.promise = AjaxService.PlanUpdate('ToolPlugin', en).then(function (data) {
            GetList();
            toastr.success('更新成功');
            vm.EditItem = {};
        });
    }

    //删除
    function Delete(item) {
        vm.promise = AjaxService.PlanDelete('ToolPlugin', item).then(function (data) {
            GetList();
            //更新功能基本信息
            AjaxService.LoginAction("ReInit");
            toastr.success('删除');
        });
    }

    function DeleteType(item) {
        var en = { TCode: item.TCode };
        vm.promise = AjaxService.PlanDelete('ToolType', en).then(function (data) {
            GetTypeList();
            toastr.success('删除成功');
        });
    }

    function GetList() {
        var list = [];
        if (vm.Ser.ToolName) {
            list.push({ name: "Name", value: vm.Ser.ToolName });
        }
        vm.promise = AjaxService.GetPlansPage("ToolPlugin", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function GetTypeList() {
        vm.promise = AjaxService.GetPlans("ToolType").then(function (data) {
            vm.TypeList = data;
        });
    }

    function Cancel(item) {
        item.IsEdit = false;
    }
}
]);