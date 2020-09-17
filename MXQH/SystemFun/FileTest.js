'use strict';

angular.module('app')
.controller('FileCtrl', ['$scope', 'serviceUrl', '$window', 'AjaxService', 'FileService', 'toastr', 'FileUrl', '$cookieStore', '$state',
function ($scope, serviceUrl, $window, AjaxService, FileService, toastr, FileUrl, $cookieStore, $state) {

    var vm = this;
    $scope.importf = importf;
    vm.Do = Do;
    vm.save = save;
    vm.Vioce = Vioce;
    vm.Import = Import;

    vm.Op = [
        {
            //标题列
            header: ['RowNo', 'CustomOrder', 'DemandCode', 'MRPType', 'FormType', 'WorkOrder', 'MaterialCode', 'MaterialName', 'WorkShop', 'Line', 'State', 'Quantity', 'FinishQty', 'NotFinishQty', 'PlanStDate', 'PlanEdDate', 'NeedDate', 'ProduceDate', 'Remark'],
            sheet: 0, //excel 的第几张sheet 以0开始
        },
        //{
        //    header: ["Line", "Code", "SPEC", "Name", "Num", "Version", "Cost", "Weight", "BOMUom", "BaseNum", "Waste", "Position", "Remark"],
        //    sheet: 1,
        //}
    ];

    function Import(data) {
        console.log(data);
    }


    vm.UserChange = function (data) {
        vm.df = data.ChiFirstName;
        console.log(data);
        vm.Nald = data;
    }

    function Vioce() {
        var auto = $("#auto");
        auto.attr("src", FileUrl + '/Voice/5611.mp3');
    }

    //vm.promise = AjaxService.CallDll('SourceHelper', 'SourceHelper.SQLHelper', 'TestDll', { planName: "dasd" }).then(function (data) {
    //   console.log(data)

    //});

    //var dfg = {"AuVenSN":"ffgg","UserNo":"ffff","ID":1090218,"TS":"2019-12-30T11:15:41.87","BSN":"JDC6398","STATE":"Pass","ElapsedTime":"36.5/1-T5","MODEL_NAME":"AU152","TX_Freq1_Lo_Power":"0.656","TX_Freq_Error":"-100.00","TX_Freq1_Hi_Power":"","TX_Freq1_Hi_Power_Current":"","TX_Freq1_Lo_Power_Current":"490.05","Software_Version":"","Standby_Current":"","TX_Modulation_Sensitivity":"4.50","TX_Modulation_SNR":"","TX_Modulation_Distortion":"1.08","TX_Max_Deviation":"","TX_Dev_Limit":"","Call_Dev":"","TX_CTCSS_Deviation":"","TX_VOX9_Sensitivity":"","TX_VOX1_Sensitivity":"","RX_Max_Audio_Output":"3109.06","RX_Audio_Distortion":"2.02","RX_SNR":"","RX_Sensitivity":"-119//16.1","RX_SQ_Sensitivity_Open":"","RX_SQ_Sensitivity_Close":"","RX_CTCSS_Sensitivity":"","User_ID":"","WORK_PROC":"ATE","PROD_STAGE":"1-15","time":"2019-12-30T11:15:41.87","TX_462Freq_HiPower":"","TX_462Freq_HiPower_Current":"","TX_462Freq_LowPower":"","TX_462Freq_LowPower_Current":"","TX_467Freq_HiPower":"","TX_467Freq_HiPower_Current":"","TX_467Freq_LowPower":"","TX_467Freq_LowPower_Current":"","TX_VOX3_Sensitivity":"","WR_Sensitivity":"","RX_Audio_Output":"","TX_Channel_Power":"","RX_SQ_Sensitivity_SINAD_Close":"","RX_SQ_Sensitivity_SINAD_Open":"","RX_Audio_Distortion_Adj":"","TX_VOX2_Sensitivity":"","RX_CTC_SNR":"","RX_CDC_SNR":"","TX_CDCSS_Decoder":"","TX_CTCSS_Decoder":"","TX_Freq2_Hi_Power":"","TX_Freq2_Hi_Power_Current":"","TX_Freq3_Hi_Power":"","TX_Freq3_Hi_Power_Current":"","TX_Freq4_Hi_Power":"","TX_Freq4_Hi_Power_Current":"","TX_Freq5_Hi_Power":"","TX_Freq5_Hi_Power_Current":"","TX_Freq2_Lo_Power":"","TX_Freq2_Lo_Power_Current":"","TX_Freq3_Lo_Power":"","TX_Freq3_Lo_Power_Current":"","TX_Freq4_Lo_Power":"","TX_Freq4_Lo_Power_Current":"","TX_Freq5_Lo_Power":"","TX_Freq5_Lo_Power_Current":"","TX_Freq1_10mW_Power":"","TX_Freq1_10mW_Power_Current":"","TX_Freq2_10mW_Power":"","TX_Freq2_10mW_Power_Current":"","TX_Freq3_10mW_Power":"","TX_Freq3_10mW_Power_Current":"","TX_Freq4_10mW_Power":"","TX_Freq4_10mW_Power_Current":"","TX_Freq5_10mW_Power":"","TX_Freq5_10mW_Power_Current":"","TX_CarrierFreq_Tolerance":"","TX_HiPower":"","TX_HiPower_Current":"","RX_Current":"","RX_BER":"","TX_Channel_Current":"","DateTime":null,"TX_Hi_Volt_Power":"","TX_Lo_Volt_Power":"","TX_VOX5_Sensitivity":"","TX_U_Power":"","TX_U_Freq_Error":"","TX_Channel_Power_Current":"","TX_Channel_Power_0":"","TX_Channel_Power_0_Current":"","TX_Channel_Power_1":"","TX_Channel_Power_1_Current":"","TX_Channel_Power_2":"","TX_Channel_Power_2_Current":"","TX_Channel_Power_3":"","TX_Channel_Power_3_Current":"","TX_Channel_Power_4":"","TX_Channel_Power_4_Current":"","RX_Weather_forecast":"-118//25.2","TX_Freq1_Lo_Power_3V6":"","TX_Freq1_Lo_Power_Current_3V6":"","BT_TX_Power":"","BT_RX_Sensitivity":"","TX_Freq_Power":"","TX_Power_Current":""};

    //AjaxService.PlanInsert("MESWPOAtetest", dfg)

    //AjaxService.GetComPortList().then(function (data) {
    //    vm.ComList = JSON.parse(data);
    //    console.log(data);
    //})

    //AjaxService.AjaxHandle("GetFileText", "System.html").then(function (data) {
    //    vm.htmlVariable = data.Msg;
    //})

    
    ////获取组织信息
    //var con = [
    //    //{ name: "Layer", value: 1, level: 0 },
    //    //{ name: "Layer", value: 3, level: 0, action: "Or" },
    //    //{ name: "Layer", value: 5, level: 0, action: "Or" },
    //    { name: "Layer", value: '1,3,5', type:"in", level: 0 },
    //    { name: "IsMonitor", value: 1, level: 0 }
    //];


    //AjaxService.GetPlans("syQpoor", con).then(function (data) {
    //    vm.TypeList = data;
    //});





    function save() {

        var en = {};
        en.conn = "SKTcon";
        en.proc = "sp_GetIqcData";
        en.strJson = JSON.stringify({ InspectionId: 10144 });
        en.XmlName = "IQCFormReportFile.xml";

        AjaxService.BasicCustom("ExecProcPDF", en).then(function (data) {
            //$window.location.href = data.File;
            $window.open(data.File);
            //打印PDF
            AjaxService.PrintPdf(data.File);
        });

       var data = AjaxService.GetPlansWait("AucWPOIQCCheck")

        //console.log(123465465)

        //AjaxService.GetComWeigth(vm.ComName, function (data) {
        //    vm.Weigth = data;
        //});

        ////PK生成设定
        //var snList = [{ col: "IQCFormNo", parm: "IQCFormNo" },
        //    //{ col: "IQCFormNo", count: 10, multi: true }
        //];

        //var ent = {};
        //ent.PackId = 2;
        //ent.CheckNum = 3;
        //ent.CheckResult = 0;
        //ent.CheckRate = 3;
        //ent.PassRate = 9;
        //ent.Remark = "测试使用";
        //ent.SNColumns = JSON.stringify(snList);
        //AjaxService.ExecPlan("AucWPOIQCCheck", "iqc", ent).then(function (data) {
        //    console.log(data);

        //})

        //en.List = JSON.stringify(vm.UploadFile);
        //en.TempColumns = 'List';

        //AjaxService.ExecPlanUpload("FileSaveTest", "save", en, vm.UploadFile, "TestMove").then(function (data) {
        //    vm.List = data;
        //    toastr.success("储存成功");
        //})
        //GetPrintName('127.0.0.1');
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
        AjaxService.PrintPdf(FileUrl + "OutLabel/FBA15Q63FSQ5U000003.pdf");
        var enCon = { WorkOrder: "AMO-30190506004", StartDate: "2019-07-25 8:30:00", EndDate: '2019-07-25 19:30:00' };
        var en = {};
        en.Method = 'ExecPlan';
        en.PlanName = "MesMxWOrder";
        en.ShortName = "board"
        en.Intervel = 5;
        //传送的参数字符串
        en.Json = JSON.stringify(enCon);
        AjaxService.GetServerSocket(en, function (data) {
            //console.log(data);
            $scope.$apply(function () {
                vm.SocketData = JSON.parse(data);
            });
        })

    }

    vm.change = function () {
        console.log(vm.Select);
    }

    function Show(data) {
        $scope.$apply(function () {
            vm.Test1 = data.data;
        });
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

    //AjaxService.GetPlans("EnProcExcelCol").then(function (data) {
    //    vm.List = data;
    //})

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

    vm.PageChange = PageChange;

    function PageChange() {

        var en = [{ name: "IsRepair", value: '0' }];

        vm.promise = AjaxService.GetPlansPage("SelectProRepair", en, 1, 12).then(function (data) {
            
            console.log(data);
        });

    }
}
]);