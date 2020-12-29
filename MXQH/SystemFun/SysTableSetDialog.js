'use strict';

angular.module('AppSet')
.controller('SysTableDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Index = 0;
    vm.Item = angular.copy(ItemData);
    vm.Way = vm.Item.TableName ? 'O' : 'N';
    vm.TableData = { DbSchema: "dbo", Columns:[] };

    vm.SaveToSystem = SaveToSystem;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.CheckDataType = CheckDataType;
    vm.ChangeWay = ChangeWay;
    vm.Compare = Compare;
    vm.Copy = Copy;
    vm.SyncCompare = SyncCompare;

    $scope.$watch(function () { return vm.Item.ConnectName; }, Init);
    $scope.$watch(function () { return vm.SelectedTable; }, GetTableData);

    if (vm.Item.TableName) {
        GetTbData(vm.Item.ConnectName, vm.Item.TableName)
    }

    function ChangeWay() {
        if (vm.Way == "N") {
            vm.TableData = { DbSchema: "dbo", Columns: [] };
        }
    }

    function Init() {
        if (!vm.isCopy) {
            vm.TableData = { DbSchema: "dbo", Columns: [] };
        }
        vm.Item.ToConnectName = vm.Item.ConnectName;
        vm.SelectedTable = undefined;
    }

    function Copy() {
        vm.isCopy = true;
        vm.Way = "N";
        vm.TableData.Name = undefined;
        vm.Item.TableName = undefined;
    }

    //Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function GetTableData() {
        if (vm.Item.ConnectName && vm.SelectedTable) {
            GetTbData(vm.Item.ConnectName, vm.SelectedTable.TableName);
        }
    }

    function GetTbData(conName, tbName) {
        var en = {};
        en.Conn = conName;
        en.TableName = tbName;
        vm.promise = AjaxService.BasicCustom("GetTableData", en).then(function (data) {
            vm.Index = 0;
            //for (var i = 0, len = data.Columns.length; i < len; i++) {
            //    data.Columns[i].OriCol = angular.copy(data.Columns[i]);
            //}
            vm.isCopy = false;
            vm.TableData = data;
            //console.log(data)
        })
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESAucWOPlan", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.TableData.Columns = data.List;
            vm.page.total = data.Count;
        });

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

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.Drag = Drag;
    vm.Drop = Drop;

    //
    function Drag(rol, index) {
        vm.DragIndex = index;
    }

    function Drop(rol, index) {
        var en = angular.copy(rol);
        vm.TableData.Columns.splice(vm.DragIndex, 1);
        vm.TableData.Columns.splice(index, 0, en);
    }

    function Compare() {
        var en = {};
        var tbData = angular.copy(vm.TableData);

        for (var i = 0, len = tbData.Columns.length; i < len; i++) {
            //tbData.Columns[i].OriCol = undefined;
            tbData.Columns[i].ItemForm = undefined;
            tbData.Columns[i].OrderNo = i + 1;
        }
        en.Conn = vm.Item.ConnectName;
        en.OpType = vm.Way;
        en.strJson = JSON.stringify(tbData);
        vm.promise = AjaxService.BasicCustom("CompareTable", en).then(function (data) {
            vm.UpSql = data;
            vm.ComConn = en.Conn;
            vm.Index = 1;
        })
    }

    function SyncCompare() {
        var en = {};
        var tbData = angular.copy(vm.TableData);

        for (var i = 0, len = tbData.Columns.length; i < len; i++) {
            //tbData.Columns[i].OriCol = undefined;
            tbData.Columns[i].ItemForm = undefined;
            tbData.Columns[i].OrderNo = i + 1;
        }
        en.Conn = vm.Item.ToConnectName;
        en.OpType = "T";
        en.strJson = JSON.stringify(tbData);
        vm.promise = AjaxService.BasicCustom("CompareTable", en).then(function (data) {
            vm.UpSql = data;
            vm.ComConn = en.Conn;
            vm.Index = 1;
        })
    }

    function SaveToSystem(way) {
        var en = {};
        var tbData = angular.copy(vm.TableData);

        for (var i = 0, len = tbData.Columns.length; i < len; i++) {
            //tbData.Columns[i].OriCol = undefined;
            tbData.Columns[i].ItemForm = undefined;
            tbData.Columns[i].OrderNo = i + 1;
        }
        en.Conn = vm.ComConn;
        en.OpType = vm.Way;
        en.strJson = JSON.stringify(tbData);
        vm.promise = AjaxService.BasicCustom("SaveCompare", en).then(function (data) {
            GetTbData(vm.Item.ConnectName, tbData.TableName);
            toastr.success("更新成功")
            vm.Index = 0;
        })
    }

    function Insert() {
        vm.NewItem = { DataType: "NVARCHAR", IsKey: false, Flag: false, AbleNull: true, CharLen:30 };
        vm.IsInsert = true;
    }

    function SaveInsert() {
        //验证栏位是否合法
        var en = angular.copy(vm.NewItem)
        vm.TableData.Columns.push(en);
        vm.IsInsert = false;
        toastr.success('新增成功');
    }

    function Edit(item) {
        for (var i = 0, len = vm.TableData.Columns.length; i < len; i++) {
            vm.TableData.Columns[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(index) {
        vm.TableData.Columns.splice(index, 1);
        toastr.success('删除成功');
    }

    function SaveEdit(index) {
        var en = {};
        vm.TableData.Columns[index] = vm.EditItem;
        toastr.success('保存成功');
    }

}]);
