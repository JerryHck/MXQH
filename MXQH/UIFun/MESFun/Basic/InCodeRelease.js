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
    //vm.ReleaseItem = { ToDay: new Date().Format('yyyy/MM/dd') };
    vm.ReleaseItem = {};
    vm.PrintNum = 1;

    vm.PageChange = PageChange;
    vm.SerThisDate = SerThisDate;
    vm.PageChange1 = PageChange1;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    vm.Release = Release;
    vm.ReleaseDown = ReleaseDown;

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
        if (vm.ReleaseItem.ReleaseNum > vm.PKData.CanCount) {
            toastr.error("生成量已经超出允许范围");
            vm.ReleaseItem.ReleaseNum = undefined;
            return;
        }
        MyPop.ngConfirm({ text: "确定要释放内控码吗" }).then(function () {
            vm.ReleaseItem.ItemTypeId = vm.MateItem.MaterialTypeID;
            vm.ReleaseItem.ItemCode = vm.MateItem.MaterialCode;
            vm.ReleaseItem.ItemName = vm.MateItem.MaterialName;
            vm.ReleaseItem.ReleaseDate = vm.ReleaseItem.ToDay;
            //以天数重置
            var enfrom = { TbName: "MesSnCode", ClName: "InCode", CharName: vm.ReleaseItem.ToDay, Count: vm.ReleaseItem.ReleaseNum, Today: vm.ReleaseItem.ToDay };
            //var enfrom = { TbName: "MesSnCode", ClName: "InCode", CharName: "", Count: vm.ReleaseItem.ReleaseNum };
            var en = {};
            en.toConn = "HeadCon";
            en.toProc = "dbo.sp_SaveReleaseInCode";
            en.toJson = JSON.stringify(vm.ReleaseItem);
            en.fromConn = "MXQHCon";
            en.fromProc = "dbo.sp_SerialNumberMulti";
            en.fromJson = JSON.stringify(enfrom);
            //获取工单验证信息
            vm.promise = AjaxService.BasicCustom("ExecProcCross", en).then(function (data) {
                toastr.success("生成成功");
                //vm.SelectId = data.data1[0].Id;
                //SearchSN();
                vm.ReleaseItem.ReleaseNum = undefined;
                SerThisDate();
                
            })
        })
    }

    //下发给供应商
    function ReleaseDown(item) {
        MyPop.ngConfirm({ text: "发后结果将不可撤回, 确定要下发吗" }).then(function () {
            var en = {};
            en.Id = item.Id;
            en.IsPublish = true;
            en.PublishBy = $rootScope.User.UserNo;
            vm.promise = AjaxService.PlanUpdate("WPOInCodePublish", en).then(function (data) {
                toastr.success("下发成功");
                Search();
            });
        });
    }

    //休眠方法
    function sleep(d) {
        for (var t = Date.now() ; Date.now() - t <= d;);
    }

    function GetContition1() {
        var list = [];
        list.push({ name: "MainId", value: vm.SelectId||-1, tableAs: "a" });
            
        if (vm.SerBSN) {
            list.push({ name: "SNCode", value: "%" + vm.SerBSN + "%", tableAs: "a" });
        }
        return list;
    }

    function SerThisDate() {
        vm.Ser.ReleaseDate = vm.ReleaseItem.ToDay;
        var enfrom = { TbName: "MesSnCode", ClName: "InCode", CharName: vm.ReleaseItem.ToDay, ToDay: vm.ReleaseItem.ToDay };
        AjaxService.ExecPlan("SerialNumberSet", "preview", enfrom).then(function (data) {
            vm.PKData = data.data[0];
            vm.PKData.HaveCount = parseInt(vm.PKData.SerialSN) - 1;
            vm.PKData.CanCount = parseInt(('100000000000').substr(0, vm.PKData.SerialLenth + 1)) - vm.PKData.HaveCount;
        })
        Search();
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WPOInCodePublish", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("WPOInCodePublish", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }

    function GetContition() {
        var list = [{ name: "ItemTypeId", value: 6, type: "=" }];
        if (vm.Ser.a_VenderNo) {
            list.push({ name: "VenderNo", value: vm.Ser.a_VenderNo, tableAs: "a" });
        }
        if (vm.Ser.a_ItemCode) {
            list.push({ name: "ItemCode", value: vm.Ser.a_ItemCode, tableAs: "a" });
        }
        if (vm.Ser.ReleaseDate) {
            list.push({ name: "ReleaseDate", value: vm.Ser.ReleaseDate, tableAs: "a" });
        }
        if (vm.Ser.a_BatchNo) {
            list.push({ name: "BatchNo", value: vm.Ser.a_BatchNo, tableAs: "a" });
        }
        if (vm.Ser.a_CreateDate) {
            list.push({ name: "CreateDate", value: vm.Ser.a_CreateDate, tableAs: "a", type: ">=" });
        }
        if (vm.Ser.a_CreateDate1) {
            list.push({ name: "CreateDate", value: vm.Ser.a_CreateDate1, tableAs: "a", type: "<=" });
        }
        return list;
    }

}]);
