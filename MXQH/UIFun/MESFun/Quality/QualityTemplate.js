'use strict';
angular.module('app')
.controller('QualityTemplatesCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var vm = this;
    vm.templagePage = { pageIndex: 1, pageSize: 30, maxSize: 10 };
    vm.SelectedTemplate = {};
    vm.ItemData = {};
    vm.Detail = {};
    vm.EditItem = {};
    vm.AddTemplate = AddTemplate;//新增弹出框   
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
        Open({})
    }
    //编辑 检测模板
    function Edit(item) {
        Open(item);
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
    function Open(item) {
        Dialog.OpenDialog("QualityTemplateDialog", item).then(function (data) {
            DataBind();
        }).catch(function (reason) {
        });
    }

    //选择模板
    function SelectTemplate(item) {
        vm.SelectedTemplate = item;
        Search()
        vm.ItemData = {};
    }


    //获取第一层模版
    AjaxService.GetPlans("QualityProperty", [{ name: "PID", value: -1 }]).then(function (data) {
        vm.TopLevels = data;
    });

    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.InsertDtl = InsertDtl;
    vm.SaveInsert = SaveInsert;
    vm.EditDtl = EditDtl;
    vm.DeleteDtl = DeleteDtl;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ProChange = ProChange;
    vm.IsAddPropertyCodeExists = IsAddPropertyCodeExists;
    vm.IsEditPropertyCodeExists = IsEditPropertyCodeExists;

    function ProChange(item, t) {
        item.PropertyID = item.SelProperty.ID;
        item.PropertyCode = item.SelProperty.Code;
        item.PropertyName = item.SelProperty.text;
        if (t == 'I') {
            IsAddPropertyCodeExists();
        }
        else {
            IsEditPropertyCodeExists();
        }
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function InsertDtl() {
        vm.NewItem = { TemplateID: vm.SelectedTemplate.ID, TemplateCode: vm.SelectedTemplate.Code, TemplateName: vm.SelectedTemplate.Name };
        vm.IsInsert = true;
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("QualityTemplateRelation", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function EditDtl(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        for (var j = 0, len1 = vm.TopLevels.length; j < len1; j++) {
            if (vm.TopLevels[j].ID == item.PropertyID) {
                vm.EditItem.SelProperty = angular.copy(vm.TopLevels[j]);
            }
        }
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function DeleteDtl(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("QualityTemplateRelation", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.PropertyID = vm.EditItem.PropertyID;
        en.PropertyCode = vm.EditItem.PropertyCode;
        en.PropertyName = vm.EditItem.PropertyName;
        en.OrderNo = vm.EditItem.OrderNo;
        vm.promise = AjaxService.PlanUpdate("QualityTemplateRelation", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        AjaxService.GetPlansPage("QualityTemplateRelation", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.DtlList = data.List;
            vm.page.total = data.Count;
        });

    }


    function IsAddPropertyCodeExists() {
        var list = [];
        list.push({ name: "PropertyCode", value: vm.NewItem.PropertyCode });
        list.push({ name: "TemplateID", value: vm.SelectedTemplate.ID });
        AjaxService.GetPlan("QualityTemplateRelation", list).then(function (data) {
            vm.InsertForm.PropertyCode.$setValidity('unique', !data.PropertyCode);
        });
    }
    function IsEditPropertyCodeExists() {
        if (vm.NowItem.PropertyCode != vm.EditItem.PropertyCode) {
            var list = [];
            list.push({ name: "PropertyCode", value: vm.EditItem.PropertyCode });
            list.push({ name: "TemplateID", value: vm.SelectedTemplate.ID });
            vm.promise = AjaxService.GetPlan("QualityTemplateRelation", list).then(function (data) {
                vm.NowItem.ItemForm.item_PropertyCode.$setValidity('unique', !data.PropertyCode);
            });
        }
    }
    function GetContition() {
        var list = [];
        list.push({ name: "TemplateID", value: vm.SelectedTemplate.ID || -1 })
        if (vm.Ser.aPropertyName) {
            list.push({ name: "PropertyName", value: vm.Ser.aPropertyName, tableAs: "a" });
        }
        return list;
    }


}
])

