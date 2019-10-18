'use strict';
angular.module('app')
.controller('U9SupplierCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService','MyPop','$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, MyPop, $window) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 8, maxSize: 10};
    vm.pageMail = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.pageDetail = { pageIndex: 1, pageSize: 10, maxSize: 10 };    
    vm.Search = Search;
    vm.DataBind = DataBind;
    vm.GetMailList = GetMailList;
    vm.SendMail = SendMail;
    vm.SearchMail = SearchMail;
    vm.Export = Export;
    vm.DataBindDetail = DataBindDetail;
    vm.SearchDetail = SearchDetail;
    vm.ExportDetail = ExportDetail;
    Init();
    DataBind();
    GetMailList();
    //初始化
    function Init() {
        vm.Ser = {};
        vm.SerDetail = {};
    }
    //数据绑定
    function DataBind() {
        vm.page.SupplierID = vm.Ser.SupplierID == undefined ? null : vm.Ser.SupplierID;
        vm.promise = AjaxService.ExecPlan("CBO_Supplier", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
            vm.DateList = data.data2;
        });
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //发送邮件
    function SendMail() {
        var txt = '';      
        if (vm.Ser.SupplierID == undefined) {
            vm.Ser.SupplierID = '';
            txt = '是否要给所有供应商发送邮件？';
            //toastr.error('请选择供应商！');
            //return;
        } else {
            txt = '是否要给此供应商发送邮件？';
            if (!vm.List[0].Email) {
                toastr.error('供应商无邮箱数据！');
                return;
            }
        }
        MyPop.ngConfirm({ text: txt }).then(function (result) {            
            console.log("{supplierID:" + vm.Ser.SupplierID+ ",userName:"+$rootScope.User.Name+"}");
            //发送邮件
            $.ajax({
                type: "post",
                url: "http://192.168.1.226:9090/U9Service/U9Service.asmx/MailToSupplier",
                contentType: "application/json",
                data: "{supplierID:'" + vm.Ser.SupplierID + "',userName:'" + $rootScope.User.Name + "'}",
                dataType: "json",
                success: function (data) {
                    if (data.d == "true") {
                        toastr.success('邮件请求已经发送，请查看邮件发送结果！');
                    } else {
                        toastr.error('邮件请求发送失败，请检查供应商信息！');
                    }
                    
                }
            });
        }).catch(function (result) {
            toastr.error(result);
        });
    }

    //导出
    function Export() {
        vm.promise = AjaxService.GetPlanExcel("CBO_Supplier", "GetList", { pageSize: 100000, pageIndex: 1, SupplierID: vm.Ser.SupplierID }).then(function (data) {
            $window.location.href = data.File;
        });
    }
    //邮件发送结果
    function GetMailList() {        
        vm.promise = AjaxService.ExecPlan("CBO_Supplier", "MailList", vm.pageMail).then(function (data) {
            vm.MailList = data.data;
            vm.pageMail.total = data.data1[0].Count;
        });
    }
    //查询邮件列表
    function SearchMail() {
        vm.pageMail.pageIndex = 1;
        GetMailList();
        $scope.$apply();
    }
    //供应商欠交明细
    function DataBindDetail() {
        vm.promise = AjaxService.ExecPlan("CBO_Supplier", "GetDetaiList", vm.pageDetail).then(function (data) {
            vm.DetailList = data.data;
            vm.pageDetail.total = data.data1[0].Count;
        });
    }
    function SearchDetail() {
        vm.pageDetail.pageIndex = 1;
        DataBindDetail();
    }

    //导出
    function ExportDetail() {
        vm.promise = AjaxService.GetPlanExcel("CBO_Supplier", "GetDetaiList", { pageSize: 100000, pageIndex: 1, SupplierID: vm.SerDetail.SupplierIDs }).then(function (data) {
            $window.location.href = data.File;
        });
    }

}
])