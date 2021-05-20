'use strict';

angular.module('AppSet')
.controller('BomMateSoftCMPTDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Item = angular.copy(ItemData);
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.ChangeSelect = ChangeSelect;
    vm.DeleteSoft = DeleteSoft;

    PageChange1()
    
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("BomMateSoftVer", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            //检查选中
            for (var i = 0, len = vm.List1.length; i < len; i++) {
                for (var j = 0, len1 = vm.List.length; j < len1; j++) {
                    if (vm.List[j].ID == vm.List1[i].MateSoftID && vm.List1[i].IsEffective) {
                        vm.List[j].IsSelect = true;
                    }
                }
            }
            vm.page.total = data.Count;
        });
    }
    function PageChange1() {
        var list = [];
        list.push({ name: "MainSoftID", value: ItemData.ID });
        vm.promise = AjaxService.GetPlans("BomMateSoftCMPT", list).then(function (data) {
            vm.List1 = data;
            Search();
        });
    }

    function ChangeSelect(item) {
        //添加
        var h = false;
        for (var j = 0, len1 = vm.List1.length; j < len1; j++) {
            if (item.ID == vm.List1[j].MateSoftID && ItemData.ID == vm.List1[j].MainSoftID) {
                vm.List1[j].IsEffective = item.IsSelect;
                h = true;
            }
        }

        if (!h && item.IsSelect) {
            var en = {};
            en.MainSoftID = ItemData.ID;
            en.IsEffective = true;
            en.MateSoftID = item.ID;
            en.SoftVersion = item.SoftVersion;
            en.CreateDate = new Date();
            en.Creator = $rootScope.User.ChiFirstName;
            vm.List1.push(en);
        }
    }

    function DeleteSoft(item) {
        item.IsEffective = false;
        for (var j = 0, len1 = vm.List.length; j < len1; j++) {
            if (vm.List[j].ID == item.MateSoftID) {
                vm.List[j].IsSelect = false;
            }
        }
    }

    function GetContition() {
        var list = [];
        list.push({ name: "Code", value: ItemData.Code });
        list.push({ name: "CreateDate", value: ItemData.CreateDate, type: "<" });
        return list;
    }
    function OK() {

        var dat = {};
        dat.ID = ItemData.ID;
        var list = [];
        for (var j = 0, len1 = vm.List1.length; j < len1; j++) {
            var en = {};
            en.ID = vm.List1[j].ID || -1;
            en.MainSoftID = ItemData.ID;
            en.IsEffective = vm.List1[j].IsEffective;
            en.MateSoftID = vm.List1[j].MateSoftID;
            en.SoftVersion = vm.List1[j].SoftVersion;
            list.push(en);
        }
        dat.List = JSON.stringify(list);
        dat.TempColumns = "List";
        vm.promise = AjaxService.ExecPlan("BomMateSoftCMPT", 'save', dat).then(function (data) {
            toastr.success("储存成功");
            $uibModalInstance.close(1);
        })
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
