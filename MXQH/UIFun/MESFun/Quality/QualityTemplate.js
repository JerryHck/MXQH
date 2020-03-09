'use strict';
angular.module('app')
.controller('QualityTemplatesCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.pageDetail = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.templagePage = { pageIndex: 1, pageSize: 30, maxSize: 10 };
    vm.SelectedTemplate = {};
    vm.ItemData = {};
    vm.Detail = {};
    vm.EditItem = {};
    vm.AddTemplate = AddTemplate;//新增弹出框    
    vm.AddDetail = AddDetail;//新增模板明细
    vm.EditDetail = EditDetail;//新增模板明细
    vm.DeleteDetail = DeleteDetail;//新增模板明细
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.DataBind = DataBind;
    vm.SelectTemplate = SelectTemplate;
    vm.SearchTemplate = SearchTemplate;
    vm.ValueChange = ValueChange;//下拉框change事件
    //初始化
    Init();
    function Init() {
        DataBind();
    }
    // #region 模板
    function DataBind() {
        var condition = []
        vm.promise = AjaxService.GetPlansPage("QualityTemplate", condition, vm.templagePage.pageIndex, vm.templagePage.pageSize).then(function (data) {
            vm.List = data.List;
            vm.templagePage.total = data.Count;
        })
    }
    //查询模板
    function SearchTemplate() {
        vm.templagePage.pageIndex = 1;
        var condition = [];
        if (vm.KeyWord) {
            condition = [{ name: "Name", value: '%' + vm.KeyWord + '%' }];
        }
        vm.promise = AjaxService.GetPlansPage("QualityTemplate", condition, vm.templagePage.pageIndex, vm.templagePage.pageSize).then(function (data) {
            vm.List = data.List;
            vm.templagePage.total = data.Count;
        })
    }
    //新增 检测模板
    function AddTemplate() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Open(resolve);
    }
    //编辑 检测模板
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open(resolve);
    }
    //删除 模板
    function Delete(id) {
        vm.promise = AjaxService.ExecPlan("QualityTemplate", "Delete", { ID: id }).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);                
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }
    //弹出框
    function Open(resolve) {
        Dialog.open("QualityTemplateDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //选择模板
    function SelectTemplate(item) {
        DataBindDetail();
        vm.SelectedTemplate = item;
        vm.pageDetail.pageIndex = 1;
        vm.ItemData = {};
        $(".pro-file").removeClass("active");
    }

    // #endregion
    //获取模板列表

    //#region 模板详情
    function DataBindDetail() {
        var condition = [];
        vm.promise = AjaxService.GetPlansPage("QualityTemplateRelation", condition, vm.pageDetail.pageIndex, vm.pageDetail.pageSize).then(function (data) {
            vm.DetailList = data.List;
            vm.pageDetail.total = data.Count;
        })
    }
    //新增 模板明细
    function AddDetail() {
        if (!vm.SelectedTemplate.ID) {
            toastr.error('请先选择模板！');
            return;
        }
        $(".pro-file").addClass("active");
        vm.promise = AjaxService.GetPlans("QualityProperty", [{ name: "PID", value: -1 }]).then(function (data) {
            vm.TopLevels = data;
        });
        vm.OrderNo = 0;
        vm.IsEditDetail = false;
    }
    //编辑模板明细
    function EditDetail(item) {
        $(".pro-file").addClass("active");
        //获取检验大项下拉框数据
        vm.promise = AjaxService.GetPlans("QualityProperty", [{ name: "PID", value: -1 }]).then(function (data) {
            vm.TopLevels = data;
        });
        //获取检验项下拉框数据
        vm.promise = AjaxService.GetPlans("QualityProperty", [{ name: "PID", value: item.TopLevel.PID }]).then(function (data) {
            vm.TestItems = data;
        });
        $(".pro-file").addClass("active");
        vm.EditID = item.ID;
        vm.OrderNo = item.OrderNo;
        vm.TopLevel = item.TopLevel.PID;
        vm.Detail.PropertyID = item.PropertyID;
        vm.IsEditDetail = true;
    }
    //删除模板明细
    function DeleteDetail(id) {
        vm.promise = AjaxService.ExecPlan("QualityTemplateRelation", "Delete", { ID: id }).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                DataBindDetail(vm.SelectedTemplate);
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }
    //保存 检测模板
    function Save() {
        var en = {};
        var li = [];        
        if (!vm.IsEditDetail) {//新增   
            vm.Detail.TemplateID = vm.SelectedTemplate.ID;
            vm.Detail.OrderNo = vm.OrderNo;
            li.push(vm.Detail);
            en.TempColumns = "List";
            en.List = JSON.stringify(li);
            vm.promise = AjaxService.ExecPlan("QualityTemplateRelation", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    DataBindDetail(vm.SelectedTemplate);
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        } else {//修改
            vm.Detail.ID = vm.EditID;
            vm.Detail.TemplateID = vm.SelectedTemplate.ID;
            vm.Detail.OrderNo = vm.OrderNo;
            li.push(vm.Detail);
            en.TempColumns = "List";
            en.List = JSON.stringify(li);
            vm.promise = AjaxService.ExecPlan("QualityTemplateRelation", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    DataBindDetail(vm.SelectedTemplate);
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
    }
    //下拉框change事件
    function ValueChange() {
        vm.TestItems = [];
        vm.Detail = {};
        vm.promise = AjaxService.GetPlans("QualityProperty", [{ name: "PID", value: vm.TopLevel }]).then(function (data) {
            vm.TestItems = data;
        });
    }
    //#endregion
    //获取模板详情




}
])

