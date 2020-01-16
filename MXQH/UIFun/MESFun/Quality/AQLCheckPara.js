'use strict';

angular.module('app')
.controller('AQLCheckParaCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 60 };
    vm.Ser = { AType: "G" };

    vm.Insert = Insert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.Save = Save;
    vm.Search = Search;

    vm.ChangeTab = ChangeTab;

    //获取检验标准
    AjaxService.GetTableConfig("AQLData", "AType").then(function (data) {
        vm.ATypeData = data;
    });

    
    //切换
    function ChangeTab(type) {
        vm.Ser.AType = type;
        GetAqlData();
    }

    //获取数据
    function GetAqlData() {
        vm.promise = AjaxService.ExecPlan("qcAQLCheckPara", 'set', vm.Ser).then(function (data) {
            vm.ParaData = data;
        })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        vm.NewItem = { AType: vm.Ser.AType };
        vm.IsInsert = true;
    }

    function Edit(item) {
        for (var i = 0, len = vm.ParaData.data.length; i < len; i++) {
            vm.ParaData.data[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = {};
        en.AChar = item.AChar;
        en.AType = item.AType;
        vm.promise = AjaxService.ExecPlan("qcAQLCheckPara", "delete", en).then(function (data) {
            GetAqlData();
            toastr.success('删除成功');
        });
    }

    function Save(item, insert) {
        var list = [];
        for (var i = 0, len = vm.ParaData.data1.length; i < len; i++) {
            var en = { AChar: item.AChar, AType: item.AType, SampleNum: item.SampleNum };
            en.AValue = vm.ParaData.data1[i].AValue;
            en.AC = item['AC' + en.AValue];
            en.RE = item['RE' + en.AValue];
            list.push(en)
        }
        console.log(list)
        var con = {};
        con.ParaList = JSON.stringify(list);
        con.TempColumns = "ParaList";
        vm.promise = AjaxService.ExecPlan("qcAQLCheckPara", 'save', con).then(function (data) {
            toastr.success('储存成功');
            GetAqlData();
            if (insert) {
                vm.IsInsert = false;
            }
        })
        
    }

}]);
