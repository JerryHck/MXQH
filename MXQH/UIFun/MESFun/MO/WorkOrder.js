'use strict';
angular.module('app')
.controller('MESMOCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', 
function ($rootScope, $scope,  Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.pageCom = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Ser2 = {};
    vm.Search = Search;
    vm.Add = Add;
    vm.Edit = Edit;
    vm.DataBindCom = DataBindCom;
    vm.EditCom = EditCom;
    vm.SearchCom = SearchCom;
    vm.Complete = Complete;
    //vm.Delete = Delete;
    DataBind();
    //绑定数据
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].TotalCount;
        });
    }

    //绑定数据完工工单
    function DataBindCom() {
        GetConditionCom();
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "GetList", vm.pageCom).then(function (data) {
            vm.CompleteList = data.data;
            vm.pageCom.total = data.data1[0].TotalCount;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //查寻完工工单
    function SearchCom() {
        vm.pageCom.pageIndex = 1;
        DataBindCom();
    }

    //查询条件
    function GetCondition() {
        vm.page.DocNo = vm.Ser.DocNo == '' ? undefined : vm.Ser.DocNo;
        vm.page.LineID = vm.Ser.LineID == '' ? undefined : vm.Ser.LineID;
        vm.page.MaterialID = vm.Ser.MaterialID == '' ? undefined : vm.Ser.MaterialID;
        vm.page.AssemblyDate = vm.Ser.AssemblyDate == '' ? undefined : vm.Ser.AssemblyDate;
        vm.page.CustomerOrder = vm.Ser.CustomerOrder == '' ? undefined : vm.Ser.CustomerOrder;
        vm.page.ERPSo = vm.Ser.ERPSo == '' ? undefined : vm.Ser.ERPSo;
    }

    //查询完工工单条件
    function GetConditionCom() {
        vm.pageCom.DocNo = vm.Ser2.DocNo == '' ? undefined : vm.Ser2.DocNo;
        vm.pageCom.LineID = vm.Ser2.LineID == '' ? undefined : vm.Ser2.LineID;
        vm.pageCom.MaterialID = vm.Ser2.MaterialID == '' ? undefined : vm.Ser2.MaterialID;
        vm.pageCom.AssemblyDate = vm.Ser2.AssemblyDate == '' ? undefined : vm.Ser2.AssemblyDate;
        vm.pageCom.Status = 4;
        vm.pageCom.CustomerOrder = vm.Ser2.CustomerOrder == '' ? undefined : vm.Ser2.CustomerOrder;
        vm.pageCom.ERPSo = vm.Ser2.ERPSo == '' ? undefined : vm.Ser2.ERPSo;
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

    //编辑
    function EditCom(item) {
        item.IsComplete = true;//完工列表不允许编辑
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
                DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(id) {
        var en = { ID: id };
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "Delete", en).then(function (data) {
            if (data.data[0].MsgType == "1") {
                DataBind();
                toastr.success(data.data[0].Msg);
            } else {
                toastr.success(data.data[0].Msg);
            }            
            
        });
    }
    //工单完工
    function Complete(id) {
        var en = {ID:id};
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "Complete", en).then(function (data) {
                DataBind();
                toastr.success("成功");
        });
    }

}
])