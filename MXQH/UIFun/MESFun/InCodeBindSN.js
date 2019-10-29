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
    vm.PrintType = 'G';
    vm.isFinist = true;

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwPrint = KeyDonwPrint;
    vm.KeyDonwLightPrint = KeyDonwLightPrint;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    //PageChange();
    //未完工工单
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    //所有工单
    AjaxService.GetPlans("MesMxWOrder", []).then(function (data) {
        vm.AllOrderList = data;
    })

    //工单确认
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
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.OrderCount = data.data1[0];
                    $("input.SnFocus").focus();
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
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function PageChange() {
        var en = angular.copy(vm.Ser);
        en.IsExcel = 'N';
        en.Start = (vm.page.index - 1) * vm.page.size + 1;
        en.End = vm.page.index * vm.page.size;
        vm.promise = AjaxService.ExecPlan("MesInCodeBindSnCode", "getSn", en).then(function (data) {
            vm.BindList = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.InternalCode) {
            vm.KeyInCode = angular.copy(vm.NewBind.InternalCode);
            if (vm.isFinist) {
                vm.isFinist = false;
                Action();
            }
        }
    }
    
    //补打印
    function KeyDonwPrint(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.InternalCode) {
            //获取打印数据
            var en = { SNCode: vm.PrintItem.InternalCode };
            AjaxService.ExecPlan("MESSNCode", "printsn", en).then(function (data) {
                PrintCode(data.data1[0], data.data[0]);
                vm.PrintItem.InternalCode = undefined;
            })
        }
    }

    //镭雕补打印 
    function KeyDonwLightPrint(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.InternalCode) {
            //获取打印数据
            var en = { SNCode: vm.PrintItem.InternalCode };
            AjaxService.ExecPlan("MESSNCode", "printsn", en).then(function (data) {
                LightPrintCode(data.data1[0], data.data[0]);
                vm.PrintItem.InternalCode = undefined;
            })
        }
    }

    function Action() {
        if (!vm.OrderData) {
            vm.isFinist = true;
            showError('请先选择工单');
            return;
        }
        vm.KeySn = undefined;
        vm.CharName = undefined;
        var en = { InternalCode: vm.KeyInCode, WorkOrder: vm.OrderData.WorkOrder, TbName: vm.OrderData.TbName, ClName: vm.OrderData.ClName };
        AjaxService.ExecPlan("BindCode", "checkSn", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].MsgText);
                vm.NewBind.InternalCode = undefined;
                vm.isFinist = true;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.CharName = data.data1[0] && data.data1[0].CharName ? data.data1[0].CharName : "";
                GetSnCode(data.data1[0].InternalCode);
                vm.NewBind.InternalCode = undefined;
            }
        }, function (data) {
            vm.isFinist = true;
        })
    }

    //生成内部码 
    function GetSnCode(inCode) {
        //平台生成方式-预览
        if (!vm.IsAuto) {
            var en = { TbName: vm.OrderData.TbName, ClName: vm.OrderData.ClName, CharName: vm.CharName };
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                vm.NewBind.SNCode = data.data[0].SN;
            }, function (data) {
                vm.isFinist = true;
            })
        }
        else{
            SaveBindCode(inCode);
        }
    }

    function BindCode() {
        SaveBindCode(vm.NewBind.InternalCode);
    }

    function SaveBindCode(KeyInCode) {
        vm.ThisBind = {};
        vm.ThisBind.MOId = vm.OrderData.ID;
        vm.ThisBind.SNCode = "";
        vm.ThisBind.InternalCode = KeyInCode;
        var SNList = [{ name: vm.OrderData.TbName, col: vm.OrderData.ClName, parm: "SNCode", charName: vm.CharName }];
        vm.ThisBind.SNColumns = JSON.stringify(SNList);
        vm.promise = AjaxService.ExecPlan("BindCode", 'saveBind', vm.ThisBind).then(function (data) {
            vm.isFinist = true;
            if (data.data[0].MsgType == "Error") {
                showError(data.data[0].MsgText);
                vm.NewBind = {};
            }
            else if (data.data[0].MsgType == "Success") {
                var mss = "内控码[" + KeyInCode + ']  SN码 [' + data.data1[0].SNCode + '] 绑定成功';
                var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
                vm.MesList.splice(0, 0, Msg);
                vm.NewBind = {};
                vm.OrderCount = data.data3[0];
                AjaxService.PlayVoice('success.mp3');
                //一般打印
                if (vm.PrintType == 'G') {
                    PrintCode(data.data2[0], data.data1[0]);
                }
                //镭雕打印
                else if (vm.PrintType == 'L') {
                    LightPrintCode(teData, data);
                }
            }

        }, function (data) {
            vm.isFinist = true;
        });
    }

    //一般打印
    function PrintCode(teData, data) {
        console.log(data)
        if (!data || !data.SNCode || data.SNCode == null) {
            toastr.error("SN不存在或还未生成");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        if (!teData || !teData.TemplateId || teData.TemplateId == null) {
            toastr.error("打印模版获取失败");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        var postData = {}, list = [];
        list.push(data.SNCode)
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        AjaxService.Print(teData.TemplateId, teData.TemplateTime, postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    //镭雕
    function LightPrintCode(teData, data) {
        if (!data || !data.SNCode || data.SNCode == null) {
            toastr.error("SN不存在或还未生成");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        if (!teData || !teData.TemplateId || teData.TemplateId == null) {
            toastr.error("打印模版获取失败");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        var postData = {}, list = [];
        list.push(data.SNCode)
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        AjaxService.LightPrint(teData.TemplateId, teData.TemplateTime, postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function ExportExcel() {
        vm.Ser.IsExcel = 'Y';
        vm.promise = AjaxService.GetPlanExcel("MesInCodeBindSnCode", "getSn", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }
}
]);