'use strict';

angular.module('app')
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr',
function ($scope, $http, Dialog, AjaxService, toastr) {

    var vm = this;
    AjaxService.GetPlans("Emp").then(function (data) {
        vm.List = data;
    });
    
    AjaxService.GetPlansPage("Emp", undefined, 0, 2).then(function (data) {
        vm.ListPage = data;
    });
}
]);