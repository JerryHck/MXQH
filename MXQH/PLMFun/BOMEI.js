'use strict';

angular.module('app')
.controller('BOMEICtrl', ['$scope', '$http', '$q', 'AjaxService','$window',
function ($scope, $http, $q, AjaxService,$window) {

    var bomei = this;
    bomei.Import = ImportExcel;
    bomei.Export = ExportExcel;
    bomei.Do = Do;
    bomei.FileData = { header: { header: ["Line", "Code", "SPEC", "Name", "Num", "Version", "Cost", "Weight", "BOMUom", "BaseNum", "Waste", "Position", "Remark"] }, sheetNum: 1, data: [] };
    
    //导入excel数据
    function ImportExcel() {
        //导入时将表头也包含在内，表头的行号为1，在存储过程中导入时自动删除表头这一行
        var en = {};
        en.ListLoad = JSON.stringify(bomei.List);
        en.TempColumns = 'ListLoad';
        bomei.promise = AjaxService.ExecPlan("AuctusBom", "AuctusImport", en).then(function (data) {
            //更新功能基本信息
            toastr.success('储存成功');
        })
    }
    //导出excel数据
    function ExportExcel() {
        var en = {};
        var sheet = {};
        sheet.SheetName = "BOM列表";
        sheet.ColumnsName = ["层次号", "料品", "规格", "品名", "数量", "版本号", "成本", "重量", "BOM单位", "基数", "耗损率", "装配位置", "BOM备注"]
        sheet.FirstColunms = false;
        bomei.promise = AjaxService.ExecPlanToExcel("AuctusBom", 'AuctusBOM', en, sheet).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function Do() {
        bomei.List = angular.copy(bomei.FileData.data[0]);
    }
}

]);