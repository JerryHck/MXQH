﻿'use strict';

angular.module('app')
.controller('QZSOCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window','Dialog',
function ($rootScope, $scope, $http, AjaxService, toastr, $window,Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenScan = OpenScan;
    vm.SOAgent = {};
    vm.MaterialInfo = {};

    PageChange();
    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function Insert() {
        var en = {};
        en.TbName = "QZXS";
        en.ClName = "DocNo";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {

            vm.NewItem = {
                DocNo: data.data[0].SN,
                CreateBy: $rootScope.User.Name,
                Status: 0
            };
            vm.Ser = { State: 0 };
            //PK生成设定
            var snList = [{ name: "QZXS", col: "DocNo", parm: "DocNo" }];
            //SN生产
            vm.NewItem.SNColumns = JSON.stringify(snList);

            vm.IsInsert = true;
        })
    }

    function SaveInsert() {
        vm.NewItem.SOAgentID = vm.SOAgent.ID;
        vm.NewItem.SOAgentCode = vm.SOAgent.Code;
        vm.NewItem.SOAgentName = vm.SOAgent.Name;
        vm.NewItem.MaterialID = vm.MaterialInfo.Id;
        vm.NewItem.MaterialCode = vm.MaterialInfo.MaterialCode;
        vm.NewItem.MaterialName = vm.MaterialInfo.MaterialName;
        console.log(vm.MaterialInfo);
        if (!vm.NewItem.Remark) {
            vm.NewItem.Reamrk = '';
        }
        vm.promise = AjaxService.PlanInsert("QZSO", vm.NewItem).then(function (data) {
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.SOAgent = { ID: item.SOAgentID, Code: item.SOAgentCode, Name: item.SOAgentName };
        vm.MaterialInfo = { Id: item.MaterialID, MaterialCode: item.MaterialCode, MaterialName: item.MaterialName };
        vm.EditItem = angular.copy(item);
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("QZSO", en).then(function (data) {
            PageChange();
            toastr.success('删除成功');
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.DocNo = vm.EditItem.DocNo;
        en.SOAgentID = vm.SOAgent.ID;
        en.SOAgentCode = vm.SOAgent.Code;
        en.SOAgentName = vm.SOAgent.Name;
        en.MaterialID = vm.MaterialInfo.Id;
        en.MaterialCode = vm.MaterialInfo.MaterialCode;
        en.MaterialName = vm.MaterialInfo.MaterialName;
        en.Status = vm.EditItem.Status;
        en.Quantity = vm.EditItem.Quantity;
        en.ModifyBy = vm.EditItem.ModifyBy;
        en.ModifyDate = vm.EditItem.ModifyDate;
        en.SOAgentID = vm.EditItem.SOAgentID;
        en.CreateBy = vm.EditItem.CreateBy;
        en.CreateDate = vm.EditItem.CreateDate;
        if (!vm.EditItem.Remark) {
            en.Remark = '';
        } else {
            en.Remark = vm.EditItem.Remark;
        }
        vm.promise = AjaxService.PlanUpdate("QZSO", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("QZSO", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("QZSO", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.a_MaterialCode, tableAs: "a" });
        }
        return list;
    }

    function OpenScan(item) {
        Dialog.OpenDialog("QZSODetail", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

}]);
