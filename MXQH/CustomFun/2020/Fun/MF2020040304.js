'use strict';

angular.module('app')
.controller('QZSOCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window','Dialog',
function ($rootScope, $scope, $http, AjaxService, toastr, $window,Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.pageDetail = { index: 1, size: 10 };
    vm.Ser = {Status:0};
    vm.ExportExcel1 = ExportExcel1;
    vm.PageChange1 = PageChange1;
    vm.Search1 = Search1;
    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.SaveEdit = SaveEdit;
    vm.PageChange = PageChange;
    vm.Search = Search;
    //vm.ExportExcel = ExportExcel;
    vm.OpenScan = OpenScan;
    vm.SOAgent = {};
    vm.MaterialInfo = {};
    vm.StatusList = [{ Status: 0, Name: '开立' }, { Status: 1, Name: '关闭' }];
    vm.SelectItem = SelectItem;//查看完成销售单明细
    

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
            vm.Ser = { Status: 0 };
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
        en.CreateBy = vm.EditItem.CreateBy;
        en.CreateDate = vm.EditItem.CreateDate;
        en.DeliverDate = vm.EditItem.DeliverDate;
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
    //function ExportExcel() {
    //    vm.promise = AjaxService.GetPlanOwnExcel("QZSO", GetContition()).then(function (data) {
    //        $window.location.href = data.File;
    //    });
    //}
    function GetContition() {
        var list = [];
        list.push({name:"Status",value:vm.Ser.Status});
        if (vm.Ser.a_MaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser.a_MaterialCode, tableAs: "a" });
        }
        if (vm.Ser.DocNo) {
            list.push({ name: "DocNo", value: vm.Ser.DocNo, tableAs: "a" });
        }
        if (vm.Ser.DeliverDate) {
            list.push({ name: "DeliverDate", value: vm.Ser.DeliverDate, tableAs: "a" });
        }
        return list;
    }

    function OpenScan(item) {
        Dialog.OpenDialog("QZSODetail", item).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }

    function SelectItem(item) {
        vm.SelectedItem = item;
        $(".bsn-list").addClass("active");
        Search1();
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("QZSODetail", GetCondition1(), vm.pageDetail.index, vm.pageDetail.size).then(function (data) {
            vm.SNList = data.List;
            vm.pageDetail.total = data.Count;
        });
    }

    function GetCondition1() {
        var list = [];
        if (vm.SerBSN) {
            list.push({ name: "BSN", value: vm.SerBSN });
        }
        list.push({ name: "SOID", value: vm.SelectedItem.ID });
        return list;
    }

    function Search1() {
        vm.pageDetail.index = 1;
        PageChange1();
    }
    function ExportExcel1() {
        vm.pageDetail.size = 1000000;
        vm.promise = AjaxService.GetPlanOwnExcel("QZSODetail", GetCondition1()).then(function (data) {
            vm.pageDetail.size = 10;
            $window.location.href = data.File;
        });
    }

}]);
