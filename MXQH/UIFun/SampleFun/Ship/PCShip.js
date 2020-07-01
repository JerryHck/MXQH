'use strict';
angular.module('app')
.controller('PCShipCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window',
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
    vm.ValueChange = ValueChange;

    function ValueChange() {
        console.log('project', vm.Project);
    }
    Init();
    //初始化
    function Init() {
        DataBind();
        vm.DocTypeList = { Table: 'TP_PCRcv', Column: 'DocType' };
    }

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("PCShip", "GetList", vm.page).then(function (data) {
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
        en.TbName = "PCShip";
        en.ClName = "DocNo";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {

            vm.NewItem = {
                DocNo: data.data[0].SN,
                CreateBy: $rootScope.User.Name,
                Operator: $rootScope.User.Name,
                DeliverDate: new Date().toLocaleDateString(),
                DocType: '领用'
            };
            //PK生成设定
            var snList = [{ name: "PCShip", col: "DocNo", parm: "DocNo" }];
            //SN生产
            vm.NewItem.SNColumns = JSON.stringify(snList);

            vm.IsInsert = true;
        });
    }
    //保存新增信息
    function SaveInsert() {
        vm.NewItem.ReturnDeptID = vm.Dept.ID;
        vm.NewItem.DeptCode = vm.Dept.Code;
        vm.NewItem.DeptName = vm.Dept.Name;
        console.log(vm.Customer);
        if (vm.Customer) {
            vm.NewItem.CustomerID = vm.Customer.ID
            vm.NewItem.CustomerCode = vm.Customer.Code;
            vm.NewItem.CustomerName = vm.Customer.Name
        } else {
            vm.NewItem.CustomerID = undefined;
            vm.NewItem.CustomerCode = undefined;
            vm.NewItem.CustomerName = undefined;
        }


        if (!vm.NewItem.Remark) {
            vm.NewItem.Remark = '';
        }
        console.log(2, vm.NewItem);
        vm.promise = AjaxService.PlanInsert("PCShip", vm.NewItem).then(function (data) {
            DataBind();
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
        en.PlanReturnDate = vm.EditItem.PlanReturnDate;
        en.DocType = vm.EditItem.DocType;
        en.CustomerID = vm.Customer.ID;
        en.CustomerCode = vm.Customer.Code;
        en.CustomerName = vm.Customer.Name;
        en.ReturnDeptID = vm.Dept.ID;
        en.DeptCode = vm.Dept.Code;
        en.DeptName = vm.Dept.Name;
        en.Borrower = vm.EditItem.Borrower;
        if (!vm.EditItem.Remark) {
            en.Remark = '';
        } else {
            en.Remark = vm.EditItem.Remark;
        }

        vm.promise = AjaxService.PlanUpdate("PCShip", en).then(function (data) {
            DataBind();
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
        Dialog.open("PCShipDetail", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(item) {
        vm.promise = AjaxService.ExecPlan("PCShip", "Delete", { ID: item.ID }).then(function (data) {
            if (data.data[0].MsgType == '1') {
                DataBind();
                toastr.success('删除成功');
            } else {
                toastr.error('删除失败');
            }
        });
    }
}
])