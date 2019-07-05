'use strict';

angular.module('app')
.controller('InCodeBindSNCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($scope, $http, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.NewBind = { Action: "I", Customer:"U" };
    vm.MesList = [];
    vm.Focus = { InCode: true, SnCode: false};
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.NewItemType = { IsPKGen: 1 };
    vm.IsAuto = true;
    vm.PrintType = 'N';

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;

    //PageChange();
    //未完工工单
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.OrderData = undefined;
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            AjaxService.ExecPlan("BindCode", "getOrder", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.data[0] || !data.data[0].WorkOrder) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  不存在或已完工');
                }
                else if (data.data[0].TbName == "" || data.data[0].TbName == undefined || data.data[0].TbName == null
                    || data.data[0].ClName == "" || data.data[0].ClName == undefined || data.data[0].ClName == null ) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  工单未设定SN生成编码规则，请联系管理员设定');
                    console.log(data.data[0])
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.OrderCount = data.data1[0];
                }
            });
        }
    }

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function showError(mes) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('3331142.mp3');
        toastr.error(mes);
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MesInCodeBindSnCode", GetContition(), vm.page.index, vm.page.size).then(function (data) {
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
        if (!vm.OrderData){
            showError('请先选择工单');
            return;
        }

        vm.KeySn = undefined;
        vm.CharName = undefined;
        var en = { InternalCode: vm.NewBind.InternalCode, WorkOrder: vm.OrderData.WorkOrder, TbName: vm.OrderData.TbName, ClName: vm.OrderData.ClName };
        AjaxService.ExecPlan("BindCode", "checkSn", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].MsgText);
                vm.NewBind.InternalCode = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.KeySn = data.InternalCode;
                vm.CharName = data.data1[0] && data.data1[0].CharName ? data.data1[0].CharName : "";
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
        //平台生成方式-预览
        if (!vm.IsAuto) {
            var en = { TbName: vm.OrderData.TbName, ClName: vm.OrderData.ClName, CharName: vm.CharName };
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                vm.NewBind.SNCode = data.data[0].SN;
            })
        }
        else{
            vm.NewBind.SNCode = "";
            var SNList = [{ name: vm.OrderData.TbName, col: vm.OrderData.ClName, parm: "SNCode", charName: vm.CharName }];
            vm.NewBind.SNColumns = JSON.stringify(SNList);
            SaveBindCode();
        }
    }

    function BindCode() {
        vm.NewBind.SNCode = "";
        var SNList = [{ name: vm.OrderData.TbName, col: vm.OrderData.ClName, parm: "SNCode", charName: vm.Batch }];
        vm.NewBind.SNColumns = JSON.stringify(SNList);
        SaveBindCode();
    }

    function SaveBindCode() {
        vm.NewBind.MOId = vm.OrderData.ID;
        vm.promise = AjaxService.ExecPlan("BindCode", 'saveBind', vm.NewBind).then(function (data) {
            console.log(data);
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].MsgText);
                vm.NewBind = {};
            }
            else if (data.data[0].MsgType == "Success") {
                var mss = "内控码[" + vm.NewBind.InternalCode + ']  SN码 [' + data.data1[0].SNCode + '] 绑定成功';
                var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
                vm.MesList.splice(0, 0, Msg);
                vm.NewBind = {};
                vm.OrderCount = data.data2[0];
                //一般打印
                if (vm.PrintType == 'G') {
                    PrintCode(data.data1[0])
                }
                //镭雕打印
                else if (vm.PrintType == 'L') {

                }
            }

        });
    }

    //一般打印
    function PrintCode(data) {
        if (!vm.OrderData.TemplateId || vm.OrderData.TemplateId == null) {
            toastr.error("打印模版获取失败");
            return;
        }
        var postData = {}, list = [];
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        AjaxService.Print(vm.OrderData.TemplateId, vm.OrderData.TemplateTime, postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("MesInCodeBindSnCode", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
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
        return list;
    }
}
]);