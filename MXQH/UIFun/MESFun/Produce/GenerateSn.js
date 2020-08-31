'use strict';

angular.module('app')
.controller('GenerateSnCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.NewBind = { Action: "I", Customer:"U" };
    vm.MesList = [];
    vm.Focus = { InCode: true, SnCode: false};
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.NewItemType = { IsPKGen: 1 };
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;
    vm.DeleteItemType = DeleteItemType;

    vm.InsertItemType = InsertItemType;

    //PageChange();
    GetItemTypeList();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            li
            st.push({ name: "InternalCode", value: vm.Ser.InternalCode });
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
            Action();
        }
    }

    function SelectTab(index) {
        //vm.Focus = index;
    }

    function Action() {
        vm.KeySn = undefined;
        vm.Batch = undefined;
        var en = { InternalCode: vm.NewBind.InternalCode };

        AjaxService.ExecPlan("BindCode", "checkIn", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: data.data[0].MsgText });
                AjaxService.PlayVoice('error.mp3');
                vm.NewBind.InternalCode = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.KeySn = data.InternalCode;
                vm.Batch = data.data1[0] && data.data1[0].Batch ? data.data1[0].Batch : "";
                if (vm.Batch == "" && vm.SelectedItemType.CharName == 'RT49') {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: "未设置销售单批次号, 无法生成SN码, 请联系业务部门设定批次号" });
                    vm.NewBind.InternalCode = undefined;
                    return;
                }
                GetSnCode();
            }
        })
    }

    //获取生成编码参数值
    function getGenCodePara() {

        enSn.IsPKGen == 1
    }

    //生成内部码 
    function GetSnCode() {
        var enSn = angular.copy(vm.SelectedItemType);
        if (enSn.IsPKGen == 0) {
            enSn.Company = "L";
            enSn.Action = vm.IsAuto ? "U" : "S";
            AjaxService.ExecPlan("BindCode", "SnCode", enSn).then(function (data3) {
                vm.NewBind.SNCode = data3.data[0].SNCode;
                if (vm.IsAuto) {
                    SaveBindCode();
                }
            })
        }
        //平台生成方式-预览
        else if (enSn.IsPKGen == 1 && !vm.IsAuto) {
            var en = { TbName: enSn.TbName, ClName: enSn.ClName, CharName: vm.Batch };
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                vm.NewBind.SNCode = data.data[0].SN;
            })
        }
            //平台生成方式-保存
        else if (enSn.IsPKGen == 1 && vm.IsAuto) {
            vm.NewBind.SNCode = "";
            var SNList = [{ name: enSn.TbName, col: enSn.ClName, parm: "SNCode", charName: vm.Batch }];
            vm.NewBind.SNColumns = JSON.stringify(SNList);
            SaveBindCode();
        }
    }

    function BindCode() {
        var enSn = angular.copy(vm.SelectedItemType);
        if (enSn.IsPKGen == 0) {
            enSn.Company = "L";
            enSn.Action = "U";
            AjaxService.ExecPlan("BindCode", "SnCode", enSn).then(function (data3) {
                vm.NewBind.SNCode = data3.data[0].SNCode;
                SaveBindCode();
            })
        }
        else if (enSn.IsPKGen == 1) {
            vm.NewBind.SNCode = "";
            var SNList = [{ name: enSn.TbName, col: enSn.ClName, parm: "SNCode", charName: vm.Batch }];
            vm.NewBind.SNColumns = JSON.stringify(SNList);
            SaveBindCode();
        }
    }

    function SaveBindCode(){
        vm.promise = AjaxService.ExecPlan("BindCode", 'bindCode', vm.NewBind).then(function (data) {
            var mss = "内控码[" + vm.NewBind.InternalCode + ']  SN码 [' + data.data[0].SNCode + '] 绑定成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.NewBind = { Action: "I", Customer: "U" };
            vm.Focus = { InCode: true, SnCode: false };
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
        vm.NewItemType.TbName = vm.NewItemType.PkSet ? vm.NewItemType.PkSet.TbName : "";
        vm.NewItemType.ClName = vm.NewItemType.PkSet ? vm.NewItemType.PkSet.ClName : "";
        vm.NewItemType.IsPKGen = parseInt(vm.NewItemType.IsPKGen);
        //console.log(vm.NewItemType)
        vm.promise = AjaxService.PlanInsert("MesItemType", vm.NewItemType).then(function (data) {
            toastr.success("新增成功");
            vm.NewItemType = { IsPKGen: 1 };
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