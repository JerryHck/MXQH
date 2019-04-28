'use strict';

angular.module('app')
.controller('WPOPackageIQCCtrl', ['Dialog', '$scope', 'AjaxService', 'toastr', '$window', '$state', 'FileUrl', 'MyPop',
function (Dialog, $scope, AjaxService, toastr, $window, $state, FileUrl, MyPop) {

    var vm = this;
    //vm.currentRouterName = angular.copy($state.current.name);
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Item = {};
    vm.KeyDonwPackage = KeyDonwPackage;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.RemoveBSN = RemoveBSN;
    vm.Done = Done;
    vm.ClearAll = ClearAll;
    vm.ClearInput = ClearInput;

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenDtl = OpenDtl;

    vm.PackId = -1;
    vm.PrintPackId = 1;
    vm.MesList = [];
    vm.SNList = [];
    vm.IQCFormData = { CheckResult: 1};

    Search();

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("AucWPOIQCCheck", genContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("AucWPOIQCCheck", genContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function OpenDtl(item) {
        Dialog.OpenDialog("WPOIQCDtlDialog", item).then(function (data) {

        }, function (mes) {

        });
    }

    function genContition() {
        var list = [];
        if (vm.Ser.a_IQCFormNo) {
            list.push({ name: "IQCFormNo", value: vm.Ser.a_IQCFormNo });
        }
        if (vm.Ser.b_AuctusWPO) {
            list.push({ name: "AuctusWPO", value: vm.Ser.b_AuctusWPO });
        }
        return list;
    }

    function KeyDonwPackage(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.PackageSN) {
            var list = [{ name: "PackageSN", value: vm.Item.PackageSN }];
            AjaxService.GetPlan("MESWPOPackageIn", list).then(function (data) {
                if (!data.PackageSN) {
                    showMsg("包装箱[" + vm.Item.PackageSN + "]不存在或未传回总部", false);
                    vm.Item.PackageSN = undefined;
                    vm.PackageData = {};
                }
                else {
                    vm.PackageData = data;
                }
            })
        }
    }

    function ClearInput() {
        vm.Item.PackageSN = undefined;
        vm.PackageData = {};
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.BSN) {
            var en = {};
            en.BSN = vm.Item.BSN;
            en.AucId = vm.PackageData.AucId;
            AjaxService.ExecPlan("AucWPOIQCCheck", 'check', en).then(function (data) {
                var have = false;
                for (var i = 0, len = vm.SNList.length; i < len; i++) {
                    if (vm.SNList[i].BSN == en.BSN) {
                        toastr.error('BSN[' + en.BSN + ']已经检查');
                        have = true; break;
                    }
                }
                if (!have) {
                    vm.SNList.splice(0, 0, data.data[0]);
                    CalRate();
                }
                showMsg(data.data[0].Remark, data.data[0].CheckResult == "1");
            });
            vm.Item.BSN = undefined;
        }
    }

    function Done() {
        if (vm.SNList && vm.SNList.length > 0) {
            //PK生成设定
            var snList = [{ col: "IQCFormNo", parm: "IQCFormNo" },
                //{ col: "IQCFormNo", parm: "DtlList", multi: true }
            ];

            vm.IQCFormData.PackId = vm.PackageData.AucId;
            vm.IQCFormData.CheckResult = vm.PackageData.CheckResult || 1;
            vm.IQCFormData.SNColumns = JSON.stringify(snList);
            vm.IQCFormData.DtlList = JSON.stringify(vm.SNList);
            vm.IQCFormData.TempColumns = "DtlList";
            AjaxService.ExecPlan("AucWPOIQCCheck", "iqc", vm.IQCFormData).then(function (data) {
                vm.IQCFormData = { CheckResult: 1};
                vm.SNList = [];
                ClearInput();
                console.log(data)
                toastr.success("抽检单生成成功");
            })
        }
    }

    function RemoveBSN(index) {
        MyPop.ngConfirm({ text: "是否要删除此笔资料" }).then(function () {
            vm.SNList.splice(index, 1);
            CalRate();
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
    }

    function ClearAll() {
        MyPop.ngConfirm({ text: "确认全部清空SN吗" }).then(function () {
            vm.SNList = [];
            CalRate();
        })
    }

    //计算抽检个数 比例
    function CalRate() {
        vm.IQCFormData.CheckNum = vm.SNList.length;
        console.log(vm.IQCFormData.CheckNum);
        var ok = 0, ng = 0;
        for (var i = 0; i < vm.IQCFormData.CheckNum; i++) {
            if (vm.SNList[i].CheckResult == 1) {
                ok++;
            }
            else {
                ng++;
            }
        }
        vm.IQCFormData.CheckRate = ((1.00 * vm.IQCFormData.CheckNum / (vm.PackageData.PackNum == 0 ? 1 : vm.PackageData.PackNum)) * 100).toFixed(2);
        vm.IQCFormData.PassRate = ((1.00 * ok / (vm.IQCFormData.CheckNum == 0 ? 1 : vm.IQCFormData.CheckNum)) * 100).toFixed(2);
    }
}
]);