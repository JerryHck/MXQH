﻿'use strict';

angular.module('app')
.controller('FileCtrl', ['$scope', '$http', '$window', 'AjaxService',
function ($scope, $http, $window, AjaxService) {

    var vm = this;
    $scope.importf = importf;
    vm.Do = Do;
    vm.Do2 = Do2;
    //vm.FileData = { header: { header: "A" }, sheetNum: 1 };

    //AjaxService.GetPlans("LonginEmp").then(function (data) {
    //    vm.List = data;
    //})
    var en = {};
    //en.InternalCode = vm.Ser.InternalCode;
    //en.SNCode = vm.Ser.SNCode;
    //en.IDCode1 = vm.Ser.IDCode1;
    en.Customer = "U";
    //AjaxService.ExecPlan("BindCode", "BindExcel", en).then(function (data) {
    //    vm.List = data;
    //})

    AjaxService.GetPlanExcel("BindCode", "BindExcel", en).then(function (data) {
        vm.List = data;
        $window.location.href = data.File;
    })

    function Do() {
        vm.List = angular.copy(vm.FileData.data[0]);
        console.log(vm.List)
    }

    function Do2() {
        vm.List2 = angular.copy(vm.FileData2.data[0]);
        console.log(vm.List2)
    }

    /*
    FileReader共有4种读取方法：
    1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
    2.readAsBinaryString(file)：将文件读取为二进制字符串
    3.readAsDataURL(file)：将文件读取为Data URL
    4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
                         */
    var wb;//读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串
    function importf(obj) {
        if (!obj.files) {
            return;
        }
        $scope.List = [];
       
        vm.promise = ToJson(obj.files[0]).then(function (data) {
            $scope.List = data;
        });
    }
}
]);


//events事件回调对象包含
//success,load,progressvar