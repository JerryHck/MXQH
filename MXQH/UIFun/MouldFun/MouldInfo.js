'use strict';
angular.module('app')
.controller('MouldInfoCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Add = Add;//新增
    vm.Edit = Edit;//查看
    vm.Search = Search;
    vm.Export = Export;
    vm.Import = Import;
    vm.Delete = Delete;
    vm.DataBind = DataBind;
    vm.Do = Do;
    vm.OpenImport = OpenImport;
    vm.FileData = {
        header: {
            header: ["Code", "Name", "Holder", "ModelType", "SPECS", "HoleNum", "TotalNum", "DailyCapacity"
                , "DailyNum", "RemainNum", "Manufacturer", "CycleTime", "ProductWeight", "NozzleWeight", "DealDate", "EffectiveDate", "MachineWeight","Remark"]
        }, sheetNum: 1, data: []
    };
    DataBind();
    function OpenImport() {
        $(".pro-file").addClass("active");
    }
    function Import() {
        //导入时将表头也包含在内，表头的行号为1，在存储过程中导入时自动删除表头这一行
        var en = {};
        en.CreateBy = $rootScope.User.Name;
        en.List = JSON.stringify(vm.ImportList);
        en.TempColumns = 'List';
        vm.promise = AjaxService.ExecPlan("MouldInfo", "Import", en).then(function (data) {
            if (data.data[0].MsgType == "0") {
                toastr.error(data.data[0].Msg);
            } else {
                //更新功能基本信息
                DataBind();
                toastr.success(data.data[0].Msg);
            }

        })
    }
    function Do() {
        vm.IsValid = true;
        vm.ImportList = angular.copy(vm.FileData.data[0]);
        vm.ImportList.splice(0, 1);
        if (!vm.ImportList[0].Name||!vm.ImportList[0].ModelType||!vm.ImportList[0].Holder) {
            toastr.error('模具名称/使用机型/使用厂商为必填项！');
            vm.IsValid = false;
            return;
        }
        if (!vm.ImportList[0].Code) {
            vm.ImportList[0].Code = '';
        }
        if (!vm.ImportList[0].SPECS) {
            vm.ImportList[0].SPECS = '';
        }
        if (!vm.ImportList[0].HoleNum) {
            vm.ImportList[0].HoleNum = null;
        }
        if (!vm.ImportList[0].DailyCapacity) {
            vm.ImportList[0].DailyCapacity = null;
        }
        if (!vm.ImportList[0].DailyNum) {
            vm.ImportList[0].DailyNum = null;
        }
        if (!vm.ImportList[0].RemainNum) {
            vm.ImportList[0].RemainNum = null;
        }
        if (!vm.ImportList[0].Manufacturer) {
            vm.ImportList[0].Manufacturer = null;
        }
        if (!vm.ImportList[0].CycleTime) {
            vm.ImportList[0].CycleTime = null;
        }
        if (!vm.ImportList[0].ProductWeight) {
            vm.ImportList[0].ProductWeight = null;
        }
        if (!vm.ImportList[0].NozzleWeight) {
            vm.ImportList[0].NozzleWeight = null;
        }
        if (!vm.ImportList[0].DealDate) {
            vm.ImportList[0].DealDate = null;
        }
        if (!vm.ImportList[0].EffectiveDate) {
            vm.ImportList[0].EffectiveDate = null;
        }
        if (!vm.ImportList[0].Remark) {
            vm.ImportList[0].Remark = null;
        }
        if (!vm.ImportList[0].MachineWeight) {
            vm.ImportList[0].MachineWeight = null;
        }
    }
    function Export() {
        vm.promise = AjaxService.GetPlanOwnExcel("MouldInfo", GetCondition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.GetPlansPage("MouldInfo", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }

    //查询条件
    function GetCondition() {
        var li = [];
        li.push({ name: "Deleted", value: '0' });
        if (vm.Ser.Code) {
            li.push({ name: "Code", value: '%' + vm.Ser.Code + '%' });
        }
        if (vm.Ser.Name) {
            li.push({ name: "Name", value: '%' + vm.Ser.Name + '%' });
        }
        if (vm.Ser.Holder) {
            li.push({ name: "Holder", value: '%' + vm.Ser.Holder + '%' });
        }
        if (vm.Ser.ModelType) {
            li.push({ name: "ModelType", value: '%' + vm.Ser.ModelType + '%' });
        }
        return li;
    }
    //查看
    function Edit(id) {
        var resolve = {
            ItemData: function () {
                return { ID: id };
            }
        }
        Open(resolve);
    }
    //新增
    function Add() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Open(resolve);
    }
    //删除
    function Delete(id) {        
        vm.promose = AjaxService.ExecPlan("MouldInfo", "Delete", { ID: id }).then(function (data) {
            if (data.data[0].MsgType == '1') {
                DataBind();
                toastr.success(data.data[0].Msg);
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }
    //弹出框
    function Open(resolve) {
        Dialog.open("MouldDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

}
])