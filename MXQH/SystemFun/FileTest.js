'use strict';

angular.module('app')
.controller('FileCtrl', ['$scope', 'serviceUrl', '$window', 'AjaxService', 'FileService', 'toastr', 'FileUrl',
function ($scope, serviceUrl, $window, AjaxService, FileService, toastr, FileUrl) {

    var vm = this;
    $scope.importf = importf;
    vm.Do = Do;
    vm.save = save;
    vm.Vioce = Vioce;

    function Vioce() {
        var auto = $("#auto");
        auto.attr("src", FileUrl + '/Voice/5611.mp3');
    }

    function save() {
        var en = {};
        //en.List = JSON.stringify(vm.UploadFile);
        //en.TempColumns = 'List';

        //AjaxService.ExecPlanUpload("FileSaveTest", "save", en, vm.UploadFile, "TestMove").then(function (data) {
        //    vm.List = data;
        //    toastr.success("储存成功");
        //})
        GetPrintName('127.0.0.1');
        //var json = "";
        //JSON.stringify(json);

        //$window.location.href = 'BarCode:%7b%22LabelName%22%3a%22TestMo%22%2c%22EntityName%22%3a%22FunLoad%22%2c%22PaperWidth%22%3a%2270%22%2c%22PaperHeight%22%3a%22120%22%2c%22Zoon%22%3a1%2c%22BarArray%22%3a%5b%7b%22ID%22%3a%22-1%22%2c%22PrinterName%22%3a%22123%22%2c%22PaperWidth%22%3a%2270%22%2c%22PaperHeight%22%3a%22120%22%2c%22OffSetX%22%3a%220%22%2c%22OffSetY%22%3a%220%22%2c%22PrintType%22%3a%22128-AUTO%e7%a0%81%22%2c%22Field%22%3a%22%23%5bLoadName%5d%23%22%2c%22FieldTest%22%3a%221234567890%22%2c%22Format%22%3a%22%22%2c%22Width%22%3a%2225.66458%22%2c%22Height%22%3a%2210.58333%22%2c%22Left%22%3a%2211.90625%22%2c%22Top%22%3a%2213.22917%22%2c%22LineDir%22%3a%22%e6%b0%b4%e5%b9%b3%22%2c%22Zoom%22%3a%221%22%2c%22AlignX%22%3anull%2c%22AlignY%22%3anull%2c%22FontName%22%3a%22Arial%22%2c%22FontSize%22%3a%2212%22%2c%22IsBold%22%3a%22%e5%90%a6%22%2c%22IsNnderline%22%3a%22%e5%90%a6%22%2c%22QRErrorCorrect%22%3a%22%e9%bb%98%e8%ae%a4%22%2c%22IsAnticlockwise90%22%3a%22%e5%90%a6%22%2c%22ImgPath%22%3a%22%22%2c%22PrintRule%22%3a%22LoadName%22%2c%22Key%22%3a%22%7b1%7d%22%7d%5d%7d';

        //vm.promise = AjaxService.GetPlanOwnExcel("BindCode").then(function (data) {
        //    vm.List = data;
        //})

        //vm.promise = AjaxService.ExecPlanMail("PLMPrecess", "mail", en).then(function (data) {
        //    vm.List = data;
        //    toastr.success("储存成功");
        //})
    }

    //vm.FileData = { header: { header: "A" }, sheetNum: 1 };

    //var list = [];

    //vm.promise = AjaxService.GetPlansPage("PanTest", list, 1, 10).then(function (data) {
    //    vm.BindList = data.List;
    //    vm.page.total = data.Count;
    //});

    var en = {};
    //en.InternalCode = vm.Ser.InternalCode;
    //en.SNCode = vm.Ser.SNCode;
    //en.IDCode1 = vm.Ser.IDCode1;
    en.Customer = "U";
    //AjaxService.ExecPlan("BindCode", "BindExcel", en).then(function (data) {
    //    vm.List = data;
    //})

    //AjaxService.GetPlanExcel("BindCode", "BindExcel", en).then(function (data) {
    //    vm.List = data;
    //    //$window.location.href = data.File;
    //})

    function Do() {

        //GetPrintName('127.0.0.1');

        //vm.List = angular.copy(vm.FileData.data[0]);
        //console.log(vm.List)
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

    AjaxService.GetPlans("EnProcExcelCol").then(function (data) {
        vm.List = data;
    })

    function GetPrintName(printIP) {

        var postData = {};
        postData.ParaData = JSON.stringify(vm.PrintData);
        //postData.OutList = JSON.stringify(outList || []);

        AjaxService.Print("816", "dfs", postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })

          //  //socket = new WebSocket('ws://127.0.0.1:2012');
          //  AjaxService.GetPlan("EnProcExcelCol").then(function (data) {

          //      var postData = {};
          //      postData.ParaData = JSON.stringify(data);
          //      //postData.OutList = JSON.stringify(outList || []);

          //      AjaxService.Print("816", "dfs", postData).then(function (data) {
          //          console.log(data);
          //      }, function (err) {
          //          console.log(err);
          //      })

              
          //})
    }
}
]);


//events事件回调对象包含
//success,load,progressvar