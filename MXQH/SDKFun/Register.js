'use strict';

angular.module('RegisterApp', [
    'appData',
    'ngAnimate',
    'toastr',
    'ngCookies',
    'ngSanitize',
    'AjaxServiceModule',
    'ngMessages',
      'ui.bootstrap'
])
var app = angular.module('RegisterApp').controller('RegisterCtrl', RegisterCtrl);
RegisterCtrl.$inject = ['$scope', 'AjaxService', 'toastr', 'MyPop', 'appUrl', '$cookieStore', '$window'];
function RegisterCtrl($scope, AjaxService, toastr, MyPop, appUrl, $cookieStore, $window) {
    var vm = this;
    vm.Register = Register;
    vm.SelectTab = SelectTab;
    //注册用户
    function Register() {
        console.log('123');
    }
    function SelectTab(index) {
        vm.Focus = index;
    }
}