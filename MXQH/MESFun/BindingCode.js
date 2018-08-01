'use strict';

angular.module('app')
.controller('BindingCodeCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr',
function ($rootScope, $scope, $http, AjaxService, toastr) {
   
    var vm = this;
    vm.NewBind = { Action: "I", CreateBy: $rootScope.User.Emp.ChiLastName + $rootScope.User.Emp.ChiFirstName };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 15 };
    vm.Ser = {};

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.KeyDonwSnCode = KeyDonwSnCode;
    vm.KeyDonwIdCode = KeyDonwIdCode;
    vm.BindCode = BindCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    
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
                            vm.Focus = 1;
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
                    vm.Focus = 2;
                }
            })
        }
    }

    function KeyDonwIdCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.NewBind.IDCode1) {
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
                else {
                    BindCode();
                }
            })
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function BindCode() {
        vm.promise = AjaxService.ExecPlan("BindCode", 'bindCode', vm.NewBind).then(function (data) {
            var mss = "生产条码 [" + vm.NewBind.InternalCode + ']  SN码 [' + vm.NewBind.SNCode + ']  模块二维码[' + vm.NewBind.IDCode1 + '] 绑定成功';
            var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
            vm.MesList.splice(0, 0, Msg);
            vm.NewBind = { Action: "I", CreateBy: $rootScope.User.Emp.ChiLastName + $rootScope.User.Emp.ChiFirstName };
            vm.Focus = 0;
        });
        
    }
}
]);