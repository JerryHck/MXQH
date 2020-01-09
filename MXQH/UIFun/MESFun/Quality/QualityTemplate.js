'use strict';
angular.module('app')
.controller('QualityTemplatesCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.pageDetail = { pageIndex: 1, pageSize: 10, maxSize: 10 };
    vm.templagePage = { pageIndex: 1, pageSize: 30, maxSize: 10 };
    vm.SelectedTemplate = {};
    vm.ItemData = {};
    vm.AddTemplate = AddTemplate;//新增弹出框    
    vm.AddDetail = AddDetail;//新增模板明细
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.DataBind = DataBind;
    vm.SelectTemplate = SelectTemplate;
    vm.SearchTemplate = SearchTemplate;
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
                GetTreeData();
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
        vm.SelectedTemplate = item;
        vm.pageDetail.pageIndex = 1;
        vm.ItemData = {};
        $(".pro-file").removeClass("active");
        DataBindDetail();
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
        vm.IsEditDetail = false;
    }
    //编辑模板明细
    function EditDetail(item) {
        $(".pro-file").addClass("active");
        vm.IsEditDetail = true;

    }
    //删除模板明细
    function DeleteDetail(id) {

    }
    //保存 检测模板
    function Save() {
        var en = {};
        var li = [];
        vm.ItemData.PID = vm.PID
        li.push(vm.ItemData);
        en.TempColumns = "List";
        en.List = JSON.stringify(li);
        if (!vm.IsEditDetail) {//新增           
            vm.promise = AjaxService.ExecPlan("", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        } else {//修改
            vm.promise = AjaxService.ExecPlan("", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "1") {
                    toastr.success(data.data[0].Msg);
                    $(".pro-file").removeClass("active");
                    GetTreeData();
                } else {
                    toastr.error(data.data[0].Msg);
                }
            });
        }
    }
    //#endregion
    //获取模板详情
 



}
])

