'use strict';

angular.module('app')
.controller('QCCheckCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window', 'MyPop',
function ($rootScope, $scope, $http, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.pageDetail = { index: 1, size: 10 };
    vm.Ser = {};
    vm.tabIndex = 0;
    vm.PageChange = PageChange;//QC登记列表
    vm.Search = Search;//QC列表查询功能
    vm.Edit = Edit;//编辑QC信息详情
    vm.pageDetailChange = pageDetailChange;
    vm.Insert = Insert;//新增
    vm.Save = Save;//保存
    vm.Cancel = Cancel;//取消
    vm.ChangeTab = ChangeTab;
    vm.FnEnter = FnEnter;
    vm.SelectSN = SelectSN;
    vm.CheckSNCode = CheckSNCode;
    vm.SNConfirm = SNConfirm;
    vm.SNDelete = SNDelete;
    Init();
    PageChange();
    function FnEnter(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            vm.IsMI = true;//手否手动输入
            vm.PalletCode = vm.Item.PalletCode;
            pageDetailChange();
        }
    }

    //自动生成订单号
    function GetListNo() {
        var en = { TbName: "OQC", ClName: "DocNo", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.DocNo = data.data[0].SN;
        })
    }
    //QC列表查询功能
    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    function Init() {
        vm.PalletCode = null;
        vm.Item = { IsOK: "1", CheckNum: 0 };
        vm.DetailList = [];//栈板号的SN校验记录
        vm.SNItem = { IsCheckOk: "1" };//扫码区实体
        vm.MOItem = { IsOK: "1" };
        vm.CanEdit = false;
        GetListNo();
    }
    //新增
    function Insert() {
        Init();
        ChangeTab(1);
    }
    //保存QC登记记录
    function Save() {
        var en = {};
        var liMain = [];        
        en.TempColumns = "Main,DetailList";
        vm.Item.ID = vm.Item.ID == undefined ? -1 : vm.Item.ID;
        vm.Item.ProblemType = vm.Item.ProblemType == undefined ? '' : vm.Item.ProblemType;
        vm.Item.ProblemInfo = vm.Item.ProblemInfo == undefined ? '' : vm.Item.ProblemInfo;
        vm.Item.ProblemDesp = vm.Item.ProblemDesp == undefined ? '' : vm.Item.ProblemDesp
        vm.Item.CustomOrder = vm.MOItem.CustomerOrder == undefined ? '' : vm.MOItem.CustomerOrder
        vm.Item.CheckUser = $rootScope.User.Name;
        vm.DetailList[0].Item1 = vm.DetailList[0].Item1 == undefined ? '' : vm.DetailList[0].Item1
        liMain.push(vm.Item);
        en.Main = JSON.stringify(liMain);
        en.DetailList = JSON.stringify(vm.DetailList);
        if (vm.Item.ID.toString()=='-1') {
            var SNList = [{ name: "OQC", col: "DocNo", parm: "OQCDocNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.OQCDocNo = "";
        }
        vm.promise = AjaxService.ExecPlan("QCChcek", "Save", en).then(function (data) {
            Init();
        });
    }
   
    //取消
    function Cancel() {
        pageDetailChange();
    }
    //QC登记列表
    function PageChange() {
        GetContition();
        vm.promise = AjaxService.ExecPlan("QCChcek", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }
    //QC查询条件
    function GetContition() {
        vm.page.CustomOrder = vm.Ser.CustomOrder == undefined ? '' : vm.Ser.CustomOrder;
        vm.page.PalletCode = vm.Ser.PalletCode == undefined ? '' : vm.Ser.PalletCode;
        vm.page.WorkOrder = vm.Ser.WorkOrder == undefined ? '' : vm.Ser.WorkOrder;
    }
    //tab切换
    function ChangeTab(index) {
        vm.tabIndex = index;
        if (vm.tabIndex == 0) {
            PageChange();
        } else {
            pageDetailChange();
        }
    }
    //获取QC登记信息详情
    function Edit(palletCode) {
        vm.tabIndex = 1;
        vm.IsMI = false;
        vm.PalletCode = palletCode;
        vm.SNItem = { IsCheckOk: "1" };
    }
    //获取QC登记详情
    function pageDetailChange() {
        if (!vm.PalletCode) {
            return;
        }
        GetDetailCondition();
        vm.promise = AjaxService.ExecPlan("QCChcek", "GetDetail", vm.pageDetail).then(function (data) {
            var flag = false;
            if (vm.IsMI) {//手动输入栈板号
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else if (data.data[0].MsgType == "2") {
                    MyPop.ngConfirm({ text: data.data[0].Msg }).then(function (result) {
                        vm.CanEdit = true;//栈板号输入框变成不可编辑
                        vm.DetailList = data.data3;
                        vm.MOItem = data.data1[0];
                        vm.Item = data.data2[0];
                    });
                } else {
                    vm.CanEdit = true;//栈板号输入框变成不可编辑
                    vm.MOItem = data.data1[0];
                    vm.Item.CustomOrder = data.data1[0].CustomerOrder;
                    vm.IsAdd = true;
                }
            } else {//编辑按钮跳转过来的
                //flag = true;
                vm.CanEdit = true;//栈板号输入框变成不可编辑
                vm.DetailList = data.data3;
                vm.MOItem = data.data1[0];
                vm.Item = data.data2[0];
            }
        });
    }

    function GetDetailCondition() {
        vm.pageDetail.PalletCode = vm.PalletCode;
    }
    //选择SN
    function SelectSN(item) {
        var sn = angular.copy(item);
        vm.SNItem.ID = sn.ID;
        vm.SNItem.SNCode = sn.SNCode;
        vm.SNItem.InternalCode = sn.InternalCode;
        vm.SNItem.IsCheckOk = sn.IsCheckOk == true ? "1" : "0";
        vm.SNItem.Item1 = sn.Item1 //== null ? '' : vm.sn.Item1;;
        vm.SNItem.Remark = sn.Remark//==null?'':vm.sn.Remar;k
        vm.SNItem.ProductName = sn.ProductName;
        vm.SNItem.ProductCode = sn.ProductCode;
    }
    //编辑SN编码
    function SNConfirm() {
        var item = angular.copy(vm.SNItem);
        var flag = false;
        for (var i = 0; i < vm.DetailList.length; i++) {
            if (vm.DetailList[i].SNCode == item.SNCode) {
                if (vm.DetailList[i].InternalCode == item.InternalCode) {
                    vm.DetailList[i].ID = item.ID;
                    vm.DetailList[i].InternalCode = item.InternalCode;
                    vm.DetailList[i].IsCheckOk = item.IsCheckOk == "1" ? true : false;
                    vm.DetailList[i].Item1 = item.Item1;
                    vm.DetailList[i].Remark = item.Remark;
                    vm.DetailList[i].SNCode = item.SNCode;
                    vm.DetailList[i].ProductCode = item.ProductCode;
                    vm.DetailList[i].ProductName = item.ProductName;
                    flag = true;
                }
                return;
            }
        }
        if (!flag) {
            toastr.error("校验记录中不存在此编码，无法修改！");
        } 
    }
    //删除SN编码
    function SNDelete() {
        for (var i = 0; i < vm.DetailList.length; i++) {
            if (vm.DetailList[i].ID == vm.SNItem.ID) {
                vm.DetailList.splice(i, 1);
                vm.Item.CheckNum = parseInt(vm.Item.CheckNum) - 1;
                break;
            }
        }
        vm.SNItem = {};
    }
    //检测SN编码
    function CheckSNCode(e, sncode) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            SNAdd(sncode);
        }
    }
    //新增SN编码
    function SNAdd(sncode) {
        var code = sncode;
        var isExist = false;//是否已经在“检验记录”中，若不在，则检测数量+1，否则不加
        vm.promise = AjaxService.ExecPlan("QCChcek", "Exist", { PalletCode: vm.PalletCode, SNCode: code }).then(function (data) {
            if (data.data[0].MsgType == "0") {
                vm.SNItem = {};
                vm.SNItem.SNCode = code;
                toastr.error(data.data[0].Msg);
            } else {
                var item = angular.copy(data.data1[0]);
                item.IsCheckOk = item.IsCheckOk == "1" ? true :false;
                for (var i = 0; i < vm.DetailList.length; i++) {
                    if (vm.DetailList[i].SNCode == code) {
                        vm.DetailList[i].ID = item.ID;
                        vm.DetailList[i].InternalCode = item.InternalCode;
                        vm.DetailList[i].IsCheckOk = item.IsCheckOk;
                        vm.DetailList[i].Item1 = item.Item1;
                        vm.DetailList[i].Remark = item.Remark;
                        vm.DetailList[i].SNCode = item.SNCode;
                        vm.DetailList[i].ProductCode = item.ProductCode;
                        vm.DetailList[i].ProductName = item.ProductName;
                        isExist = true;
                        toastr.success('['+vm.PalletCode + ']添加成功!');
                        vm.SNItem = { IsCheckOk: "1" };
                        return;
                    }
                }
                if (!isExist) {
                    vm.DetailList.push(item);
                    vm.Item.CheckNum = parseInt(vm.Item.CheckNum) + 1;
                    toastr.success('['+vm.PalletCode+']添加成功!');
                }
            }
            vm.SNItem = { IsCheckOk: "1" };
        });
    }
}]);
