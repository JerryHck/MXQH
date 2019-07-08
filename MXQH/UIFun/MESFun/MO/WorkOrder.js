'use strict';
angular.module('app')
.controller('MESMOCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', 
function ($rootScope, $scope,  Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Search = Search;
    vm.Add = Add;
    vm.Edit = Edit;
    DataBind();
    //绑定数据
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].TotalCount;
        });
    }
    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //查询条件
    function GetCondition() {
        vm.page.DocNo = vm.Ser.DocNo == '' ? undefined : vm.Ser.DocNo;
        vm.page.LineID = vm.Ser.LineID == '' ? undefined : vm.Ser.LineID;
        vm.page.AssemblyDate = vm.Ser.AssemblyDate == '' ? undefined : vm.Ser.AssemblyDate;
    }

    //编辑
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open(resolve);
    }
    //新增
    function Add() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Open(resolve);
    }
    //弹出框
    function Open(resolve) {   
        Dialog.open("MesMoDialog", resolve).then(function (data) {            
            if (data=="1") {
                DataBind();
            }
        }).catch(function (reason) {

        });
    }

}
])