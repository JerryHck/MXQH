'use strict';

angular.module('AppSet')
.controller('FormAreaColumnsCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    
    vm.ItemData = ItemData;
    vm.ColList = vm.ItemData.ThisArea.Columns || [];
    
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.IsColAll = IsColAll;
    vm.IsColChange = IsColChange;
    vm.DeleteFunCol = DeleteFunCol;

    MergeEnColList();
    AjaxService.GetPlans("SysUISelect").then(function (data) {
        vm.SelectList = data;
    });

    function IsColAll() {
        if (!vm.ItemData.ColumnList) { return; }
        if (vm.IsAll) {
            for (var i = 0, len = vm.ItemData.ColumnList.length; i < len; i++) {
                if (!checkHaveCol(vm.ColList, vm.ItemData.ColumnList[i].ColumnName)) {
                    vm.ColList.push(Convert(vm.ItemData.ColumnList[i]));
                }
                vm.ItemData.ColumnList[i].IsShow = true;
            }
        }
        else {
            vm.ColList = [];
            for (var i = 0, len = vm.ItemData.ColumnList.length; i < len; i++) {
                vm.ItemData.ColumnList[i].IsShow = false;
            }
        }
    }

    //显示栏位改变
    function IsColChange(col) {
        vm.ColList = vm.ColList || []
        if (col.IsShow) {
            if (!checkHaveCol(vm.ColList, col.ColumnName)) {
                vm.ColList.push(Convert(col));
            }
        }
        else {
            var index = -1;
            for (var i = 0, len = vm.ColList.length; i < len; i++) {
                if (vm.ColList[i].ColumnName == col.ColumnName) {
                    index = i; break;
                }
            }
            vm.IsAll = false;
            vm.ColList.splice(index, 1);
        }
    }

    function MergeEnColList() {
        vm.ColList = vm.ColList || [];
        var count = 0;
        for (var i = 0, len = vm.ItemData.ColumnList.length; i < len; i++) {
            if (!vm.ItemData.ColumnList[i]) continue;
            for (var j = 0, len2 = vm.ColList.length; j < len2; j++) {
                if (vm.ItemData.ColumnList[i].ColumnName == vm.ColList[j].ColumnName) {
                    vm.ItemData.ColumnList[i].IsShow = true;
                    vm.ColList[j].ColumnType = vm.ItemData.ColumnList[i].ColumnType;
                    vm.ColList[j].TableAs = vm.ColList[j].ColumnName.substr(0, 1);
                    count++;
                }
            }
        }
        if (count == vm.ItemData.ColumnList.length) {
            vm.IsAll = true;
        }
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

    function Convert(item) {
        var en = item;
        en.ColumnText = en.ColumnNameDesc || en.ColumnName;
        en.LabelWidth = vm.ItemData.ThisArea.LabelWidth;
        en.ControlWidth = vm.ItemData.ThisArea.ControlWidth;
        en.EnNameDiv = en.EnNameDiv || '';
        en.EditCol = en.ColumnName;
        en.EditColDiv = en.EnNameDiv;
        en.ColType = 'Text';
        en.TableAs = en.ColumnName.substr(0, 1);
        en.ABleNull = en.TableAs != 'a' || en.ColumnType == "3" ? "0" : "1";
        en.ColValue = en.ColValue || '';
        en.CheckExists = false;
        return en;
    }

    function DeleteFunCol(col, index) {
        col.IsShow = false;
        vm.IsAll = false;
        vm.ColList.splice(index, 1);
    }

    function GetContition() {
        var list = [];
        return list;
    }
    function OK() {
        var list = [];
        for (var i = 0, len = vm.ColList.length; i < len; i++) {
            var en = angular.copy(vm.ColList[i]);
            list.push(en);
        }
        $uibModalInstance.close(list);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
