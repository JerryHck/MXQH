'use strict';
angular.module('app')
.controller('CompleteRptApproveCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.pageApproved = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind; 
    vm.Ser = {};
    vm.SerApproved = {};
    vm.Edit = Edit;
    vm.Approve = Approve;
    vm.Search = Search;
    vm.SearchApproved = SearchApproved;
    
    Init();
    //初始化
    function Init() {
        DataBind();
    }

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("CompleteRpt", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    //查询条件
    function GetCondition() {
        var li = [{ name: "Status", value: 0 }]
        if (vm.Ser.DocNo) {
            li.push({ name: "WorkOrder", value: '%' + vm.Ser.DocNo + '%' });
        }
        return li;
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    function SearchApproved() {
        vm.pageApproved.pageIndex = 1;
        ApprovedDataBind();
    }

    function ApprovedDataBind() {
        vm.promise = AjaxService.GetPlansPage("CompleteRpt", GetApprovedCondition(), vm.pageApproved.pageIndex, vm.pageApproved.pageSize).then(function (data) {
            vm.ApprovedList = data.List;
            vm.pageApproved.total = data.Count;
        });
    }
    //查询条件
    function GetApprovedCondition() {
        var li = [{ name: "Status", value: 2 }]
        if (vm.SerApproved.DocNo) {
            li.push({ name: "WorkOrder", value: '%' + vm.SerApproved.DocNo + '%' });
        }
        return li;
    }
    //完工报告通过审核
    function Approve(item) {
        var en = {DocNo:item.DocNo};
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "Approve",en).then(function (data) {
            if (data.data[0].MsgType == 0) {
                toastr.error(data.data[0].MsgType);
            } else {
                toastr.success(data.data[0].MsgType);
                DataBind();
            }
        });
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
    //弹出框
    function Open(resolve) {
        Dialog.open("CompleteRptDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }


}
])