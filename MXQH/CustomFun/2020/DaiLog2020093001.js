'use strict';

angular.module('AppSet')
.controller('WOPlanImportDiffCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.page1 = { index: 1, size: 10 };
    vm.Ser = {};
    vm.VerData = angular.copy(ItemData);
    vm.PageChange = PageChange;
    vm.PageChange1 = PageChange1;
    vm.Search = Search;
    vm.Search1 = Search1;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.Compare = Compare;

    Search();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Search1() {
        vm.page1.index = 1;
        PageChange1();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("WorkOrderPlanImport", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = angular.copy(data.List);
            vm.VerData.Import = vm.VerData.Import || data.List[0];
            vm.page.total = data.Count;
            Search1();
        });
    }

    function PageChange1() {
        AjaxService.GetPlansPage("WorkOrderPlanDiff", [{ name: "ImportID", value: vm.VerData.Import.ID, tableAs: "a" }], vm.page1.index, vm.page1.size).then(function (data) {
            vm.List1 = data.List;
            vm.page1.total = data.Count;
        });
    }

    function Compare() {
        var enTo = { MainID: vm.VerData.Import.ID };
        var en = {};
        en.toConn = "MEScon";
        en.toProc = "dbo.sp_SaveU9MoPlanDiff";
        en.toJson = JSON.stringify(enTo);
        en.fromConn = "U9con";
        en.fromProc = "dbo.sp_Auctus_MOInProccessList";
        en.fromJson = JSON.stringify({});
        //比对计划信息
        vm.promise = AjaxService.BasicCustom("ExecProcCross", en).then(function (data) {
            //console.log(data)
            if (data.data[0].MsgType == "Success") {
                Search1();
                toastr.success(data.data[0].MsgText);
                var ba = data.data1[0];
                ba.Import = vm.VerData.Import;
                //Search1();
                $uibModalInstance.close(ba);
            }
            else {
                toastr.error(data.data[0].MsgText);
            }
        })
    }


    function GetContition() {
        var list = [];
        if (vm.Ser.aCreateDate) {
            var d = new Date(vm.Ser.aCreateDate)
            var nd = new Date(d.setDate(d.getDate() + 1));
            //console.log(nd.Format('yyyy-MM-dd'))
            list.push({ name: "CreateDate", value: vm.Ser.aCreateDate, tableAs: "a", type: ">=" });
            list.push({ name: "CreateDate", value: nd.Format('yyyy-MM-dd'), tableAs: "a", type: "<=", action: 'And' });
        }
        return list;
    }
    function OK(item) {
        var en = angular.copy(item);
        en.Import = vm.VerData.Import;
        $uibModalInstance.close(item);
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
