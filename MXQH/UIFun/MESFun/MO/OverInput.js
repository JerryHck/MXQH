'use strict';
angular.module('app')
.controller('OverInputCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Add = Add;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.Approve = Approve;
    vm.Search = Search;
    DataBind();
    vm.Status = { Table: 'OverInput', Column: 'Status' };
    //vm.UserNo = $rootScope.User.UserNo;
    vm.UserNo = '1619';

    //function Search() {
    //    //1、SourceHelper DLL文件名
    //    //2、SourceHelper.SQLHelper Class全名
    //    //3、TestDll 调用的函数
    //    //4、参数        
    //    AjaxService.CallDll('Mes4OA', 'Mes4OA.Test4OA', 'TestFun', { json: "jsons" }).then(function (data) {         
    //        console.log(data);
    //    })
    //}


    function DataBind() {
        vm.promise = AjaxService.ExecPlan("OverInput", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    ////导出
    //function Export() {
    //    vm.page.pageSize = 100000;
    //    vm.promise = AjaxService.GetPlanExcel("OverInput", 'GetList', vm.page).then(function (data) {
    //        $window.location.href = data.File;
    //        vm.page.pageSize = 10;
    //    });
    //}

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
        Dialog.open("OverInputDialog", resolve).then(function (data) {
            if (data == "1") {
                DataBind();
            }
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(item) {
        if (item.Status == 0) {
            vm.promise = AjaxService.PlanDelete("OverInput", item).then(function (data) {
                toastr.success("删除成功!");
                DataBind();
            });
        } else {
            toastr.error("单据不是“开立”状态，不能删除！");
        }
    }
    //提交流程到OA
    function Approve(item) {
        //    //1、SourceHelper DLL文件名
        //    //2、SourceHelper.SQLHelper Class全名
        //    //3、TestDll 调用的函数
        //    //4、参数  

        //AjaxService.ExecPlan("OverInput4OA", "Approve", { DocNo: "123" }).then(function (data) {
        //    console.log(data);
        //})

        AjaxService.ExecPlan("MesPlanDetail", "GetMO", { WorkOrderID: item.WorkOrderID }).then(function (data) {
            if (data.data.length > 0) {
                var oaItem = {};
                oaItem.CreateBy = item.CreateBy;
                oaItem.DocNo = item.DocNo;
                oaItem.WorkOrder = item.WorkOrder;
                oaItem.OverInputQty = item.OverInputQty;
                oaItem.Status = item.Status;
                oaItem.Reason = item.Reason;

                oaItem.MaterialCode = data.data[0].MaterialCode;
                oaItem.MaterialName = data.data[0].MaterialName;
                oaItem.Quantity = data.data[0].Quantity;
                oaItem.CompleteQty = data.data[0].CompleteQty;
                oaItem.DumpQty = data.data[0].DumpQty;
                oaItem.TotalStartQty = data.data[0].TotalStartQty;
                oaItem.OnLineQty = data.data[0].OnLineQty;


                //vm.promise = AjaxService.CallDll('Mes4OA', 'Mes4OA.OAWorkFlow', 'CreateWorkFlow', { planName: "OverInput4OA", condition: JSON.stringify([{ name: "DocNo", value: item.DocNo }]) }).then(function (data) {
                //        console.log(data);
                //    })
                vm.promise = AjaxService.CallDll('Mes4OA', 'Mes4OA.OAWorkFlow', 'CreateWorkFlowByJson', { planName: "OverInput4OA", json: JSON.stringify(oaItem) }).then(function (data) {
                    var jsonData = JSON.parse(JSON.parse(data));
                    if (jsonData.type == "1") {
                        toastr.error(jsonData.backmsg);
                    } else {
                        let flag = true;
                        for (var i = 0; i < jsonData.resultlist.length; i++) {
                            if (jsonData.resultlist[i].status == "1") {
                                flag = false;
                                toastr.error("提交至OA流程失败：" + jsonData.resultlist[i].msg);
                                break;
                            }
                        }
                        if (flag) {
                            AjaxService.ExecPlan("OverInput4OA", "Approve", { DocNo: jsonData.resultlist[0].fpkid, OAFlowID: jsonData.resultlist[0].requestid, Modify: $rootScope.User.Name, Status: "提交" }).then(function (data) {
                                if (data.data[0].StatusCode == "0") {
                                    toastr.success(data.data[0].ErrorMsg);
                                    DataBind();
                                } else {
                                    toastr.error("提交失败！");
                                }
                            });
                        }

                    }

                });

            }
        });

    }

}
])