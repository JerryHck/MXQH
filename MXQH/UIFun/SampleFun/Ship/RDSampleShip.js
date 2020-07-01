﻿'use strict';
angular.module('app')
.controller('RDSampleShipCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Add = Add;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.SaveEdit = SaveEdit;
    vm.OpenScan = OpenScan;
    vm.Delete = Delete;
    vm.Search = Search;
    vm.Export = Export;

    Init();
    //初始化
    function Init() {
        DataBind();
        vm.DocTypeList = { Table: 'TP_PCRcv', Column: 'DocType' };
    }

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("RDShip", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }



    //新增
    function Add() {
        var en = {};
        en.TbName = "RDShip";
        en.ClName = "DocNo";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {

            vm.NewItem = {
                DocNo: data.data[0].SN,
                CreateBy: $rootScope.User.Name,
                Operator: $rootScope.User.Name,
                DeliverDate: new Date().toLocaleDateString(),
                DocType: '领用'
                //Status: 0
            };
            //PK生成设定
            var snList = [{ name: "RDShip", col: "DocNo", parm: "DocNo" }];
            //SN生产
            vm.NewItem.SNColumns = JSON.stringify(snList);

            vm.IsInsert = true;
        });
    }
    //保存新增信息
    function SaveInsert() {
        
        vm.NewItem.Borrower = vm.Borrower;
        if (vm.Project) {
            vm.NewItem.ProjectID = vm.Project.WorkId;
            vm.NewItem.ProjectCode = vm.Project.WorkCode;
            vm.NewItem.ProjectName = vm.Project.WorkName;
        }        
        vm.NewItem.ReturnDeptID = vm.Dept.ID;
        vm.NewItem.DeptCode = vm.Dept.Code;
        vm.NewItem.DeptName = vm.Dept.Name;
        if (vm.NewItem.Customer) {
            vm.NewItem.CustomerID = vm.Customer.ID;
            vm.NewItem.CustomerCode = vm.Customer.Code;
            vm.NewItem.CustomerName = vm.Customer.Name;
        }        

        if (!vm.NewItem.Remark) {
            vm.NewItem.Remark = '';
        }
        vm.promise = AjaxService.PlanInsert("RDShip", vm.NewItem).then(function (data) {
            DataBind();
            vm.Project = undefined;
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }
    //编辑
    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.Project = { WorkID: vm.EditItem.ProjectID, WorkCode: vm.EditItem.ProjectCode, WorkName: vm.EditItem.ProjectName };
        vm.Dept = { ID: vm.EditItem.ReturnDeptID, Code: vm.EditItem.DeptCode, Name: vm.EditItem.DeptName };
        vm.Customer = { ID: vm.EditItem.CustomerID, Code: vm.EditItem.CustomerCode, Name: vm.EditItem.CustomerName };
        vm.Borrower = vm.EditItem.Borrower;
        item.IsEdit = true;
    }
    //保存编辑
    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.DocNo = vm.EditItem.DocNo;
        en.Operator = vm.EditItem.Operator;
        en.DeliverDate = vm.EditItem.DeliverDate;
        en.DocType = vm.EditItem.DocType;
        en.PlanReturnDate = vm.EditItem.PlanReturnDate;
        if (vm.Project) {
            en.ProjectID = vm.Project.WorkId;
            en.ProjectCode = vm.Project.WorkCode;
            en.ProjectName = vm.Project.WorkName;
        }        
        en.CustomerID = vm.Customer.ID;
        en.CustomerCode = vm.Customer.Code;
        en.CustomerName = vm.Customer.Name;
        en.ReturnDeptID = vm.Dept.ID;
        en.DeptCode = vm.Dept.Code;
        en.DeptName = vm.Dept.Name;
        en.Borrower = vm.Borrower;
        if (!vm.EditItem.Remark) {
            en.Remark = '';
        } else {
            en.Remark = vm.EditItem.Remark;
        }

        vm.promise = AjaxService.PlanUpdate("RDShip", en).then(function (data) {
            DataBind();
            vm.Project = undefined;
            toastr.success('更新成功');
        });
    }

    //编辑
    function OpenScan(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open(resolve);
    }
    //弹出框
    function Open(resolve) {
        Dialog.open("RDShipDetail", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(item) {
        vm.promise = AjaxService.ExecPlan("RDShip", "Delete", { ID: item.ID }).then(function (data) {
            if (data.data[0].MsgType == '1') {
                DataBind();
                toastr.success('删除成功');
            } else {
                toastr.error('删除失败');
            }
        });
    }

    //导出
    function Export() {
        vm.page.pageSize = 100000;
        vm.promise = AjaxService.GetPlanExcel("RDShip", "GetList", vm.page).then(function (data) {
            vm.page.pageSize = 10;
            $window.location.href = data.File;
        });
    }
}
])