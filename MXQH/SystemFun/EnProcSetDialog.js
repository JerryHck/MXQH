'use strict';

angular.module('app')
.controller('EnProcSetDialogCtrl', ['$scope', '$uibModalInstance', 'ItemData', 'toastr', 'AjaxService', '$rootScope',
function ($scope, $uibModalInstance, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    
    vm.SelectAll = SelectAll;
    vm.IsExcelChange = IsExcelChange;
    vm.DeleteExcel = DeleteExcel;
    vm.Save = Save;
    vm.Drop = Drop;
    vm.Drag = Drag;
    //取消
    vm.cancel = cancel;

    vm.ValueConvertConfig = { Table: "BasicData", Column: "ValueConvert" };

    GetList();
    function GetList() {
        vm.promise = AjaxService.GetProcColumns(ItemData.ConnectName, ItemData.ProcSchema + '.' + ItemData.ProcName).then(function (data) {
            vm.List = data;

            var enList = [];
            //获取数据库记录
            enList.push({ name: "EntityName", value: ItemData.EntityName });
            enList.push({ name: "ShortName", value: ItemData.ShortName });
            enList.push({ name: "ProcSchema", value: ItemData.ProcSchema });
            enList.push({ name: "ProcName", value: ItemData.ProcName });
            AjaxService.GetPlans("EnProcExcel", enList).then(function (data2) {
                vm.DataList = data2;

                for (var i = 0, len = vm.List.length; i < len; i++) {
                    var ex = vm.List[i];
                    ex.ExcelColumns = [];
                    //初始化
                    for (var a = 0, l = ex.Columns.length; a < l; a++) {
                        var col = ex.Columns[a];
                        col.ColumnText = col.ColumnText || col.ColumnName;
                        col.ReadIndex = ex.ReadIndex;

                        //双方数据匹配
                        for (var j = 0, len2 = data2.length; j < len2; j++) {
                            if (ex.ReadIndex == data2[j].ReadIndex) {
                                ex.IsExcel = data2[j].IsExcel;
                                ex.IsAll = data2[j].IsAll;
                                ex.SheetName = data2[j].SheetName;
                                vm.ExcelName = data2[j].ExcelName;
                                if (data2[j].Columns) {
                                    for (var k = 0, len3 = data2[j].Columns.length; k < len3; k++) {
                                        var colDb = data2[j].Columns[k];
                                        if (col.ReadIndex == colDb.ReadIndex && col.ColumnName == colDb.ColumnName) {
                                            col.IsConvert = colDb.IsConvert;
                                            col.ConvertType = colDb.ConvertType;
                                            col.ColumnText = colDb.ColumnText;
                                            col.IsAutoMerge = colDb.IsAutoMerge;
                                            col.IsExcel = colDb.IsExcel;
                                            col.ExcelRowNum = colDb.ExcelRowNum;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //excel 添加
                    for (var b = 0, l2 = data2.length; b < l2; b++) {
                        var ex2 = data2[b];
                        if (ex.ReadIndex == ex2.ReadIndex && ex2.Columns) {
                            for (var c = 0, l3 = ex2.Columns.length; c < l3; c++) {
                                var col2 = ex2.Columns[c];
                                if (col2.IsExcel) {
                                    for (var d = 0, l4 = ex.Columns.length; d < l4; d++) {
                                        if (col2.ColumnName == ex.Columns[d].ColumnName && col2.ReadIndex == ex.Columns[d].ReadIndex){
                                            ex.ExcelColumns.push(ex.Columns[d]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
    }

    //全选
    function SelectAll(table) {
        if (table.IsAll) {
            table.ExcelColumns = table.ExcelColumns|| [];
            for (var i = 0, len = table.Columns.length; i < len; i++) {
                table.Columns[i].IsExcel = true;
                if (!checkHaveCol(table, table.Columns[i].ColumnName)) {
                    var en = table.Columns[i];
                    en.ColumnText = en.ColumnText || en.ColumnName;
                    table.ExcelColumns.push(en);
                }
            }
        }
    }

    //栏位是否要选择导出excel
    function IsExcelChange(t, col) {
        t.ExcelColumns = t.ExcelColumns || []
        if (col.IsExcel) {
            if (!checkHaveCol(t, col.ColumnName)) {
                var en = col
                en.ColumnText = en.ColumnText || en.ColumnName;
                t.ExcelColumns.push(en);
            }
        }
        else {
            t.IsAll = false;
            var index = -1;
            for (var i = 0, len = t.ExcelColumns.length; i < len; i++) {
                if (t.ExcelColumns[i].ColumnName == col.ColumnName) {
                    index = i; break;
                }
            }
            t.ExcelColumns.splice(index, 1);
        }
    }

    function DeleteExcel(t, index)
    {
        t.IsAll = false;
        for (var i = 0, len = t.Columns.length; i < len; i++) {
            if (t.Columns[i].ColumnName == t.ExcelColumns[index].ColumnName) {
                t.Columns[i].IsExcel = false; break;
            }
        }
        t.ExcelColumns.splice(index, 1);
    }

    function Save() {
        var en = {}, ExcelProc = [], ColProc = [];
        en.EntityName = ItemData.EntityName;
        en.ShortName = ItemData.ShortName;
        en.ProcName = ItemData.ProcName;
        en.ProcSchema = ItemData.ProcSchema;
        
        for (var i = 0, len = vm.List.length; i < len; i++) {
            var ex = {};
            var exEn = vm.List[i];
            ex.ReadIndex = exEn.ReadIndex;
            ex.IsExcel = exEn.IsExcel || false;
            ex.SheetName = exEn.SheetName || "";
            ex.IsAll = exEn.IsAll || false;
            ex.ExcelName = vm.ExcelName || "";
            //加入栏位设定
            for (var k = 0, len3 = exEn.Columns.length; k < len3; k++) {
                var col = {}, ThisCol = vm.List[i].Columns[k];
                col.ReadIndex = ex.ReadIndex;
                col.ColumnName = ThisCol.ColumnName;
                col.IsConvert = ThisCol.IsConvert || false;
                col.ConvertType = ThisCol.ConvertType || '';
                col.ColumnText = ThisCol.ColumnText;
                col.IsExcel = ThisCol.IsExcel || false;
                col.IsAutoMerge = ThisCol.IsAutoMerge || false;
                col.ExcelRowNum = 0;
                //更新rownum
                if (exEn.ExcelColumns) {
                    for (var j = 0, len2 = exEn.ExcelColumns.length; j < len2; j++) {
                        if (exEn.ExcelColumns[j].ColumnName == col.ColumnName)
                        {
                            col.ExcelRowNum = j + 1; break;
                        }
                    }
                }
                ColProc.push(col)
            }

            ExcelProc.push(ex)
        }

        en.Excel = JSON.stringify(ExcelProc);
        en.Columns = JSON.stringify(ColProc);
        en.TempColumns = "Excel,Columns";

        AjaxService.ExecPlan("EnProcExcel", 'save', en).then(function (data) {
            AjaxService.ReflashPlan(ItemData.EntityName).then(function (data2) {
                toastr.success('储存成功');
                $uibModalInstance.close(ItemData);
            })
        });
    }

    // drop
    function Drop(t, rol, index) {
        var en = angular.copy(rol);
        t.ExcelColumns.splice(vm.DragIndex, 1);
        t.ExcelColumns.splice(index, 0, en);
    }

    //
    function Drag(rol, index) {
        vm.DragIndex = index;
    }

    //检查是否已经存在
    function checkHaveCol(t, colName) {
        var have = false;
        for (var j = 0, len2 = t.ExcelColumns.length; j < len2; j++) {
            if (t.ExcelColumns[j].ColumnName == colName) {
                have = true; break;
            }
        }
        return have;
    }

    //取消
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };
}
]);