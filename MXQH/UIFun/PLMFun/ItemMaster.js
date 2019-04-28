'use strict';

angular.module('app')
.controller('ItemmasterCtrl', ['$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($scope, $http, Dialog, toastr, AjaxService, Form, MyPop) {
    var itemmaster = this;
    itemmaster.Insert = Insert;
    itemmaster.Edit = Edit;
    itemmaster.S = {};//搜索条件
    itemmaster.Delete = Delete;
    itemmaster.form = Form[0];
    itemmaster.page = { index: 1, size: 15,maxSize:10 };
    itemmaster.PageChange = PageChange;
    itemmaster.Search = Search;
    itemmaster.Export = ExportExcel;
    PageChange();
    //导出
    function Export() {

    }
    //查询
    function Search() {
        itemmaster.page.index = 1;
        PageChange()
    }

    function ExportExcel() {
        var en = {};
        if (itemmaster.S.DocLineNo) {
            en.DocLineNo = itemmaster.S.DocLineNo
        }        
        var sheet = {};
        sheet.SheetName = "BOM列表";
        sheet.ColumnsName = ["组号", "料品", "品名","规格","料品类型"]
        sheet.FirstColunms = false;
        console.log(itemmaster.S);
        itemmaster.promise = AjaxService.ExecPlanToExcel("AuctusItemMaster", 'AuctusExcelTest', en, sheet).then(function (data) {            
            window.location.href = data.File;
        });
    }

    //绑定数据（带分页）
    function PageChange() {
        var list2 = [];
        if (itemmaster.S.DocLineNo) {
            list2.push({ name: "DocLineNo", value: itemmaster.S.DocLineNo });
        }
        if (itemmaster.S.Code) {
            list2.push({ name: "Code", value: itemmaster.S.Code });
        }
        itemmaster.promise = AjaxService.GetPlansPage("AuctusItemMaster", list2, itemmaster.page.index, itemmaster.page.size).then(function (data) {
            itemmaster.List = data.List;
            itemmaster.page.total = data.Count;
        });
    }
    //新增弹出框
    function Insert() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        };
        Open("I", resolve);
    }

    //打开弹出框 I/U->新增/编辑
    function Open(type, resolve) {
        Dialog.open("ItemmasterDialog", resolve).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }
    //删除
    function Delete(item) {
        itemmaster.promise = AjaxService.PlanDelete('AuctusItemMaster', item).then(function (data) {
            toastr.success("删除成功");
            GetData();

        });
    }
    //编辑弹出框
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open('U', resolve);
    }
}
]);