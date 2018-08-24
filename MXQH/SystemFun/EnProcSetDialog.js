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
                for (var i = 0, len = vm.List.length; i < len; i++) {
                    for (var j = 0, len2 = data2.length; j < len2; j++) {
                        if (vm.List[i].ReadIndex == data2[j].ReadIndex) {
                            vm.List[i].IsExcel = data2[j].IsExcel;
                            vm.List[i].IsAll = data2[j].IsAll;
                            vm.List[i].SheetName = data2[j].SheetName;
                            vm.List[i].ExcelColumns = [];
                            if (data2[j].Columns) {
                                for (var k = 0, len3 = data2[j].Columns.length; k < len3; k++) {
                                    var colDb = data2[j].Columns[k];
                                    colDb.ColumnText = colDb.ColumnText || colDb.ColumnName;
                                    vm.List[i].ExcelColumns.push(colDb);
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
            ex.ReadIndex = vm.List[i].ReadIndex;
            ex.IsExcel = vm.List[i].IsExcel;
            ex.SheetName = vm.List[i].SheetName;
            ex.IsAll = vm.List[i].IsAll;
            ex.ReadIndex = vm.List[i].ReadIndex;
            //加入convert
            for (var j = 0, len2 = vm.List[i].Columns.length; j < len2; j++) {
                if (vm.List[i].Columns[j].IsConvert) {
                    var convert = {};
                    convert.ReadIndex = ex.ReadIndex;
                    convert.ColumnName = vm.List[i].Columns[j].ColumnName;
                    convert.ColumnName = vm.List[i].Columns[j].ColumnName;

                    ExcelProc.push()
                }
                
            }

            ExcelProc.push(ex)
        }

        en.Excel = JSON.stringify(ExcelProc);
        en.Columns = JSON.stringify(ColProc);
        en.TempColumns = "Excel, Columns";

        AjaxService.ExecPlan("EnProcExcel", 'save', vm.NewItem).then(function (data) {
            toastr.success('储存成功');
            $uibModalInstance.close(vm.NewItem);
        });
    }

    function DeleteLoad(index) {
        vm.NewItem.LoadFiles.splice(index, 1);
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