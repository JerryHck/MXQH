'use strict';

angular.module('AppSet')
.controller('SysTableSetHisDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Item = ItemData;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.SelectVer = SelectVer;
    vm.CheckDataType = CheckDataType;
    vm.ChangeList = ChangeList;
    vm.OpType = 'N';

   
    //获取当前表数据
    var en = {};
    en.Conn = ItemData.ConnectName;
    en.TableName = ItemData.SchemeName + "." + ItemData.TableName;
    vm.promise = AjaxService.BasicCustom("GetTableData", en).then(function (data) {
        vm.NowData = data;
        vm.OriColList = vm.NowData.Columns;
        GetVer();
    })

    function GetVer() {
        //获取版本
        AjaxService.GetPlans("MTableSet",
                [{ name: "ConnectName", value: ItemData.ConnectName },
                { name: "SchemeName", value: ItemData.SchemeName },
                { name: "TableName", value: ItemData.TableName }]).then(function (data) {
                    vm.VerList = data;
                    SelectVer(data[0]);
                })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function SelectVer(item) {
        vm.SelectedVer = item;
        //获取历史数据
        AjaxService.GetPlan("TableSet", { name: "ID", value: vm.SelectedVer.ID }).then(function (data) {
            
            for (var i = 0, len = data.ColSet.length; i < len; i++) {
                data.ColSetHis = data.ColSetHis || [];
                for (var j = 0, len1 = data.ColSetHis.length; j < len1; j++) {
                    if (data.ColSet[i].OrderNo == data.ColSetHis[j].OrderNo) {
                        data.ColSet[i].OriCol = data.ColSetHis[j];
                    }
                }
            }
            vm.LogData = data;
            ChangeList(vm.OpType);
        })
    }

    function ChangeList(type) {
        vm.OpType = type;
        vm.OriColList = type == 'O' ? vm.LogData.ColSetHis : vm.NowData.Columns;
    }

    function CheckDataType(type, op) {
        var b = false;
        if (op == 'F') {
            b = type == 'DECIMAL';
        }
        else {
            b = type == 'VARCHAR' || type == 'NVARCHAR' || type == 'NCHAR' || type == 'CHAR';
        }
        return b;
    }

    function GetContition() {
        var list = [];
        return list;
    }
    function OK(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
