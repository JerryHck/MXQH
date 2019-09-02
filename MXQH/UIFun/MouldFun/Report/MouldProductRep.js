
'use strict';
angular.module('app')
.controller('MouldProductRepCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.pageDetail = { pageSize:1, pageIndex: 1, maxSize: 10 };
    vm.Search = Search;
    vm.Edit = Edit;
    vm.pageChangeDetail = pageChangeDetail;
    Init();
    DataBind();
    //新增/编辑初始化页面
    function Init() {
        vm.Ser = {};
        vm.tabIndex = 0;
    }
    //绑定数据
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("MouldInfo", "ProductRep", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    //查询条件
    function GetCondition() {
        vm.page.MouldCode = vm.Ser.Code == '' ? undefined : vm.Ser.Code;
        vm.page.MouldName = vm.Ser.Name == '' ? undefined : vm.Ser.Name;
    }

    //查看模具使用明细
    function Edit(mouldID) {
        changeTab(1);
        vm.pageDetail.MouldID = mouldID;
        GetDetail();
    }
    //模具使用明细翻页
    function pageChangeDetail() {
        GetDetail();
    }
    //获取模具使用明细
    function GetDetail() {
        vm.promise = AjaxService.ExecPlan("MouldInfo", "ProductReqDetail", vm.pageDetail).then(function (data) {
            vm.DetailList = data.data;
            vm.pageDetail.total = data.data1[0].Count;
        });
    }
    //切换tab页
    function changeTab(index) {
        vm.tabIndex = index;
    }
}
])