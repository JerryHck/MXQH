﻿'use strict';
angular.module('app')
.controller('RiskPreCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'MyPop', '$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize:10, maxSize: 10 };
    vm.Search = Search;
    vm.DataBind = DataBind;
    vm.SelectDocNo = SelectDocNo;//打开单据选择列表
    vm.Export = Export;
    Init();
    //DataBind();
    //初始化
    function Init() {
        vm.Ser = {};
    }
    //数据绑定
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("AuctusForecast", "RiskList", vm.page).then(function (data) {
            //console.log(data);
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }
    //查询
    function Search(validForm) {
        //表单验证是否通过
        if (validForm.$invalid) {
            toastr.error('订单号不能为空！');
            return;
        }
        vm.page.pageIndex = 1;
        DataBind();
    }

   
    //导出
    function Export() {
        vm.page.pageSize = 1000000;
        vm.promise = AjaxService.GetPlanExcel("AuctusForecast", "RiskList", vm.page).then(function (data) {
            $window.location.href = data.File;
        });
        vm.page.pageSize = 10;
    }
    //打开单据选择列表
    function SelectDocNo() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("RiskPreDialog", resolve).then(function (data) {
            console.log(data);
        }).catch(function (reason) {

        });
    }
}
])