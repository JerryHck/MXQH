'use strict';
angular.module('access').controller('ChangePasswordCtrl', ChangePasswordCtrl);

ChangePasswordCtrl.$inject = ['$scope', '$location', '$state', 'toastr', 'AjaxService', 'appUrl'];

function ChangePasswordCtrl($scope, $location, $state, toastr, AjaxService, appUrl) {
    var vm = this;
    //vm.Item = angular.copy($rootScope.User);
    vm.token = $location.search().token;
    var t = {};
    t.Token = vm.token;
    AjaxService.DoBefore("CheckForgotPwdToken", t).then(function (data) {
        if (data.Name == "Error") {
            toastr.error(data.Msg);
            vm.Msg = data.Msg;
            vm.IsOk = false;
        }
        else if (data.Name == "Success") {
            vm.Name = data.Msg;
            vm.IsOk = true;
        }
    });


    //储存
    vm.Save = function () {
        var en = {};
        en.Token = vm.token;
        en.NewPsd = vm.Item.NewPwdSign;
        AjaxService.DoBefore("ChangePsd", en).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Success") {
                toastr.success('修改成功');
                setTimeout(function () {
                    $state.go("login");
                }, 1000);
            }
        });
    };

    vm.checkNewPwd = function () {
        vm.PswForm.newPwd.$setValidity('check', vm.Item.UserPwd != vm.Item.NewPwd);
    };

    vm.checkNewPwdSign = function () {
        vm.PswForm.newPwdSign.$setValidity('check', vm.Item.NewPwd == vm.Item.NewPwdSign);
    };

}
