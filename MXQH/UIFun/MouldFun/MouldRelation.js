
'use strict';
angular.module('app')
.controller('MouldRelationCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form','$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form,$window) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.pageDetail = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    //vm.Item = {};

    vm.Add = Add;//跳转新增页面
    vm.Edit = Edit;//查看
    vm.Save = Save;
    vm.Insert = Insert;
    vm.Cancel = Cancel;
    vm.Search = Search;
    vm.Export = Export;
    vm.SelectItem = SelectItem;
    vm.SaveLine = SaveLine;//保存行
    vm.CancelLine = CancelLine;//放弃行
    vm.AddLine = AddLine;//新增行
    vm.EditLine = EditLine;//编辑行
    vm.DeleteLine = DeleteLine;//删除行数据
    vm.GetLines = GetLines;
    vm.IsShow = false;
    vm.tabIndex = 0;
    Init();
    DataBind();
    //新增/编辑初始化页面
    function Init() {
        vm.Line = {};
        vm.MouldRelation = {};
        vm.MouldInfo = {};
        vm.Lines = [];
    }
    function GetLines(id) {
        var li = [];
        if (vm.Ser.Code) {
            vm.page.Code=vm.Ser.Code
        }
        if (vm.Ser.Name) {
            vm.page.Name = vm.Ser.Name
        }
        li.push({ name: "Deleted", value: '0' });
        li.push({ name: "MouldID", value: id });
        vm.promise = AjaxService.GetPlansPage("MouldRelation", li, vm.pageDetail.pageIndex, vm.pageDetail.pageSize).then(function (data) {
            vm.Lines = data.List;
            //vm.page.total = data.Count;
        });
    }
    function Export() {
        GetCondition();
        vm.page.pageSize = 100000;
        vm.promise = AjaxService.GetPlanExcel("MouldRelation", "GetList", vm.page).then(function (data) {
            vm.page.pageSize = 1;
            $window.location.href = data.File;
        });
    }
    //绑定数据
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("MouldRelation", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    //查询条件
    function GetCondition() {
        vm.page.MouldCode = vm.Ser.Code == '' ? undefined : vm.Ser.Code;
        vm.page.MouldName = vm.Ser.Name == '' ? undefined : vm.Ser.Name;
        vm.page.ItemCode = vm.Ser.ItemCode == '' ? undefined : vm.Ser.ItemCode;
        vm.page.ItemName = vm.Ser.ItemName == '' ? undefined : vm.Ser.ItemName;
        vm.page.Holder = vm.Ser.Holder == '' ? undefined : vm.Ser.Holder;
        vm.page.ModelType = vm.Ser.ModelType == '' ? undefined : vm.Ser.ModelType;
    }
    //查看
    function Edit(mouldCode) {
        changeTab(1);
        vm.pageDetail.MouldCode = mouldCode;
        vm.promise = AjaxService.ExecPlan("MouldRelation", "GetList", vm.pageDetail).then(function (data) {
            var m = angular.copy(data.data[0]);
            vm.MouldInfo.ID = m.MouldID;
            vm.MouldInfo.Code = m.MouldCode;
            vm.MouldInfo.Name = m.MouldName;
            vm.MouldInfo.SPECS = m.MouldSPECS;
            vm.Lines = data.data;
        });
    }
    //新增
    function Insert() {
        Init();
    }
    //跳转新增页面
    function Add() {
        changeTab(1);
        Init();
    }
    //放弃
    function Cancel() {
        Init();
    }
    //选择物料信息
    function SelectItem() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("CBOItemDialog", resolve).then(function (data) {
            if (data.ID) {
                for (var i = 0; i < vm.Lines.length; i++) {
                    if (vm.Lines[i].ItemID == data.ID) {
                        toastr.error(data.Code + '不可重复添加！');
                        return;
                    }
                }
                vm.Line.ItemID = data.ID;
                vm.Line.ItemCode = data.Code;
                vm.Line.ItemName = data.Name;
                vm.Line.ItemSPECS = data.SPECS;
            }
        }).catch(function (reason) {

        });
    }
    //新增行
    function AddLine() {
        vm.IsShow = true;
        vm.IsAddLine = true;
        InitLine('');
    }
    //初始化行数据
    function InitLine(item) {
        if (item.ID) {//编辑行
            var l = angular.copy(item);
            vm.Line = l;
        } else {//新增行
            vm.Line = { ID: -1 };
        }
    }
    //编辑行
    function EditLine(item) {
        item.EffectiveDate = new Date(item.EffectiveDate).toLocaleDateString();
        item.DisableDate = new Date(item.DisableDate).toLocaleDateString();
        vm.IsShow = true;
        vm.IsAddLine = false;
        vm.Line = angular.copy(item);
    }

    //保存行数据
    function SaveLine() {
        vm.IsShow = false;
        var l = angular.copy(vm.Line);
        if (!l.Remark) {
            l.Remark = '';
        }
        if (vm.IsAddLine) {
            vm.Lines.push(l);
        } else {
            for (var i = 0; i < vm.Lines.length; i++) {
                if (vm.Lines[i].ItemCode == l.ItemCode) {
                    vm.Lines[i].ID = l.ID;
                    vm.Lines[i].ItemCode = l.ItemCode;
                    vm.Lines[i].ItemName = l.ItemName;
                    vm.Lines[i].ItemSPECS = l.ItemSPECS;
                    vm.Lines[i].MouldCode = l.MouldCode;
                    vm.Lines[i].MouldID = l.MouldID;
                    vm.Lines[i].MouldName = l.MouldName;
                    vm.Lines[i].MouldSPECS = l.MouldSPECS;
                    vm.Lines[i].PoorRate = l.PoorRate;
                    vm.Lines[i].Remark = l.Remark;
                    vm.Lines[i].UnitOutput = l.UnitOutput;
                    vm.Lines[i].EffectiveDate = l.EffectiveDate;
                    vm.Lines[i].DisableDate = l.DisableDate;
                    return;
                }
            }
        }

    }

    function DeleteLine(code) {
        for (var i = 0; i < vm.Lines.length; i++) {
            if (vm.Lines[i].ItemCode == code) {
                vm.Lines.splice(i, 1);
                $scope.$apply();
                return;
            }
        }
    }

    //放弃行数据
    function CancelLine() {
        vm.Line = {};
        vm.IsShow = false;
    }

    //保存模具料品关系
    function Save() {
        if (vm.Lines.length == 0) {
            toastr.error('请添加模具信息！');
            return;
        }
        if (!vm.MouldInfo.ID) {
            toastr.error('请添加料品信息！');
            return;
        }
        if (!vm.Lines[0].PoorRate) {
            vm.Lines[0].PoorRate = null;
        }
        var mouldInfo = {};
        var en = {};
        var mouldArr = [];
        mouldInfo.MouldID = vm.MouldInfo.ID;
        mouldInfo.MouldCode = vm.MouldInfo.Code;
        mouldInfo.MouldName = vm.MouldInfo.Name;
        mouldInfo.MouldSPECS = vm.MouldInfo.SPECS;
        mouldInfo.CreateBy = $rootScope.User.Name;
        mouldInfo.ModifyBy = $rootScope.User.Name;
        mouldArr.push(mouldInfo);
        en.TempColumns = "MouldInfo,Lines";
        en.MouldInfo = JSON.stringify(mouldArr)
        en.Lines = JSON.stringify(vm.Lines);
        vm.promise = AjaxService.ExecPlan("MouldRelation", "Save", en).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                DataBind();
            } else {
                toastr.error(data.data[1].Msg);
            }
        });



    }
    //切换tab页
    function changeTab(index) {
        vm.tabIndex = index;
    }
}
])