'use strict';

angular.module('app')
.controller('InCodePrintCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { CreateBy: $rootScope.User.UserNo };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.PrintCode = PrintCode;
    vm.SelectTab = SelectTab;

    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.InternalCode) {
            var en = {};
            en.name = "InternalCode";
            en.value = vm.DeleteItem.InternalCode;

             if (vm.IsAuto) {
                 PrintCode();
            }

            //AjaxService.GetPlan("MesPlanMain", en).then(function (data) {
            //    var mss = "生产条码 [" + vm.DeleteItem.InternalCode + '] ';
            //    if (!data.InternalCode) {
            //        vm.DeleteItem.InternalCode = undefined;
            //        //toastr.error(mes);
            //        vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '  不存在或还没有上线' });
            //    }
            //    else {
            //        AjaxService.GetPlan("MESSNCode", en).then(function (data2) {
            //            if (data2.InternalCode) {
            //                vm.DeleteItem.InternalCode = undefined;
            //                //toastr.error(mes);
            //                var Msg = { Id: vm.MesList.length + 1, IsOk: false, Msg: mss + '已绑定过SN码[' + data2.SNCode + "], 不可再解绑" };
            //                vm.MesList.splice(0, 0, Msg);
            //            }
            //            else if (vm.IsAuto) {
            //                DeleteCode();
            //            }
            //        })
            //    }
            //});
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function PrintCode() {
        var postData = {}, list = [];

        list.push(vm.DeleteItem.InternalCode);

        console.log(JSON.stringify(list));

        postData.ParaData = JSON.stringify({});
        postData.OutList = JSON.stringify(list);

        AjaxService.Print("1", "dfs", postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })

        //vm.promise = AjaxService.ExecPlan("MESDeleteCode", 'delete', vm.DeleteItem).then(function (data) {
        //    var mss = "内部码 [" + vm.DeleteItem.InternalCode + '] 解绑成功';
        //    var Msg = { Id: vm.MesList.length + 1, IsOk: true, Msg: mss };
        //    vm.MesList.splice(0, 0, Msg);
        //    vm.DeleteItem.InternalCode = undefined;
        //    vm.Focus = 0;
        //});
    }
}
]);