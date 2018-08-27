'use strict';

angular.module('app')
.controller('GenerateSnCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.NewBind = { Action: "I", CreateBy: $rootScope.User.UserNo, Customer:"U" };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.NewItemType = {};

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;
    vm.DeleteItemType = DeleteItemType;

    vm.InsertItemType = InsertItemType;

    PageChange();
    GetItemTypeList();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
        }
        if (vm.Ser.IDCode1) {
            list.push({ name: "IDCode1", value: vm.Ser.IDCode1 });
        }
        list.push({ name: "Customer", value: "U" });

        vm.promise = AjaxService.GetPlansPage("BindCode", list, vm.page.index, vm.page.size).then(function (data) {
            vm.BindList = data.List;
            vm.page.total = data.Count;
        });
    }

    //

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.InternalCode) {
            var en = {};
            en.name = "InternalCode";
            en.value = vm.NewBind.InternalCode;
            AjaxService.GetPlan("MesPlanMain", en).then(function (data) {
                var mss = "生产条码 [" + vm.NewBind.InternalCode + '] ';
                if (!data.InternalCode) {
                    vm.NewBind.InternalCode = undefined;
                    //toastr.error(mes);
                    vm.MesList.splice(0, 0, { IsOk: false, Msg: mss + '  不存在或还没有上线' });
                }
                else {
                    AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
                        if (data2.InternalCode) {
                            vm.NewBind.InternalCode = undefined;
                            //toastr.error(mes);
                            var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过SN码[' + data2.SNCode + "]" };
                            vm.MesList.splice(0, 0, Msg);
                        }
                        else {
                            GetSnCode();
                        }
                    })
                }
            });
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    //生成内部码
    function GetSnCode(isUpdate) {
        var enSn = angular.copy(vm.SelectedItemType);
        enSn.Company = "L";
        enSn.Action = vm.IsAuto ? "U" : "S";
        AjaxService.ExecPlan("BindCode", "SnCode", enSn).then(function (data3) {
            vm.NewBind.SNCode = data3.data[0].SNCode;
            if (vm.IsAuto) {
                SaveBindCode();
            }
        })
    }

    function BindCode() {
        var enSn = angular.copy(vm.SelectedItemType);
        enSn.Company = "L";
        enSn.Action = "U";
        AjaxService.ExecPlan("BindCode", "SnCode", enSn).then(function (data3) {
            vm.NewBind.SNCode = data3.data[0].SNCode;
            SaveBindCode();
        })
    }

    function SaveBindCode(){
        vm.promise = AjaxService.ExecPlan("BindCode", 'bindCode', vm.NewBind).then(function (data) {
            var mss = "生产条码 [" + vm.NewBind.InternalCode + ']  SN码 [' + vm.NewBind.SNCode + '] 绑定成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.NewBind = { Action: "I", CreateBy: $rootScope.User.UserNo, Customer: "U" };
            vm.Focus = 0;
        });
    }


    function ExportExcel() {
        var en = {};
        en.InternalCode = vm.Ser.InternalCode;
        en.SNCode = vm.Ser.SNCode;
        en.IDCode1 = vm.Ser.IDCode1;
        en.Customer = "U";
        vm.promise = AjaxService.GetPlanExcel("BindCode", 'BindExcel', en).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    function InsertItemType() {
        vm.promise = AjaxService.PlanInsert("MesItemType", vm.NewItemType).then(function (data) {
            toastr.success("新增成功");
            vm.NewItemType = {};
            GetItemTypeList();
        })
    }

    function GetItemTypeList() {
        AjaxService.GetPlans("MesItemType").then(function (data) {
            vm.ItemTypeList = data;
            
        })
    }

    function DeleteItemType(type) {
        MyPop.Confirm({ text: "确定要删除该类型吗" }, function () {
            AjaxService.PlanDelete("MesItemType", type).then(function (data) {
                toastr.success("删除成功");
                GetItemTypeList();
            })
        });
    }
}
]);