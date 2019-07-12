'use strict';

angular.module('app')
.controller('SnCodeReBindCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.NewBind = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = { InCode: false, SnCode: true };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;

    PageChange();

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
        if (vm.Ser.OldInternalCode) {
            list.push({ name: "OldInternalCode", value: vm.Ser.OldInternalCode });
        }
        vm.promise = AjaxService.GetPlansPage("SnCodeReBind", list, vm.page.index, vm.page.size).then(function (data) {
            vm.BindList = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.InternalCode && vm.NewBind.SNCode) {
            BindCode();
        }
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.SNCode) {
            var en = {};
            en.name = "SNCode";
            en.value = vm.NewBind.SNCode;
            AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
                vm.OldInCode = undefined;
                var mss = "SN码 [" + vm.NewBind.SNCode + '] ';
                if (!data2.SNCode) {
                    vm.NewBind.SNCode = undefined;
                    //toastr.error(mes);
                    var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '不存在或还未绑定内控码' };
                    vm.MesList.splice(0, 0, Msg);
                    AjaxService.PlayVoice('3331142.mp3');
                }
                else {
                    var sub = data2.SNCode.substring(0, 3);
                    if (sub != '158') {
                        vm.NewBind.SNCode = undefined;
                        //toastr.error(mes);
                        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '不允许解绑,只允许解绑158开头的SN码' });
                        AjaxService.PlayVoice('3331142.mp3');
                    }
                    else {
                        vm.OldInCode = data2.InternalCode;
                        vm.Focus = { InCode: true, SnCode: false };
                    }
                }
            })
        }
    }

    function SelectTab(index) {
        //vm.Focus = index;
    }

    function BindCode() {
        var en = {};
        en.name = "InternalCode";
        en.value = vm.NewBind.InternalCode;
        AjaxService.GetPlan("MesPlanMain", en).then(function (data) {
            var mss = "内部码 [" + vm.NewBind.InternalCode + '] ';
            if (!data.InternalCode) {
                vm.NewBind.InternalCode = undefined;
                //toastr.error(mes);
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有上线' });
            }
            else {
                AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
                    if (data2.InternalCode) {
                        vm.NewBind.InternalCode = undefined;
                        //toastr.error(mes);
                        var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过SN码[' + data2.SNCode + "]" };
                        vm.MesList.splice(0, 0, Msg);
                        AjaxService.PlayVoice('3331142.mp3');
                    }
                    else if (data2.InternalCode && data2.InternalCode == vm.OldInCode) {
                        vm.NewBind.InternalCode = undefined;
                        var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '与原内控码[' + vm.OldInCode + "]一致" };
                        vm.MesList.splice(0, 0, Msg);
                        AjaxService.PlayVoice('3331142.mp3');
                    }
                    else if (vm.IsAuto) {
                        BindCode2();
                    }
                })
            }
        });
    }

    function BindCode2() {
        vm.promise = AjaxService.ExecPlan("SnCodeReBind", 'bind', vm.NewBind).then(function (data) {
            AjaxService.PlayVoice('success.mp3');
            var mss = ' SN码 [' + vm.NewBind.SNCode + ']与原内部码[' + vm.OldInCode + ']解绑，与现内部码[' + vm.NewBind.InternalCode + '] 绑定成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.NewBind = { CreateBy: $rootScope.User.UserNo };
            vm.OldInCode = undefined;
            vm.Focus = { InCode: false, SnCode: true };
        });
    }

    function ExportExcel() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "SNCode", value: vm.Ser.SNCode });
        }
        if (vm.Ser.OldInternalCode) {
            list.push({ name: "OldInternalCode", value: vm.Ser.OldInternalCode });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("SnCodeReBind", list).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }
}
]);