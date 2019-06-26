'use strict';

angular.module('app')
.controller('FunFileContentDialogCtrl', ['$scope', '$uibModalInstance', 'ItemData', 'toastr', 'AjaxService', '$rootScope',
function ($scope, $uibModalInstance, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    vm.NewItem = ItemData;
    vm.Index = 2;
    vm.ThisFun = {
        FunNo: ItemData.FunNo,
        FunName:"新自定义功能",
        FunType: "R",
        DataType: "E",
        Controller: vm.NewItem.Controller,
        ControllerAs: vm.NewItem.ControllerAs,
        SerList: [],
        ColList:[],
    };
    vm.SerTypeConfig = { Table: "BasicData", Column: "SerType" };
    vm.ColTypeConfig = { Table: "FunCodeColSet", Column: "ColType" };
    vm.AbleNullConfig = { Table: "FunCodeColSet", Column: "ABleNull" };

    vm.ChangeEntity = ChangeEntity;
    vm.ChangeProc = ChangeProc;
    vm.Drop = Drop;
    vm.Drag = Drag;
    vm.IsColChange = IsColChange;
    vm.FunType = FunType;
    vm.DeleteFunCol = DeleteFunCol;
    vm.AddSer = AddSer;
    vm.DeleteSer = DeleteSer;
    vm.IsColAll = IsColAll;
    vm.GenCode = GenCode;

    //获取数据设定
    AjaxService.GetPlan("FunCodeSet", [{ name: "FunNo", value: ItemData.FunNo }]).then(function (data) {
        if (data.FunNo) {
            console.log(data);
            vm.ThisFun = data;
            vm.ThisFun.FunNo = ItemData.FunNo;
            vm.ThisFun.Controller = vm.NewItem.Controller;
            vm.ThisFun.ControllerAs = vm.NewItem.ControllerAs;
            GetColList(true);
            GetEnProcList();
        }
    });

    AjaxService.GetPlans("SysUISelect").then(function (data) {
        vm.SelectList = data;
    });

    //获取config数据
    //AjaxService.GetTableConfig(vm.SerTypeConfig.Table, vm.SerTypeConfig.Column).then(function (data) {
    //    vm.SerTypeData = data;
    //});
    //AjaxService.GetTableConfig(vm.ColTypeConfig.Table, vm.ColTypeConfig.Column).then(function (data) {
    //    vm.ColTypeData = data;
    //});
    //AjaxService.GetTableConfig(vm.AbleNullConfig.Table, vm.AbleNullConfig.Column).then(function (data) {
    //    vm.AbleNullData = data;
    //});

    //取消
    vm.cancel = cancel;
    vm.Ok = Ok;

    if (!vm.NewItem.Content) {
        //获取js， html文件
        AjaxService.AjaxHandle("GetFileText", vm.NewItem.FunNo).then(function (data) {
            vm.NewItem.Content = {};
            vm.NewItem.Content.Html = (data.Html || "").replace(/ControlNew/g, vm.NewItem.ControllerAs);
            vm.NewItem.Content.Js = (data.Js || "").replace(/NewJsCtrl/g, vm.NewItem.Controller);
        })
    }

    function FunType() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        GetColList();
    }

    function ChangeEntity() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        if (vm.ThisFun.DataType == 'P') {
            vm.ThisFun.ShortName = undefined;
            GetEnProcList();
        }
        if (vm.ThisFun.DataType == 'E') {
            GetColList();
        }
    }

    function GetEnProcList() {
        var en = {};
        en.name = "EntityName";
        en.value = vm.ThisFun.EntityName;
        AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
            vm.ProcList = data;
        });
    }

    function MergeEnColList() {
        vm.ThisFun.ColList = vm.ThisFun.ColList || [];
        var count = 0;
        for (var i = 0, len = vm.EnColList.length; i < len; i++) {
            if (!vm.EnColList[i]) continue;
            for (var j = 0, len = vm.ThisFun.ColList.length; j < len; j++) {
                if (vm.EnColList[i].ColumnName == vm.ThisFun.ColList[j].ColumnName) {
                    vm.EnColList[i].IsShow = true;
                    count++;
                }
            }
        }
        if (count == vm.EnColList.length) {
            vm.IsAll = true;
        }
    }

    function ChangeProc() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        GetColList();

        var en = {};
        en.planName = vm.ThisFun.EntityName;
        en.shortName = vm.ThisFun.ShortName;

        //获取存储过程查询条件
        AjaxService.Custom("GetProcPara", en).then(function (data) {
            vm.ThisFun.SerList = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var Ser = {};
                Ser.ColumnName = data[i].ColumnName;
                Ser.SerName = data[i].SerName;
                Ser.SerType = data[i].SerType;
                vm.ThisFun.SerList.push(Ser);
            }
        });
    }

    function GetColList(isLoad) {
        var en = {};
        en.planName = vm.ThisFun.EntityName;
        //实体自身的栏位取值
        if (vm.ThisFun.DataType == 'E' && vm.ThisFun.EntityName) {
            en.shortName = '--';
        }
        else if (vm.ThisFun.DataType == 'P' && vm.ThisFun.ShortName) {
            en.shortName = vm.ThisFun.ShortName;
        }
        else {
            return;
        }
        vm.promise = AjaxService.BasicCustom("GetPlanColumns", en).then(function (data) {
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
                    //初始化
                    for (var a = 0, l = ex.Columns.length; a < l; a++) {
                        var col = ex.Columns[a];
                        col.ColumnText = col.ColumnText || col.ColumnName;
                        col.ReadIndex = ex.ReadIndex;

                        //双方数据匹配
                        for (var j = 0, len2 = data2.length; j < len2; j++) {
                            if (ex.ReadIndex == data2[j].ReadIndex) {
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
                }
                vm.EnColList = vm.List[0].Columns;
                if(isLoad){
                    MergeEnColList();
                }
            })
        })
    }

    //添加条件
    function AddSer() {
        var have = false;
        vm.ThisFun.SerList = vm.ThisFun.SerList || [];
        if (!checkHaveCol(vm.ThisFun.SerList, vm.newSer.ColumnName)) {
            vm.ThisFun.SerList.push(vm.newSer);
        }
        vm.newSer = {};
    }

    function DeleteSer(index) {
        vm.ThisFun.SerList.splice(index, 1);
    }

    //显示栏位改变
    function IsColChange(col) {
        vm.ThisFun.ColList = vm.ThisFun.ColList || []
        if (col.IsShow) {
            if (!checkHaveCol(vm.ThisFun.ColList, col.ColumnName)) {
                var en = col;
                en.ColumnText = en.ColumnText || en.ColumnName;
                en.Width = "100px";
                en.EnNameDiv = en.EnNameDiv || '';
                en.EditCol = en.ColumnName;
                en.EditColDiv = en.EnNameDiv;
                en.ColType = 'Text';
                en.ABleNull = '1';
                vm.ThisFun.ColList.push(en);
            }
        }
        else {
            var index = -1;
            for (var i = 0, len = vm.ThisFun.ColList.length; i < len; i++) {
                if (vm.ThisFun.ColList[i].ColumnName == col.ColumnName) {
                    index = i; break;
                }
            }
            vm.IsAll = false;
            vm.ThisFun.ColList.splice(index, 1);
        }
    }

    function IsColAll() {
        if (!vm.EnColList) { return;}
        if (vm.IsAll) {
            for (var i = 0, len = vm.EnColList.length; i < len; i++) {
                if (!checkHaveCol(vm.ThisFun.ColList, vm.EnColList[i].ColumnName)) {
                    var en = vm.EnColList[i];
                    vm.EnColList[i].IsShow = true;
                    en.ColumnText = en.ColumnText || en.ColumnName;
                    en.Width = "100px";
                    en.EnNameDiv = en.EnNameDiv || '';
                    en.EditCol = en.ColumnName;
                    en.EditColDiv = en.EnNameDiv;
                    en.ColType = 'Text';
                    en.ABleNull = '1';
                    vm.ThisFun.ColList.push(en);
                }
            }
        }
        else {
            vm.ThisFun.ColList = [];
            for (var i = 0, len = vm.EnColList.length; i < len; i++) {
                    vm.EnColList[i].IsShow = false;
            }
        }
    }

    // drop
    function Drop(rol, index) {
        var en = angular.copy(rol);
        vm.ThisFun.ColList.splice(vm.DragIndex, 1);
        vm.ThisFun.ColList.splice(index, 0, en);
    }

    //检查是否已经存在
    function checkHaveCol(List, colName) {
        var have = false;
        for (var j = 0, len2 = List.length; j < len2; j++) {
            if (List[j].ColumnName == colName) {
                have = true; break;
            }
        }
        return have;
    }

    //
    function Drag(rol, index) {
        vm.DragIndex = index;
    }

    function DeleteFunCol(col, index) {
        col.IsShow = false;
        vm.IsAll = false;
        vm.ThisFun.ColList.splice(index, 1);
    }

    //生成代码
    function GenCode() {
        var en = {};
        en.strJson = JSON.stringify(vm.ThisFun);
        AjaxService.Custom("GenFuntionCode", en).then(function (data) {
            vm.NewItem.Content = data;
            toastr.success('生成成功');
            vm.Index = 0;
        })
    }

    //关闭
    function Ok() {
        vm.NewItem.FunSetting = angular.copy(vm.ThisFun);
        vm.NewItem.FunSetting.SerList = JSON.stringify(vm.ThisFun.SerList||[]);
        var ColList = [];
        for (var j = 0, len2 = vm.ThisFun.ColList.length; j < len2; j++) {
            var col = {};
            col.ColumnName = vm.ThisFun.ColList[j].ColumnName;
            col.ColumnText = vm.ThisFun.ColList[j].ColumnText;
            col.Width = vm.ThisFun.ColList[j].Width;
            col.EnNameDiv = vm.ThisFun.ColList[j].EnNameDiv || '';
            col.EditCol = vm.ThisFun.ColList[j].EditCol || '';
            col.EditColDiv = vm.ThisFun.ColList[j].EditColDiv || '';
            col.ColType = vm.ThisFun.ColList[j].ColType || '';
            col.ColValue = vm.ThisFun.ColList[j].ColValue || '';
            col.ABleNull = vm.ThisFun.ColList[j].ABleNull || '1';
            col.SortNo = j + 1;
            ColList.push(col);
        }
        vm.NewItem.FunSetting.ColList = JSON.stringify(ColList);
        vm.NewItem.FunSetting.TempColumns = "ColList,SerList";
        $uibModalInstance.close(vm.NewItem);
    };

    //关闭
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };
}
]);