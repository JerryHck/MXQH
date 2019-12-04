'use strict';

angular.module('app')
.controller('InCodeReleaseCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page1 = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_WorkOrder = "";
    vm.Ser.a_MaterialCode = "";
    vm.PrintNum = 1;

    vm.PageChange1 = PageChange1;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.ChangeTab = ChangeTab;
    vm.Release = Release;
    vm.Select = Select;
    vm.Print = Print;
    vm.SearchSN = SearchSN;

    Search();
    function Search() {
        vm.page.index = 1;
    }

    function SearchSN() {
        vm.page1.index = 1;
        PageChange1();
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("MESMOReleaseDtl", GetContition1(), vm.page1.index, vm.page1.size).then(function (data) {
            vm.SNList = data.List;
            vm.page1.total = data.Count;
        });
    }

    //内控码释放
    function Release() {
        
        MyPop.ngConfirm({ text: "确定要释放内控码吗" }).then(function () {

            var enfrom = { TbName: "MesSnCode", ClName: "InCode", CharName: "", Count: vm.ReleaseItem.ReleaseNum };
            var en = {};
            en.toConn = "MEScon";
            en.toProc = "dbo.sp_SaveReleaseInCode";
            en.toJson = JSON.stringify(vm.ReleaseItem);
            en.fromConn = "MXQHCon";
            en.fromProc = "dbo.sp_SerialNumberMulti";
            en.fromJson = JSON.stringify(enfrom);
            //获取工单验证信息
           vm.promise = AjaxService.BasicCustom("ExecProcCross", en).then(function (data) {
                vm.SelectId = data.data1[0].Id;
                SearchSN();
                vm.ReleaseItem = undefined;
                toastr.success("生成成功");
                GetOrderData();
            })
        })
    }

    //打印
    function Print(id, type, IsRprint, SNCode) {
        vm.SelectId = id;
        
        //判断模板
        if (!vm.teData || !vm.teData.TemplateId || vm.teData.TemplateId == null) {
            toastr.error("打印模版获取失败");
            AjaxService.PlayVoice('error.mp3');
            return;
        }

        var en = {};
        en.MainId = id;
        en.WorkOrder = vm.MoData.WorkOrder;
        en.SNCode = SNCode;
        en.Type = type;
        en.Rprint = IsRprint;
        console.log(en);
        //获取打印值
        vm.promise = AjaxService.ExecPlan("MESSNCode", "releasesn", en).then(function (data) {
            var list = data.data;
            if (list.length == 0 && !IsRprint) {
                MyPop.Show(true, '请使用补打印功能');
            }
            var InList = [], ParaList = [];
            for (var i = 0, len = list.length; i < len; i++) {
                if (!list[i].IsPrint) {
                    InList.push({ SNCode: list[i].SNCode });
                }
                //打印
                var postData = {}, OutList = [];
                OutList.push(list[i].SNCode)
                postData.ParaData = JSON.stringify(list[i]);
                postData.OutList = OutList;
                for (var j = 0; j < vm.PrintNum; j++) {
                    ParaList.push(postData);
                }
            }
            PrintOne(vm.teData, ParaList);

            //更新打印状态
            AjaxService.ExecPlan("MESMOReleaseDtl", "update", { SNList: JSON.stringify(InList), TempColumns: 'SNList' }).then(function (data) {
                SearchSN();
            })
        })
    }

    function GetOrderData() {
        var en = {
            WorkOrder: vm.SelectItem.WorkOrder
        }
        vm.promise = AjaxService.ExecPlan("MESMORelease", "getOrder", en).then(function (data) {
            vm.MoData = data.data[0];
            vm.SNCount = data.data1[0].SNCount;
            vm.CharName = data.data1[0] && data.data1[0].CharName ? data.data1[0].CharName : "";
            //模版信息
            vm.teData = data.data2[0];
        });

        vm.promise = AjaxService.GetPlans("MESMoReleaseMainVw", { name: "WorkOrder", value: vm.SelectItem.WorkOrder }).then(function (data) {
            vm.ReList = data;
        });

    }

    //休眠方法
    function sleep(d) {
        for (var t = Date.now() ; Date.now() - t <= d;);
    }

    //打印1个
    function PrintOne(teData, data) {
        //console.log(data);
        vm.promise = AjaxService.PrintMulti(teData.TemplateId, teData.TemplateTime, data, vm.PrinterName).then(function (data) {
            toastr.success(data);
        }, function (err) {
            console.log(err);
        });
    }

    function ChangeTab(index) {
        vm.tabIndex = index;
    }

    function Select(item) {
        vm.SelectId = item.Id;
        SearchSN();
    }

    //导出excel
    function ExportExcel(type, item) {
        var list = [];
        list.push({ name: "WorkOrder", value: vm.MoData.WorkOrder, tableAs: "a" });
        if (type=='O') {
            list.push({ name: "Id", value: item.Id, tableAs: "a" });
        }
        vm.promise = AjaxService.GetPlanOwnExcel("MESMOReleaseExecl", list).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_WorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser.a_WorkOrder, tableAs: "a" });
        }
        if (vm.Ser.a_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.a_MaterialCode, tableAs: "a" });
        }
        return list;
    }

    function GetContition1() {
        var list = [];
        list.push({ name: "MainId", value: vm.SelectId||-1, tableAs: "a" });
            
        if (vm.SerBSN) {
            list.push({ name: "SNCode", value: "%" + vm.SerBSN + "%", tableAs: "a" });
        }
        return list;
    }

}]);
