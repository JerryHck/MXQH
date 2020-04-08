'use strict';

angular.module('app')
.controller('QZSOReportCtrl', ['$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.SearchATE = SearchATE;
    vm.KeyDonwSnCode = KeyDonwSnCode;

    function Search() {
        PageChange();
    }

    function KeyDonwSnCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Ser.SN) {
            PageChange();
        }
    }

    function PageChange() {
        vm.promise = AjaxService.ExecPlan("QZSO", "review", vm.Ser).then(function (data) {
            var msg = data.data[0];
            vm.Data = data;
            if (msg.MsgType == 'Error') {
                toastr.error(msg.Msg);
                vm.Ser = {}
            }
        });

    }

    function SearchATE(item) {
        vm.SerItem = item;
        $(".bsn-ate").addClass("active");
    }

}]);
