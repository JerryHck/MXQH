'use strict';

angular.module('app')
.controller('PackageOnLineCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.Item = {};
    vm.MesList = [];
    vm.Focus = { Order: true, InCode: false, SN: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;
    vm.PrintType = 'G';

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.InCodeToDb = InCodeToDb;
    vm.NgSave = NgSave;
    vm.SelectTab = SelectTab;
    vm.CheckBindSn = CheckBindSn;

    vm.KeyDonwPrint = KeyDonwPrint;
    vm.KeyDonwLightPrint = KeyDonwLightPrint;

    //获取包装信息-未完工的资料
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" },
        { name: "WorkOrder", value: "AMO%", type: "not like", action: "and" }
        , { name: "WorkOrder", value: "HMO%", type: "not like", action: "and" }
    ]).then(function (data) {
            vm.OrderList = data;
            for (var i = 0, len = vm.OrderList.length; i < len; i++) {
                vm.OrderList[i].FirstChar = vm.OrderList[i].WorkOrder.substring(0, 1);
            }
    })

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.InCode) {
            vm.InCodeSave = angular.copy(vm.Item.InCode);
            vm.Item.InCode = undefined;
            InCodeToDb();
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            var en = {};
            en.WorkOrder = vm.Item.WorkOrder;
            AjaxService.ExecPlan("MesMxWOrder", "orderPK", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                vm.OrderData = undefined;
                if (!data.data[0] || !data.data[0].WorkOrder) {
                    vm.Item.WorkOrder = undefined;
                    showError(mss + '  不存在或已完工');
                }
                else {
                    vm.OrderData = data.data[0];
                    vm.RoutingList = data.data1;
                    vm.RoutingData = data.data1[0];
                    CheckBindSn();
                    vm.OrderCount = data.data2[0];
                    vm.Focus = { Order: false, InCode: true, SN: false };
                }
            });
        }
    }

    //验证包装是否有规则信息
    function CheckBindSn() {
        if (vm.RoutingData.boProcedureID != 601) return;
        else if (vm.OrderData.TbName == "" || vm.OrderData.TbName == undefined || vm.OrderData.TbName == null
                || vm.OrderData.ClName == "" || vm.OrderData.ClName == undefined || vm.OrderData.ClName == null) {
            var mss = '工单 【' + vm.Item.WorkOrder + '】工艺【' + vm.RoutingData.RouteName + '】首工序【' + vm.RoutingData.ProcedureName + '】'
                + '需生成SN，而SN生成编码规则未设定，请联系管理员设定';
            showError(mss);
            vm.RoutingData = undefined;
        }
        else if (vm.OrderData.TbName == "MesSnCode" && (vm.OrderData.ClName == "RT49" || vm.OrderData.ClName == "RT649" || vm.OrderData.ClName == "RT49P") &&
            (vm.OrderData.CharName == null || vm.OrderData.CharName == "")) {
            var mss = '工单 【' + vm.Item.WorkOrder + '】未设置销售单【' + vm.OrderData.ERPSO + '】批次号'
                + ',请联系业务部门设定批次号';
            showError(mss);
            vm.RoutingData = undefined;
        }
    }

    function InCodeToDb() {
        var IsOk = true;
        if (!vm.OrderData || !vm.RoutingData) {
            showError('不存在或已完工');
            return false;
        }
        //if (vm.OrderData.MaxOverCount - vm.OrderCount.ToTalCount <= 0) {
        //    showError('工单投入量已达U9开工量最大允许值，不可再投入');
        //    vm.Item.InCode = undefined;
        //    return false;
        //}
        if (vm.OrderData.Quantity - vm.OrderCount.ToTalCount == 0) {
            AjaxService.PlayVoice('error.mp3');
            MyPop.ngConfirm({ text: "投入数量已达到U9开工量, 是否继续投入?" }).then(function (data) {
                if (vm.IsAuto) {
                    Save();
                }
            });
        }
        else if (vm.IsAuto) {
            Save();
        }
    }

    function showError(mes)
    {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mes });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(mes);
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function Save() {
        var en = {};
        en.WorkOrder = vm.Item.WorkOrder;
        en.InternalCode = vm.InCodeSave;
        en.RoutingId = vm.RoutingData.ID;

        var dataCheck = AjaxService.ExecPlanWait("MESPlanMainPK", "check", en);
        if (dataCheck.data[0].MsgType == 'Success') {
            var enSave = dataCheck.data1[0];
            enSave.SNCode = "";
            enSave.IMEICode = "";
            if (vm.RoutingData.boProcedureID == 601) {
                var SNList = [{ name: vm.OrderData.TbName, col: vm.OrderData.ClName, parm: "SNCode", charName: vm.OrderData.CharName }];
                if (vm.OrderData.IMEI_TbName && vm.OrderData.IMEI_TbName) {
                    SNList.push({ name: vm.OrderData.IMEI_TbName, col: vm.OrderData.IMEI_ClName, parm: "IMEICode" });
                }
                enSave.SNColumns = JSON.stringify(SNList);
            }
            //console.log(enSave);
            //同步执行方式
            var data = AjaxService.ExecPlanWait("MesMxWOrder", "savePK", enSave);
            //vm.promise = AjaxService.ExecPlan("MesMxWOrder", "savePK", en).then(function (data) {
            if (data.data[0].MsgType == 'Success') {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].Msg });
                vm.OrderCount = data.data1[0];
                AjaxService.PlayVoice('success.mp3');
                //打印
                if (vm.RoutingData.boProcedureID == 601) {
                    //获取打印数据
                    var en2 = { SNCode: data.data1[0].SNCode };
                    AjaxService.ExecPlan("MESSNCode", "printsn", en2).then(function (data2) {
                        //一般打印
                        if (vm.PrintType == 'G') {
                            PrintCode(data2.data1[0], data2.data[0]);
                        }
                            //镭雕打印
                        else if (vm.PrintType == 'L') {
                            LightPrintCode(data2.data1[0], data2.data[0]);
                        }
                    })
                }
                vm.InCodeSave = undefined;

            }
            else if (data.data[0].MsgType == 'Error') {
                showError(data.data[0].Msg);
                vm.InCodeSave = undefined;
            }
        }
        else if (dataCheck.data[0].MsgType == 'Error') {
            showError(dataCheck.data[0].Msg);
            vm.InCodeSave = undefined;
        }
        //})
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
        if (keycode == 13 && vm.PrintItem.LtInternalCode) {
            //获取打印数据
            var en = { SNCode: vm.PrintItem.LtInternalCode };
            AjaxService.ExecPlan("MESSNCode", "printsn", en).then(function (data) {
                LightPrintCode(data.data1[0], data.data[0]);
                vm.PrintItem.LtInternalCode = undefined;
            })
        }
    }

    //一般打印
    function PrintCode(teData, data) {
        //console.log(data)
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
            //console.log(data);
        }, function (err) {
            //console.log(err);
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
        //console.log(postData.ParaData);
        AjaxService.LightPrint(teData.TemplateId, teData.TemplateTime, postData).then(function (data) {
            //console.log(data);
        }, function (err) {
            //console.log(err);
        })
    }

    //不良
    function NgSave() {

    }
}
]);