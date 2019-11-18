'use strict';

angular.module('app')
.controller('MOReleaseCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.page1 = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Ser.a_WorkOrder = "";
    vm.Ser.a_MaterialCode = "";
    vm.PrintNum = 1;

    vm.Edit = Edit;
    vm.PageChange = PageChange;
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
        PageChange();
    }

    function SearchSN() {
        vm.page1.index = 1;
        PageChange1();1
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("MESMOForRelease", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("MESMOReleaseDtl", GetContition1(), vm.page1.index, vm.page1.size).then(function (data) {
            vm.SNList = data.List;
            vm.page1.total = data.Count;
        });
    }

    //工单释放
    function Release() {
        if (vm.SNCount + vm.Release.Num > vm.MoData.MaxOverCount) {
            toastr.error("工单释放总量超过最大允许释放量[" + vm.MoData.MaxOverCount + "],最多可再释放[" +
                (vm.MoData.MaxOverCount - vm.SNCount).toString() + ']');
            return;
        }
        if (vm.MoData.TbName == "" || vm.MoData.TbName == undefined || vm.MoData.TbName == null
                    || vm.MoData.ClName == "" || vm.MoData.ClName == undefined || vm.MoData.ClName == null) {
            toastr.error('工单未设定编码规则，请联系管理员设定');
            return;
        }
        if (vm.SNCount + vm.ReleaseItem.ReleaseNum > vm.MoData.MaxOverCount) {
            toastr.error('可释放量超出，最多可再释放【' + (vm.MoData.MaxOverCount - vm.SNCount).toString() + '】');
            return;
        }

        MyPop.ngConfirm({ text: "确定要释放工单SN码吗" }).then(function () {

            var enfrom = { TbName: vm.MoData.TbName, ClName: vm.MoData.ClName, CharName: vm.CharName, Count: vm.ReleaseItem.ReleaseNum };
            vm.ReleaseItem.WorkOrder = vm.MoData.WorkOrder;
            var en = {};
            en.toConn = "MEScon";
            en.toProc = "dbo.sp_SaveReleaseOrder";
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
            var InList = [];
            for (var i = 0, len = list.length; i < len; i++) {
                if (!list[i].IsPrint) {
                    InList.push({ SNCode: list[i].SNCode });
                }
                //打印
                for (var j = 0; j < vm.PrintNum; j++) {
                    PrintOne(vm.teData, list[i]);
                }
            }
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

        vm.promise = AjaxService.GetPlans("MESMORelease", { name: "WorkOrder", value: vm.SelectItem.WorkOrder }).then(function (data) {
            vm.ReList = data;
        });

    }



    //打印1个
    function PrintOne(teData, data) {
        if (!data || !data.SNCode || data.SNCode == null) {
            toastr.error("SN不存在或还未生成");
            AjaxService.PlayVoice('error.mp3');
            return;
        }
        var postData = {}, list = [];
        list.push(data.SNCode)
        postData.ParaData = JSON.stringify(data);
        postData.OutList = list;
        AjaxService.Print(teData.TemplateId, teData.TemplateTime, postData, vm.PrinterName).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function ChangeTab(index) {
        vm.tabIndex = index;
    }

    //工单编辑
    function Edit(item) {
        vm.tabIndex = 1;
        vm.SelectItem = item;
        vm.SNList = [];
        GetOrderData();
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
