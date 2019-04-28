'use strict';

angular.module('app')
.controller('WPOPackageCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', '$window', '$state', 'FileUrl', 'MyPop',
function ($rootScope, $scope, AjaxService, toastr, $window, $state, FileUrl, MyPop) {

    var vm = this;
    //vm.currentRouterName = angular.copy($state.current.name);
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Item = {};
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ChangeMO = ChangeMO;
    vm.PrintCode = PrintCode;
    vm.SelectTab = SelectTab;
    vm.DownExe = DownExe;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.ChangePack = ChangePack;
    vm.RemoveBSN = RemoveBSN;
    vm.Done = Done;
    vm.RePrint = RePrint;
    vm.ClearAll = ClearAll;
    vm.DownNet = DownNet;

    vm.KeyDonwPackSn = KeyDonwPackSn;

    vm.PackId = -1;
    vm.PrintPackId = 1;
    vm.NumIndex = 0;
    vm.MesList = [];
    //PageChange();

    AjaxService.GetDefaultPrinter().then(function (data) {
        console.log(data);
    })

    AjaxService.GetPlan("WPOPackagePara", { name: "SetName", value: "NoticeNum" }).then(function (data) {
        vm.NoticeNum = parseInt(data.SetValue);
    })

    function Search() {
        vm.page.index = 1;
        PageChange()
    }
    GetNoPackList();
    function GetNoPackList() {
        AjaxService.GetPlans("WPOPackage", [{ name: "State", value: 0 }]).then(function (data) {
            vm.NotPackList = data;
        })
    }

    AjaxService.GetLocalPrinters().then(function (data) {
        vm.PrintList = data;
        vm.PrinterName = data[0];
    }, function (err) {
        console.log(err);
    });

    function PageChange() {
        var list = [];
        if (vm.Ser.Name) {
            list.push({ name: "name", value: vm.Ser.InternalCode });
        }
        vm.promise = AjaxService.GetPlansPage("Dialog", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
    ////离开此页面的时候
    //$rootScope.$on('$stateChangeStart', function () {
    //    if (vm.currentRouterName == $state.current.name) {
    //        console.log('do something')
    //    }
    //});


    function SelectTab(index) {
        vm.Focus = index;
        if (index == 1) {
            AjaxService.GetPlans("WPOPackage", [{ name: "State", value: 1 }]).then(function (data) {
                vm.PackList = data;
            })
        }
    }

    function ChangePack() {
        if (vm.Package) {
            vm.MOId = vm.Package.MOId;
            vm.PackId = vm.Package.Id;
            vm.Item.PackNum = vm.Package.PackNum;
            AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
                if (data.data[0]) {
                    vm.OrderData = data.data[0];
                    vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
                }
            })

            //获取包装SN列表
            AjaxService.GetPlans("WPOpackageDtl", [{ name: "PackId", value: vm.PackId }]).then(function (data) {
                vm.SNList = data;
                vm.NumIndex = data.length % vm.NoticeNum;
                vm.NumIndex = vm.NumIndex || 0;
            });
        }
    }

    function ChangeMO() {
        AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
            if (data.data[0]) {
                vm.PackId = -1;
                vm.NumIndex = 0;
                vm.OrderData = data.data[0];
                vm.Item.PackNum = parseInt(vm.OrderData.PackNum);
                vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
            }
        })
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            vm.StaticBSN = angular.copy(vm.Item.BSN);
            var en = {};
            en.PackId = vm.PackId;
            en.MOId = vm.MOId;
            en.BSN = vm.Item.BSN;
            en.UserNo = $rootScope.User.UserNo;
            en.PackNum = vm.Item.PackNum;
            en.VenderSn = $rootScope.User.OrgSn;
            en.Remark = vm.Item.Remark;          

            AjaxService.ExecPlan("WPOPackage", 'pack', en).then(function (data) {
                vm.Item.BSN = undefined;
                var msg = data.data[0];
                if (msg.MsgType == 'success') {
                    //
                    vm.SNList = data.data1;
                    //toastr.error(mes);
                    showMsg(msg.Msg, true);
                    var parkid = data.data2[0].PackId;
                    vm.PrintPackId = data.data2[0].OriPackId;
                    //判断打印,包装完成需要打印
                    if (parkid == -1) {
                        MyPop.ngConfirm({ text: "包装箱已经完成，是否要打印标签" }).then(function () {
                            //打印
                            PrintCode(vm.PrintPackId);
                        })
                        vm.NumIndex = 0;
                        vm.Package = undefined;
                        GetNoPackList();
                    }
                    else {
                        vm.NumIndex++
                        if (vm.NumIndex == vm.NoticeNum) {
                            AjaxService.PlayVoice('5611.mp3');
                            MyPop.ngConfirm({ text: "已经扫描了" + vm.NumIndex + "个" });
                            vm.NumIndex = 0;
                        }
                    }
                    vm.PackId = angular.copy(data.data2[0].PackId);
                    //更新计数
                    AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
                        if (data.data[0]) {
                            vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
                        }
                    })
                }
                else if (msg.MsgType == 'fail') {
                    showMsg(msg.Msg, false);
                }
            });
        }
    }

    function KeyDonwPackSn(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.PrintItem.PackSn && vm.IsAuto) {
            RePrint();
        }
    }

    function RePrint() {
        if (vm.PrintItem.PackSn) {
            AjaxService.GetPlan("WPOPackPrint", { name: "PackageSN", value: vm.PrintItem.PackSn }).then(function (data) {
                vm.PrintItem.PackSn = undefined;
                if (!data.Id) {
                    toastr.error('包装箱不存在');
                    return;
                }
                if (data.State != 1) {
                    toastr.error('包装箱还未完成包装，不可打印');
                    return;
                }
                var postData = {}, list = [];
                list.push();
                postData.ParaData = JSON.stringify(data);
                postData.OutList = JSON.stringify(list);

                AjaxService.Print(data.TemplateId, data.TemplateVersion, postData, vm.PrinterName).then(function (data) {
                    console.log(data);
                }, function (err) {
                    console.log(err);
                })
            })
        }
    }

    function Done() {
        if (vm.PackId != -1 && vm.SNList && vm.SNList.length > 0) {
            var en = {};
            en.PackId = vm.PackId;
            en.UserNo = $rootScope.User.UserNo;
            en.Remark = vm.Item.Remark;
            AjaxService.ExecPlan("WPOPackage", "force", en).then(function (data) {
                //打印
                vm.PrintPackId = angular.copy(vm.PackId);
                
                MyPop.ngConfirm({ text: "要打印标签吗" }).then(function () {
                    //打印
                    PrintCode(vm.PrintPackId);
                })

                vm.PackId = -1;
                vm.NumIndex = 0;
                vm.Package = undefined;
                GetNoPackList();
                vm.SNList = [];
                toastr.success("包装成功");
            })
        }
    }

    function RemoveBSN(item) {
        if (vm.PackId == -1) {
            showMsg('包装箱已经完成， 不允许移除SN', false);
            return;
        }
        AjaxService.PlanDelete("WPOpackageDtl", item).then(function (data) {
            //更新计数
            AjaxService.ExecPlan("WPOFun", 'order', { Id: vm.MOId }).then(function (data) {
                if (data.data[0]) {
                    vm.Item.NoPackQty = vm.OrderData.AucPOQty - (data.data1[0] && data.data1[0].HavePackQty ? data.data1[0].HavePackQty : 0);
                }
            });
            //获取包装SN列表
            AjaxService.GetPlans("WPOpackageDtl", [{ name: "PackId", value: vm.PackId }]).then(function (data) {
                vm.SNList = data;
                vm.NumIndex = data.length % vm.NoticeNum;
                vm.NumIndex = vm.NumIndex || 0;
            });
            showMsg("SN码[" + item.BSN + "]已经成功从包装箱["+ item.PackageNO + "中移除", true);
        })
    }

    function PrintCode(packId) {
        AjaxService.GetPlan("WPOPackPrint", { name: "Id", value: packId }).then(function (data) {
            var postData = {}, list = [];
            list.push();
            postData.ParaData = JSON.stringify(data);
            postData.OutList = JSON.stringify(list);

            AjaxService.Print(data.TemplateId, data.TemplateVersion, postData, vm.PrinterName).then(function (data) {
                console.log(data);
            }, function (err) {
                console.log(err);
            })
        })
    }

    function showMsg(msg, type) {
        if (type) {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: msg });
        }
        else {
            vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: msg });
            AjaxService.PlayVoice('3331142.mp3');
            toastr.error(msg);
        }
        ////超过100移除
        //if (vm.MesList.length > 4) {
        //    vm.MesList.splice(vm.MesList.length - 1, 1);
        //}
    }

    function ClearAll() {
        if (vm.PackId != -1 && vm.SNList && vm.SNList.length > 0) {
            var en = {};
            en.PackId = vm.PackId;
            AjaxService.ExecPlan("WPOPackage", "clear", en).then(function (data) {
                vm.SNList = [];
                toastr.success("清空完成");
                ChangeMO();
            })
        }
    }

    function DownExe() {
        $window.location.href = FileUrl + "DownLoad/打印插件.exe";
    }

    function DownNet() {
        $window.location.href = FileUrl + "DownLoad/NDP452-KB2901907-x86-x64-AllOS-ENU.exe";
    }
}
]);