﻿'use strict';

angular.module('app')
.controller('PLMMaterialCtrl', ['$scope', '$http', '$q', 'AjaxService', '$window','toastr',
function ($scope, $http, $q, AjaxService, $window, toastr) {

    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Search = Search;
    vm.GetBomDetail = GetBomDetail;
    vm.tabIndex = 0;
    vm.Export = Export;
    vm.MaterialVerId = undefined;
    //vm.page.Code = '202020634';
    vm.GrayBg = { 'background-color': 'gray' };
    //DataBind();
    //获取数据源
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("v_MaterislVersion", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    function GetBomDetail(materialVerId) {
        vm.MaterialVerId = materialVerId;
        vm.tabIndex = 1;
        vm.promise = AjaxService.ExecPlan("v_MaterislVersion", "GetBomDetail", { MaterialVerId: materialVerId }).then(function (data) {
            vm.BOMDetail = data.data;
        });
    }

    //查询
    function Search() {
        vm.page.pageIndex = 1;        
        DataBind();
    }

    //导出功能
    function Export() {
        if (vm.MaterialVerId) {
            vm.promise = AjaxService.GetPlanExcel("v_MaterislVersion", 'GetBomDetail', { MaterialVerId: vm.MaterialVerId }).then(function (data) {
                $window.location.href = data.File;
            });
        } else {            
            toastr.error('请选择要导出的BOM料号！');
        }
    }

}

]);