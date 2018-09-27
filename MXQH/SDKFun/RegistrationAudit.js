'use strict';

angular.module('app')
.controller('RegistrationAuditCtrl', ['$scope', '$http', '$window', 'AjaxService', 'FileService', 'toastr',
function ($scope, $http, $window, AjaxService, FileService, toastr) {

    var vm = this;
    vm.save = save;


    AjaxService.GetPlans("SDKRegUserList").then(function (data) {
        vm.List = data;
    })

    function save() {
        var en = {};
        //en.List = JSON.stringify(vm.UploadFile);
        //en.TempColumns = 'List';

        //AjaxService.ExecPlanUpload("FileSaveTest", "save", en, vm.UploadFile, "TestMove").then(function (data) {
        //    vm.List = data;
        //    toastr.success("储存成功");
        //})


        vm.promise = AjaxService.ExecPlanMail("PLMPrecess", "mail", en).then(function (data) {
            vm.List = data;
            toastr.success("储存成功");
        })
    }

   
}
]);