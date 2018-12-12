'use strict';

angular.module('app')
.controller('BindingCodeCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {
   
    var vm = this;
    vm.NewBind = { Action: "I", CreateBy: $rootScope.User.UserNo, Customer:"D" };
    vm.MesList = [];
    vm.Focus = { InCode: true, SnCode: false, IdCode: false };
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwIdCode = KeyDonwIdCode;
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
        if (vm.Ser.IDCode1) {
            list.push({ name: "IDCode1", value: vm.Ser.IDCode1 });
        }
        list.push({ name: "Customer", value: "D" });
        vm.promise = AjaxService.GetPlansPage("BindCode", list, vm.page.index, vm.page.size).then(function (data) {
            vm.BindList = data.List;
            vm.page.total = data.Count;
        });
    }


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
                            vm.Focus = { InCode: false, SnCode: true, IdCode: false };
                        }
                    })
                }
            });
        }
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.SNCode) {
            var en = {};
            en.name = "SNCode";
            en.value = vm.NewBind.SNCode;
            AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
                var mss = "SN码 [" + vm.NewBind.SNCode + '] ';
                if (data2.SNCode) {
                    vm.NewBind.SNCode = undefined;
                    //toastr.error(mes);
                    var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过生产条码[' + data2.InternalCode + "]" };
                    vm.MesList.splice(0, 0, Msg);
                }
                else {
                    vm.Focus = { InCode: false, SnCode: false, IdCode: true };
                }
            })
        }
    }

    function KeyDonwIdCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.IDCode1) {
            BindCode();
        }
    }

    function SelectTab(index) {
        //vm.Focus = index;
    }

    function BindCode() {
        var en = {};
        en.name = "IDCode1";
        en.value = vm.NewBind.IDCode1;
        AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
            var mss = "模块二维码 [" + vm.NewBind.IDCode1 + '] ';
            if (data2.IDCode1) {
                vm.NewBind.IDCode1 = undefined;
                //toastr.error(mes);
                var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过生产条码[' + data2.InternalCode + "]" };
                vm.MesList.splice(0, 0, Msg);
            }
            else if (vm.IsAuto) {
                BindCode1();
            }
        })
    }

    function BindCode1() {
        vm.promise = AjaxService.ExecPlan("BindCode", 'bindCode', vm.NewBind).then(function (data) {
            var mss = "生产条码 [" + vm.NewBind.InternalCode + ']  SN码 [' + vm.NewBind.SNCode + ']  模块二维码[' + vm.NewBind.IDCode1 + '] 绑定成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.NewBind = { Action: "I", CreateBy: $rootScope.User.UserNo, Customer: "D" };
            vm.Focus = { InCode: true, SnCode: false, IdCode: false };
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
}
]);