﻿'use strict';

angular.module('app')
.controller('AssMOPackageCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', '$window', '$state', 'FileUrl', 'MyPop',
function ($rootScope, $scope, AjaxService, toastr, $window, $state, FileUrl, MyPop) {

    var vm = this;
    //vm.currentRouterName = angular.copy($state.current.name);
    vm.page = { index: 1, size: 10 };
    vm.PrintType = 'G';
    vm.PackPrintType = 'G';

    vm.Ser = {};
    vm.Item = { PackId : -1};
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    vm.Print = Print;
    vm.SelectTab = SelectTab;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.ChangePack = ChangePack;
    vm.Done = Done;
    vm.RePrint = RePrint;

    vm.CheckLock = CheckLock;

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.KeyDonwColorRePrint = KeyDonwColorRePrint;
    vm.KeyDonwPackSn = KeyDonwPackSn;
    vm.KeyDonwBSNCode = KeyDonwBSNCode;

    vm.GetWeight = GetWeight;

    vm.PrintPackId = 1;
    vm.NumIndex = 0;
    vm.MesList = [];
    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }


    AjaxService.GetLocalPrinters().then(function (data) {
        vm.PrintList = data;
        vm.PrinterName = data[0];
    }, function (err) {
    });

    function PageChange() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        vm.promise = AjaxService.GetPlansPage("MESAssBSNWeight", list, vm.page.index, vm.page.size).then(function (data) {
            vm.WeightList = data.List;
            vm.page.total = data.Count;
        });
    }

    function ExportExcel() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("MESAssBSNWeight", list).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    //离开此页面的时候
    $rootScope.$on('$stateChangeStart', function () {
        if (vm.currentRouterName == $state.current.name) {
            console.log('do something')
        }
    });


    function CheckLock() {
        if (!vm.Item.PackNum && vm.Item.IsLock) {
            toastr.error('请先填写包装数量');
            vm.Item.IsLock = false;
            return;
        }
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            GetOrderData();
        }
    }

    function GetOrderData() {
        vm.promise = AjaxService.GetPlan("MesMxWOrder", { name: "WorkOrder", value: vm.Item.WorkOrder }).then(function (data) {
            vm.OrderData = data;
            if (data.Mate && data.Mate.IsAssWeigh == true) {
                GetCom();
            }
        })
        vm.promise = AjaxService.GetPlan("MESMateTemplate", [{ name: "WorkOrder", value: vm.Item.WorkOrder }, { name: "TypeID", value: 3 }]).then(function (data) {
            vm.BarData = data;
            if (!data.Template || !data.Template.Name) {
                vm.PrintType = 'N';
            }
        })

        GetNoPack();
    }

    function GetCom() {
        //获取kom口信息
        AjaxService.GetComPortList().then(function (data) {
            vm.ComList = JSON.parse(data);
            vm.ComName = vm.ComList[0];
            GetWeight();
        })
    }

    function GetWeight() {
        if (vm.ComName) {
            AjaxService.GetComWeight(vm.ComName, function (data) {
                if (data.MesType == "Success") {
                    $scope.$apply(function () {
                        vm.Item.Weight = data.Data;
                    });
                }
            });
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
        if (index == 1) {
           
        }
    }

    function ChangePack() {
        if (vm.SelectPack) {
            vm.Item.PackId = vm.SelectPack.ID;
            vm.Item.PackNum = vm.SelectPack.PackNum;
        }
        //获取包装SN列表
        AjaxService.GetPlans("opAssPackageDtl", [{ name: "PackID", value: vm.Item.PackId }]).then(function (data) {
            vm.SNList = data;
            console.log(data)
            vm.NumIndex = data.length % vm.NoticeNum;
            vm.NumIndex = vm.NumIndex || 0;
        });
    }

    function GetNoPack() {
        vm.promise = AjaxService.GetPlans("opAssNoPackage", [{ name: "State", value: 0 }, { name: "WorkOrder", value: vm.Item.WorkOrder }]).then(function (data) {
            vm.NotPackList = data;
        })
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            PackInCode();
        }
    }

    function PackInCode() {
        var en = { InternalCode: vm.Item.BSN, WorkOrder: vm.Item.WorkOrder, IsLock: vm.Item.IsLock, IsColorPrint: vm.PrintType == 'G' || vm.PrintType == 'L', Weight: vm.Item.Weight };
        AjaxService.ExecPlan("opAssPackageMain", "check", en, false).then(function (data) {
            vm.Item.BSN = undefined;
            vm.NotPackList = data.data2;
            if (!vm.Item.IsLock) {
                //vm.OrderData = data.data3[0];
                vm.Item.WorkOrder = (data.data3[0] || {}).WorkOrder;
                GetOrderData();
                vm.CalData = data.data4[0];
            }

            if (data.data[0].MsgType == "Error") {
                showMsg(data.data[0].MsgText, false);
            }
            //取工单信息时
            else if (data.data[0].MsgType == "Success" && !vm.Item.IsLock) {
                if (vm.NotPackList.length > 0) {
                    vm.SelectPack = vm.NotPackList[0];
                    //获取包装列表信息
                    ChangePack();
                }
            }
            //包装工艺
            else if (data.data[0].MsgType == "Success" && vm.Item.IsLock) {
                var en = {};
                en.InCode = data.data1[0].InCode;
                en.SnCode = data.data1[0].SnCode;
                en.PrintColor = data.data1[0].PrintColor;
                vm.StaticBSN = en.InCode;
                PackSave(en);
            }
        })
    }

    //获取过站信息
    function ChangePro() {
        var en = {};
        en.WorkOrderId = vm.OrderData.ID;
        en.RouteId = vm.OrderData.RouteId;
        en.ProcedureID = vm.OrderData.boProcedureID;
        AjaxService.ExecPlan("MesMxWOrder", "sum", en, false).then(function (data) {
            vm.CalData = data.data[0];
        });
    }

    //包装储存
    function PackSave(en) {

        if (!vm.Item.PackNum) {
            showMsg("请先填写包装数量");
            return;
        }

        en.PackId = vm.Item.PackId;
        en.WorkOrder = vm.Item.WorkOrder;
        en.PackNum = vm.Item.PackNum;
        en.Remark = vm.Item.Remark;
        en.IsLock = true;
        en.Weight = vm.Item.Weight;
        AjaxService.ExecPlan("opAssPackageMain", 'save', en).then(function (data) {
            var msg = data.data[0];
            if (msg.MsgType == 'success') {
                //toastr.error(mes);
                showMsg(msg.Msg, true);
                var parkid = data.data1[0].PackId;
                vm.Item.PackId = parkid;
                vm.PrintPackId = data.data1[0].OriPackId;
                //打印彩盒码
                if (en.PrintColor) {
                    PrintColor(en.SnCode);
                }

                //判断打印,包装完成需要打印
                if (parkid == -1) {
                    MyPop.ngConfirm({ text: "包装箱已经完成，是否要打印标签" }).then(function () {
                        //打印
                        if (vm.PackPrintType == 'G') { Print(vm.PrintPackId); }
                    })
                    GetNoPack();
                    vm.NumIndex = 0;
                    vm.SelectPack = undefined;
                }
                else {
                    vm.NumIndex++
                    if (vm.NumIndex == 50) {
                        AjaxService.PlayVoice('success.mp3');
                        MyPop.ngConfirm({ text: "已经扫描了" + vm.NumIndex + "个" });
                        vm.NumIndex = 0;
                    }
                }
                ChangePack();
                ChangePro();
                //vm.Item.PackId = angular.copy(data.data2[0].PackId);
            }
            else {
                showMsg(msg.Msg, false);
            }
        });
    }

    function PrintColor(sn){
        //获取彩盒打印数据
        var en2 = { SNCode: sn, TypeId: 3 };
        AjaxService.ExecPlan("MESSNCode", 'colorPrint', en2).then(function (data) {
            //一般打印
            if (vm.PrintType == 'G') {
                PrintCode(data.data1[0], data.data[0]);
            }
                //镭雕打印
            else if (vm.PrintType == 'L') {
                LightPrintCode(data.data1[0], data.data0[0]);
            }
        })
    }

    function KeyDonwPackSn(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.WorkOrder) {
           vm.promise = AjaxService.GetPlans("opAssNoPackage", [{ name: "State", value: 1 }, { name: "WorkOrder", value: vm.PrintItem.WorkOrder }]).then(function (data) {              
               vm.PackList = data;
            })
        }
    }

    function KeyDonwBSNCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.BSNCode) {
            var list=[
                { name: "InternalCode", value: vm.PrintItem.BSNCode },
                { name: "SNCode", value: vm.PrintItem.BSNCode, action: 'OR' }];
            vm.promise = AjaxService.GetPlan("MESPackData", list).then(function (data) {
                if (data.Main.State == 0) {
                    toastr.error('箱号[' + data.Main.WorkOrder + '-' + data.Main.PackNo + ']还没有完成包装');
                    vm.PrintItem.BSNCode = undefined;
                } else {
                    vm.PrintItem.WorkOrder = data.Main.WorkOrder;
                    vm.PrintForm.PackID = data.Main.ID;
                    vm.promise = AjaxService.GetPlans("opAssNoPackage", [{ name: "State", value: 1 }, { name: "WorkOrder", value: vm.PrintItem.WorkOrder }]).then(function (data) {
                        vm.PackList = data;
                    })
                }
            })
        }
    }

    //内部码验证
    function KeyDonwColorRePrint(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.ColorSnCode) {
            var en = {};
            en.Code = vm.ColorSnCode;
            en.Action = vm.IsReprint;
            CheckPrint(en);
        }
    }

    function CheckPrint(en) {
        if (en.Code.length == 9) {
            vm.ColorSnCode = undefined;
            return;
        }
        AjaxService.ExecPlan("MESSNCode", 'snprint', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
                AjaxService.PlayVoice('error.mp3');
            }
            else if (data.data[0].MsgType == "Success") {
                AjaxService.PlayVoice('success.mp3');
                toastr.success(data.data[0].MsgText);
                //PrintCode(data.data2[0], data.data1[0]);
                //一般打印
                if (vm.PrintType == 'G') {
                    PrintCode(data.data2[0], data.data1[0]);
                }
                    //镭雕打印
                else if (vm.PrintType == 'L') {
                    LightPrintCode(data.data2[0], data.data1[0]);
                }
            }
            vm.ColorSnCode = undefined;
        });
    }


    function RePrint() {
        Print(vm.PrintForm.PackID);
    }

    function Done() {
        if (vm.Item.PackId != -1 && vm.SNList && vm.SNList.length > 0) {
            var en = {};
            en.ID = vm.Item.PackId;
            en.ModifyBy = $rootScope.User.UserNo;
            en.ModifyDate = new Date();
            en.State = 1;
            en.PackNum = vm.SNList.length;
            vm.promise = AjaxService.PlanUpdate("opAssPackageMain", en).then(function(data){
                //打印
                vm.PrintPackId = angular.copy(vm.Item.PackId);
                //打印
                if (vm.PackPrintType == 'G') { Print(vm.PrintPackId); }
                vm.Item.PackId = -1;
                vm.NumIndex = 0;
                vm.SelectPack = undefined;
                vm.SNList = [];
                toastr.success("包装成功");
            })
        }
    }

    //组装包装打印
    function Print(id) {
        var en = {};
        en.PackDetailID = id;
        en.TypeCode = "ZZPCODE";
        AjaxService.ExecPlan("MESPackChi", "assPrint", en).then(function (data) {
            if (data.data3[0].MsgType == "Error") {
                MyPop.Show(true, data.data3[0].MsgText);
            }
            else if (data.data3[0].MsgType == "Success") {
                var postData = {}, list = [];
                postData.ParaData = JSON.stringify(data.data[0]);

                for (var i = 0, len = vm.PrintSnNum || data.data2.length; i < len; i++) {
                    list.push(data.data2[i].SNCode);
                }
                postData.OutList = list;
                var temp = data.data1[0];
                AjaxService.Print(temp.TemplateId, temp.TS, postData, vm.PrintName).then(function (data2) {
                    console.log(data2);
                }, function (err) {
                    console.log(err);
                })
            }
        })
    }

    function PrintCode(temData, data) {
        var postData = {}, list = [];
        list.push(data.SnCode);
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        var printNum = data.ColorBoxPrintNum || 1;
        for (var i = 0; i < printNum; i++) {
            AjaxService.Print(temData.TemplateId, temData.TemplateTime, postData, vm.PrinterName).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        }
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

    function showMsg(msg, type) {
        if (type) {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg });
            AjaxService.PlayVoice('success.mp3');
        }
        else {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
            AjaxService.PlayVoice('error.mp3');
            toastr.error(msg);
        }
    }
}
]);