'use strict';

angular.module('app')
.controller('SaleDeliverCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.StateList = [{ State: 0, Name: '待出货' }, { State: 1, Name: '已出货' }];
    vm.Ser = { State: 0 };

    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenScan = OpenScan;

    Search();
    function Search() {
        vm.page.index = 1;
        vm.IsInsert = false;
        PageChange();
    }

    function Insert() {
            var en = {};
            en.TbName = "QZSaleDeliver";
            en.ClName = "DeliverNo";
            en.CharName = "";
            AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                
                vm.NewItem = {
                    DeliverNo: data.data[0].SN,
                    DeliverDate: (new Date()).Format("yyyy/MM/dd"),
                    State:0
                };
                vm.Ser = { State: 0 };
                //PK生成设定
                var snList = [{ name: "QZSaleDeliver", col: "DeliverNo", parm: "DeliverNo" }];
                //SN生产
                vm.NewItem.SNColumns = JSON.stringify(snList);

                vm.IsInsert = true;
            })
    }

    function SaveInsert() {
        vm.promise = AjaxService.PlanInsert("QZSaleDeliver", vm.NewItem).then(function (data) {
            vm.Ser.State = 0;
            OpenScan(data.data[0]);
            PageChange();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }

    function OpenScan(item) {
        Dialog.OpenDialog("QZSaleDeliver", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function Delete(item) {
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.PlanDelete("QZSaleDeliver", en).then(function (data) {
            var en = {};
            en.MainId = en.Id;
            en.BSN = undefined;
            AjaxService.ExecPlan("QZSaleDeliverDtl", "delete", en).then(function (data) {
                var msg = data.data[0];
                if (msg.MsgType == 'Error') {
                    showMsg(msg.Msg, false);
                }
                else {
                    PageChange();
                    toastr.success('删除成功');
                }
            })
        });
    }

    function SaveEdit(index) {
        var en = {};
        en.Id = vm.EditItem.Id;
        en.DeliverDate = vm.EditItem.DeliverDate;
        en.DeliverNum = vm.EditItem.DeliverNum;
        en.AgentNo = vm.EditItem.AgentNo;
        en.MateNo = vm.EditItem.MateNo;
        en.Remark = vm.EditItem.Remark;
        vm.promise = AjaxService.PlanUpdate("QZSaleDeliver", en).then(function (data) {
            PageChange();
            toastr.success('更新成功');
        });
    }

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("QZSaleDeliver", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("QZSaleDeliver", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.a_DeliverNo) {
            list.push({ name: "DeliverNo", value: vm.Ser.a_DeliverNo, tableAs:"a" });
        }
        if (vm.Ser.a_AgentNo) {
            list.push({ name: "AgentNo", value: vm.Ser.a_AgentNo, tableAs:"a" });
        }
        if (vm.Ser.a_DeliverDate) {
            list.push({ name: "DeliverDate", value: vm.Ser.a_DeliverDate, tableAs:"a" });
        }
        list.push({ name: "State", value: vm.Ser.State, tableAs: "a" });
        return list;
    }

    function SearchSN(item) {
        vm.SelectItem = item;
        $(".bsn-list").addClass("active");
        Search1();
    }

    vm.page.index1 =1;
    vm.page.size1 = 12;

    vm.SearchSN = SearchSN;
    vm.PageChange1 = PageChange1;
    vm.Search1 = Search1;
    vm.ExportExcel1 = ExportExcel1;

    function Search1() {
        vm.page.index1 = 1;
        PageChange1();
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("QZSaleDeliverDtlSer", GetContition1(), vm.page.index1, vm.page.size1).then(function (data) {
            console.log(data)
            vm.SNList = data.List;
            vm.page.total1 = data.Count;
        });
    }
    function ExportExcel1() {
        vm.promise = AjaxService.GetPlanOwnExcel("QZSaleDeliverDtlSer", GetContition1()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition1() {
        var list = [];
        if (vm.Ser.c_BSN) {
            list.push({ name: "BSN", value: vm.Ser.c_BSN, tableAs: "a" });
        }
        list.push({ name: "MainId", value: vm.SelectItem.Id, tableAs: "a" })
        return list;
    }

}]);
