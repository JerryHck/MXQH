'use strict';
angular.module('app')
.controller('CompleteRptCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.Search = Search;
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
        var li=[]
        if (vm.Ser.DocNo) {
            li.push({name:"WorkOrder",value:'%'+vm.Ser.DocNo+'%'});
        }
        return li;
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
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
        Dialog.open("CompleteRptDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(id) {
        var en = { ID: id };
        vm.promise = AjaxService.ExecPlan("CompleteRpt", "Delete", en).then(function (data) {
            if (data.data[0].MsgType == "1") {
                DataBind();
                toastr.success(data.data[0].Msg);
            } else {
                toastr.error('删除失败！');
            }

        });
    }

}
])