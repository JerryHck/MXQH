'use strict';

angular.module('app')
.controller('BaseDictionaryCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Save = Save;
    vm.Search = Search;
    vm.DataBind = DataBind;
    vm.Cancel = Cancel;
    vm.Ser_IsActive = { Table: 'AgingTestIsPass', Column: 'IsPass' };
    vm.IsActive = { Table: 'AgingTestIsPass', Column: 'IsPass' };
    
    Init();
    //初始化
    function Init(){
        vm.Ser={};
        vm.NewItem = {};    
    }
    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("BaseDic", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            console.log(data);
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    //查询条件
    function GetCondition() {
        var li = [];
        if (vm.Ser.Code) {
            li.push({ name: "Code", value: vm.Ser.Code });
        }
        if (vm.Ser.Name) {
            li.push({ name: "Name", value: vm.Ser.Name });
        }
        if (vm.Ser.IsActive) {
            li.push({ name: "IsActive", value: vm.Ser.IsActive });
        }
        console.log(li);
        return li;
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //添加字典数据
    function Add() {
        $(".pro-file").addClass("active");
        vm.IsEdit = false;
    }

    //编辑字典数据
    function Edit(item) {
        $(".pro-file").addClass("active");
        vm.IsEdit = true;
        vm.NewItem = angular.copy(item);
    }
    //放弃
    function Cancel() {
        $(".pro-file").removeClass("active");
        vm.NewItem = {};
    }
    //保存字典项
    function Save() {
        var en = {};
        var li = [];
        li.push(vm.NewItem);
        en.TempColumns = "List";
        en.List = JSON.stringify(li);
        if (vm.IsEdit) {//编辑
            vm.promise = AjaxService.ExecPlan("BaseDic", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    $(".pro-file").removeClass("active");
                    vm.NewItem = {};
                    DataBind();
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        } else {
            vm.promise = AjaxService.ExecPlan("BaseDic", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    vm.NewItem = {};
                    DataBind();
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
        
    }
   

}]);
