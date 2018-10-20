'use strict';

angular.module('access')
.controller('SdkDownloadLinkCtrl', ['$scope', 'AjaxService', 'toastr', '$location', '$window', 
function ($scope, AjaxService, toastr, $location, $window) {

    var vm = this;
    vm.token = $location.search().token;
    vm.IsOk = true;
    var t = {};
    t.Token = vm.token;

    vm.Download = function () {
        AjaxService.DoBefore("SDKDownload", t).then(function (data) {
            if (data.Name == "Error") {
                toastr.error(data.Msg);
                vm.Msg = data.Msg;
                vm.IsOk = false;
            }
            else if (data.Name == "Success") {
                $window.open(data.Msg);
                vm.IsOk = true;
            }
            //setTimeout(function () {
            //    $window.close();
            //}, 3000);
        });
    }
}
]);