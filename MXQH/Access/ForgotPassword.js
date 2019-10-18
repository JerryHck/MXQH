'use strict';

angular.module('access')
.controller('ForgotPasswordCtrl', ['$scope', 'AjaxService', 'toastr',
function ($scope, AjaxService, toastr) {

    var vm = this;
    vm.Send = Send;

    function Send() {
        var en = {};
        en.UserNo = vm.Item.UserNo;
        en.EMail = vm.Item.Mail;
        AjaxService.DoBefore("ForgotPassword", en).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
            }
            else if (data.Name == "Success") {
                toastr.success(data.Msg);
            }
        });
    }
}
]);