'use strict';

angular.module('app')
.controller('PackageActMainCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window', 'FileUrl',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window, FileUrl) {

    var vm = this;
    vm.Item = { };
    vm.MesList = [];
    vm.Focus = { SN: true };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsPrint = true;
    vm.PrintType = 'COTTONCODE';
    vm.PrintNum = 1;

    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.PackSave = PackSave;
    vm.SelectTab = SelectTab;
    vm.ChangeBoxNum = ChangeBoxNum;
    vm.NewPaletCode = NewPaletCode;
    vm.DeleteSn = DeleteSn;
    vm.Print = Print;
    vm.PrintOSLabel = PrintOSLabel;
    vm.KeyDonwOSLabelPrint = KeyDonwOSLabelPrint;
    vm.KeyDonwRePrint = KeyDonwRePrint;
    vm.ClearSPPack = ClearSPPack;
    vm.SaveSPPack = SaveSPPack;
    vm.ReplaceBr = ReplaceBr;

    //获取包装信息-未完工大成品工单
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }
        , { name: "WorkOrder", value: "AMO%", type: "not like", action: "and" }
        , { name: "WorkOrder", value: "HMO%", type: "not like", action: "and" }
        , { name: "IsMainPro", value: "1", type: "=", action: "and" }
    ]).then(function (data) {
        vm.OrderList = data;
        for (var i = 0, len = vm.OrderList.length; i < len; i++) {
            vm.OrderList[i].FirstChar = vm.OrderList[i].WorkOrder.substring(0, 1);
        }
    })

    //内部码验证
    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        vm.SNList = vm.SNList || [];
        if (keycode == 13 && vm.Item.SNCode) {
            vm.ThisSnCode = vm.Item.SNCode;
            if (vm.PackDetail.PackCount == vm.PackDetail.ProductCount) {
                MyPop.Confirm({ text: "包装箱已经包满， 请结束包箱" }, function () { });
                vm.Item.SNCode = undefined;
                return;
            }
            
            for (var i = 0, len = vm.MinPackList.length; i < len; i++) {
                if (vm.Item.SNCode == vm.MinPackList[i].SNCode || vm.Item.SNCode == vm.MinPackList[i].InternalCode) {
                    showErr('SN[' + vm.Item.SNCode + ']已经扫描');
                    vm.Item.SNCode = undefined;
                    return;
                }
            }

            var en = {};
            en.Sn = vm.Item.SNCode;
            en.PackDetailID = vm.PackDetail.ID;
            //console.log(en)
            AjaxService.ExecPlan("MESPackageDtl", 'checkSup', en).then(function (data) {
                if (data.data[0].MsgType == "Error") {
                    showErr(data.data[0].MsgText);
                }
                else if (data.data[0].MsgType == "Success") {
                    vm.MinPackList = vm.MinPackList || [];
                    var h = false;
                    for (var i = 0, len = vm.MinPackList.length; i < len; i++) {
                        if (vm.MinPackList[i].Code == data.data1[0].Code && !vm.MinPackList[i].SNCode) {
                            vm.MinPackList[i].SNCode = data.data1[0].SNCode;
                            vm.MinPackList[i].InternalCode = data.data1[0].InternalCode;
                            //匹配到值
                            h = true;
                            break;
                        }
                    }
                    if (!h) {
                        showErr(data.data[0].MsgText + ", 但bom不比例不符合，无法添加进此小包");
                    }
                    else {
                        //值满
                        var full = true;
                        for (var j = 0, len2 = vm.MinPackList.length; j < len2; j++) {
                            if (!vm.MinPackList[j].SNCode) {
                                full = false;
                                break;
                            }
                        }
                        //小包已满
                        if (full) {
                            SPackAction();
                        }
                        else {
                            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                            AjaxService.PlayVoice('success.mp3');
                        }
                    }
                }
                vm.Item.SNCode = undefined;
            });
        }
    }

    //清空小包装
    function ClearSPPack() {
        for (var i = 0, len = vm.MinPackList.length; i < len; i++) {
            vm.MinPackList[i].SNCode = null;
            vm.MinPackList[i].InternalCode = null;
        }
    }

    //完成小包装
    function SaveSPPack() {
        var full = true;
        for (var j = 0, len2 = vm.MinPackList.length; j < len2; j++) {
            if (!vm.MinPackList[j].SNCode) {
                full = false;
                break;
            }
        }
        if (!full) {
            showErr("小包装还未扫码完成");
        }
        //小包已满
         else if (full) {
            SPackAction();
        }
    }

    //小包装动作
    function SPackAction() {
        var en = {}
        en.PackDetailID = vm.PackDetail.ID;
        vm.promise = AjaxService.ExecPlan("MESPackDtl", 'checkSP', en).then(function (data2) {
            if (data2.data[0].MsgType == "Error") {
                showErr(data2.data[0].MsgText);
            }
            else if (data2.data[0].MsgType == "Success") {
                en.SNCode = "";
                //en.RouteID = data2.data1[0].RouteID;
                en.SPList = JSON.stringify(vm.MinPackList);
                var SNList = [{ name: "MESPackComp", col: "SNCoce", parm: "SNCode", charName: vm.CharName }];
                en.SNColumns = JSON.stringify(SNList);
                en.TempColumns = "SPList";
                vm.promise = AjaxService.ExecPlan("MESPackDtl", 'saveSP', en).then(function (data) {
                    if (data.data[0].MsgType == "Error") {
                        showErr(data.data[0].MsgText);
                    }
                    else if (data.data[0].MsgType == "Success") {
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                        vm.MinPackList = angular.copy(vm.MinPackLst);
                        ChangeBoxNum(vm.Item.BoxNumber);
                    }
                });
            }
        });
    }

    //生成新卡板号
    function NewPaletCode() {
        var en = {};
        en.ID = vm.PackDetail.ID;
        en.PalletCode = "";
        var SNList = [{ name: "MesPackage", col: "PalletCode", parm: "PalletCode" }];
        en.SNColumns = JSON.stringify(SNList);
        AjaxService.PlanUpdate("MESPackageDtl", en).then(function (data) {
            ChangeBoxNum(vm.Item.BoxNumber);
            $("input.SnFocus").focus();
        })
    }

    function DeleteSn() {
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        vm.promise = AjaxService.ExecPlan("MESPackChi", "deleteSN", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                MyPop.Show(true, data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success('SN清空成功');
                ChangeBoxNum(vm.Item.BoxNumber);
            }
        })
    }

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorkOrder";
            en.value = vm.Item.WorkOrder;
            AjaxService.GetPlan("MESPackageMain", en).then(function (data) {
                vm.ItemData = data;
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.ID) {
                    vm.Item.WorkOrder = undefined;
                    showErr(mss + '  不存在或未进行包装登记');
                }
                else if (!data.Order.Mate.IsMainPro) {
                    vm.Item.WorkOrder = undefined;
                    showErr(mss + '  不是大成品包装工单，不能在此作业');
                }
                else {
                    AjaxService.ExecPlan("MESPackageMain", "getMoMin", vm.Item).then(function (data2) {
                        if (!data2.data || data2.data.length == 0) {
                            vm.Item.WorkOrder = undefined;
                            showErr(mss + '  下阶料品获取失败，不能使用');
                        }
                        else {
                            vm.MinPackList = data2.data;
                            vm.MinPackLst = angular.copy(data2.data);
                            vm.PackMain = data;
                            vm.Item.SNCode = undefined;
                            vm.PackDetail = undefined;
                            vm.Item.BoxNumber = undefined;
                            getBoxList();
                            $("input.SnFocus").focus();
                        }
                    })
                }
            });
            AjaxService.GetPlan("BlMOPackOSLabel", en).then(function (data) {
                vm.OSLabelData = data;
            })
        }
    }

    function getBoxList() {
        AjaxService.GetPlans("MESPackDtl", { name: "PackMainID", value: vm.PackMain.ID }).then(function (data2) {
            vm.BoxList = data2;
            ChangeBoxNum(vm.Item.BoxNumber + 1);
            setTimeout(function () {  
                $("#sc").scrollTop(vm.ScTop);
            }, 1000);
        });
        
    }

    function ChangeBoxNum(boxNum) {
        if (!boxNum) return;
        vm.Item.BoxNumber = boxNum;
        vm.ScTop = $("#sc")[0].scrollTop + $("#sc a:first").height() + 18;
        var en = { PackMainID: vm.ItemData.ID, BoxNumber: vm.Item.BoxNumber };
        vm.promise = AjaxService.ExecPlan("MESPackageDtl", 'getdtlmain', en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showErr(data.data[0].MsgText);
                vm.Item.BoxNumber = undefined;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.PackDetail = data.data1[0] || {};
                vm.Weight = vm.PackDetail.Packweight && vm.PackDetail.Packweight > 0 ? vm.PackDetail.Packweight : vm.Weight;
                vm.PackDetail.ProductCount = vm.PackDetail.ProductCount || 0;
                vm.PrintSnNum = vm.PackDetail.ProductCount;
                vm.PrintDtlId = vm.PackDetail.ID;
                //vm.NoList = [];
                //for (var i = 0, len2 = vm.PackDetail.ProductCount > 50 ? 50 : vm.PackDetail.ProductCount; i < vm.PackDetail.ProductCount; i++) {
                //    vm.NoList.push(i + 1);
                //}
                $("input.SnFocus").focus();
                vm.SNList = data.data2;
            }
        });
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PackSave(t) {
        var en = {};
        en.PackDetailID = vm.PackDetail.ID;
        en.PalletCode = vm.PackDetail.PalletCode;
        en.Packweight = vm.Weight;
        vm.promise = AjaxService.ExecPlan("MESPackChi", "pack", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showErr(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                toastr.success('包装成功, 打印标签');
                vm.IsEdit = false;
                vm.PrintDtlId = vm.PackDetail.ID;
                vm.Focus.SN = true;
                Print("COTTONCODE");
                getBoxList();
                //打印询问
                //MyPop.ngConfirm({ text: "是否打印包装箱" }).then(function () {
                //    Print("COTTONCODE");
                //    getBoxList();
                //}, function () {
                //    getBoxList();
                //});
            }
        })
    }

    //补打印
    function KeyDonwRePrint(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.PrintSNCode) {
            //获取打印数据
            var en2 = { SNCode: vm.PrintItem.PrintSNCode };
            AjaxService.ExecPlan("MESPackChi", "reprint", en2).then(function (data2) {
                if (data2.data[0].MsgType == "Error") {
                    showErr(data2.data[0].Msg);
                }
                else if (data2.data[0].MsgType == "Success") {
                    var en = {};
                    en.PackDetailID = data2.data1[0].PackDtlID;
                    en.TypeCode = vm.PrintType;
                    AjaxService.ExecPlan("MESPackChi", "print", en).then(function (data) {
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
                vm.PrintItem.PrintSNCode = undefined;
            })
        }
    }

    function ReplaceBr(text) {
        return text.replace(/,/g, "</br>")
    }

    //外箱补打印
    function KeyDonwOSLabelPrint(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.OSNCode) {
            //获取打印数据
            var en = { OSNCode: vm.PrintItem.OSNCode };
            AjaxService.ExecPlan("BlMOOSLabelDtl", "reprint", en).then(function (data) {
                
                if (data.data[0].MsgType == "Error") {
                    showErr(data.data[0].MsgText);
                }
                else if (data.data[0].MsgType == "Success") {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                    AjaxService.PrintPdf(FileUrl + data.data1[0].UrlPath);
                }
                vm.PrintItem.OSNCode = undefined;
            })
        }
    }

    //打印外箱标签
    function PrintOSLabel() {
        var en = { PackID: vm.PackDetail.ID };
        vm.promise = AjaxService.ExecPlan("BlMOOSLabelDtl", "print", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showErr(data.data[0].MsgText);
            }
            else if (data.data[0].MsgType == "Success") {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: data.data[0].MsgText });
                for (var i = 0; i < vm.OSLabelData.PrintNum; i++) {
                    AjaxService.PrintPdf(FileUrl + data.data1[0].UrlPath);
                }
                getBoxList();
            }
        })
    }

    function showErr(msg) {
        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
        AjaxService.PlayVoice('error.mp3');
        toastr.error(msg);
    }

    function Print(type) {
        if (!vm.IsPrint) return;
            var en = {};
            en.PackDetailID = vm.PrintDtlId;
            en.TypeCode = type;
            AjaxService.ExecPlan("MESPackChi", "print", en).then(function (data) {
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
                    vm.PrintNum = vm.MultiPrint && vm.PrintNum > 0 ? vm.PrintNum : 1;
                    for (var p = 0; p < vm.PrintNum; p++) {
                        AjaxService.Print(temp.TemplateId, temp.TS, postData, vm.PrintName).then(function (data2) {
                            console.log(data2);
                        }, function (err) {
                            console.log(err);
                        })
                    }
                    if (type != "COTTONCODE") {
                        getBoxList();
                    }
                }
            })
    }
}
]);