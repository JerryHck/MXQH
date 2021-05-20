
'use strict';
angular.module('app')
.controller('MouldModifyCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Save = Save;//保存按钮
    vm.Edit = Edit;//编辑按钮
    vm.Delete = Delete;//删除未审核变更单
    vm.Approve = Approve
    vm.Clear = Clear;//放弃/新增按钮
    vm.Modify = Modify;//变更按钮
    vm.ModifyCancel = ModifyCancel;//变更取消按钮
    vm.ModifySave = ModifySave;//变更确定按钮
    vm.IsShowModifyBtn = true;
    vm.Search = Search;
    vm.CalDailyNum = CalDailyNum;
    vm.tabIndex = 0;
    Init();
    DataBind();
    //初始化
    function Init() {
        vm.Original = {};//变更前数据
        vm.MouldInfo = {};//模具信息
        vm.Results = [];//对比结果
        vm.Cols = [];//对比数据列名集合
        vm.ModifySeg = [];//变更字段信息
        vm.IsEqual = {};
        vm.IsEdit = false;
    }
    //变更单列表 数据绑定
    function DataBind() {        
        vm.promise = AjaxService.GetPlansPage("MouldModify", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.total = data.Count;
        });
    }
    //查询
    function Search() {
        vm.promise = AjaxService.GetPlansPage("MouldModify", GetCondition(), vm.page.pageIndex, vm.page.pageSize).then(function (data) {
            vm.List = data.List;
            vm.total = data.Count;
        });
    }
    //条件
    function GetCondition() {
        var li = [];
        if (vm.Ser.Code) {
            li.push({name:"Code",value:'%'+vm.Ser.Code+'%'});
        }
        if (vm.Ser.Name) {
            li.push({ name: "Name", value: '%'+vm.Ser.Name+'%' });
        }
        return li;
    }
    //变更按钮
    function Modify() {
        if (!vm.MouldInfo.ID) {
            toastr.error('请先选择要变更的模具！');
            return;
        }
        vm.IsShowModify = true;
        GetMouldInfo(vm.MouldInfo.Code);
    }
    //保存按钮
    function Save() {
        var en = {};
        var li = [];
        en.TempColumns = "Original,ModifyData";
        en.Original = JSON.stringify([vm.Original]);
        en.ModifyData = JSON.stringify(vm.ModifySeg);
        var SNList = [{ name: "Mould", col: "Modify", parm: "DocNo", charName: null }]
        en.SNColumns = JSON.stringify(SNList);
        en.DocNo = "";
        en.CreatedBy = $rootScope.User.Name;
        vm.promise = AjaxService.ExecPlan("MouldModify", "Save", en).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                DataBind();
                vm.promise = AjaxService.ExecPlan("MouldModify", "GetDocInfo", { ID: data.data[0].ID }).then(function (data) {
                    //变更单信息
                    vm.MouldInfo.ID = data.data[0].MouldID;
                    vm.MouldInfo.DocNo = data.data[0].DocNo;
                    vm.MouldInfo.Code = data.data[0].Code;
                    vm.MouldInfo.Name = data.data[0].Name;
                    vm.MouldInfo.SPECS = data.data[0].SPECS;
                    //变更数据与原数据集合
                    vm.Results = data.data1;
                    //变更字段集合
                    vm.ModifyData = data.data2;
                    var r = angular.copy(vm.Results[0]);
                    var i = 0;
                    for (var p in r) {
                        if (typeof (r[p]) != "function") {
                            if (p.toString() == "ID" || p.toString() == "SPECS") {
                                continue;
                            }
                            vm.Cols[i] = p;
                            i = i + 1;
                        }
                    }
                    for (var i = 0; i < vm.ModifyData.length; i++) {
                        var s = angular.copy(vm.ModifyData[i].ModifySeg);
                        vm.IsEqual[s] = true;
                    }
                });
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
        
    }
    //删除未审核变更单
    function Delete() {
        console.log(vm.MouldInfo.DocNo);
        vm.promise = AjaxService.ExecPlan("MouldModify", "Delete", {DocNo: vm.MouldInfo.DocNo }).then(function (data) {
            if (data.data[0].MsgType == "1") {
                toastr.success(data.data[0].Msg);
                Init();
                DataBind();
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }
    //审核单据
    function Approve() {
        vm.promise = AjaxService.ExecPlan("MouldModify", "Approve", { DocNo: vm.MouldInfo.DocNo }).then(function (data) {
            console.log(data);
        });
    }
    //放弃按钮
    function Clear() {
        vm.MouldInfo = {};
        vm.Item = {};
        vm.Original = {};
        vm.Results = [];
        vm.IsShowModifyBtn = true;
        vm.Cols = [];
        vm.IsEqual = {};
        vm.ModifySeg = [];//变更字段信息
        vm.IsEdit = false;
    }
    //获取模具信息
    function GetMouldInfo(code) {
        vm.promise = AjaxService.ExecPlan("MouldModify", "GetDetail", { Code: code }).then(function (data) {
            var r = data.data[0];
            r.CreateDate = r.CreateDate.replace('T', ' ');
            r.DealDate = new Date(r.DealDate).toLocaleDateString();
            r.EffectiveDate = new Date(r.EffectiveDate).toLocaleDateString();
            vm.Item = r;
            vm.Original = angular.copy(r);//保留原始料品信息，以备对比变更数据
        });
    }

    //取消按钮
    function ModifyCancel() {
        vm.IsShowModify = false;
        vm.Item = {};
    }
    //查看变更单
    function Edit(id) {
        vm.IsEdit = true;
        vm.IsShowModifyBtn = false;
        changeTab(1);
        GetTableInfo();
        vm.promise = AjaxService.ExecPlan("MouldModify", "GetDocInfo", { ID: id }).then(function (data) {
            //变更单信息
            vm.MouldInfo.ID = data.data[0].MouldID;
            vm.MouldInfo.DocNo = data.data[0].DocNo;
            vm.MouldInfo.Code = data.data[0].Code;
            vm.MouldInfo.Name = data.data[0].Name;
            vm.MouldInfo.SPECS = data.data[0].SPECS;
            //变更数据与原数据集合
            vm.Results = data.data1;
            //变更字段集合
            vm.ModifyData = data.data2;            
            var r = angular.copy(vm.Results[0]);
            for (var i = 0; i < vm.ModifyData.length; i++) {
                var s = angular.copy(vm.ModifyData[i].ModifySeg);
                var v = angular.copy(vm.ModifyData[i].DataAfterModify);
                vm.Results[1][s] = v;
                vm.IsEqual[s] = true;
            }
            var i = 0;
            for (var p in r) {
                if (typeof (r[p]) != "function") {
                    if (p.toString() == "ID" || p.toString() == "SPECS") {
                        continue;
                    }
                    vm.Cols[i] = p;
                    i = i + 1;
                }
            }
         
        });
    }
    //var func=
    function GetTableInfo() {
        vm.KV = {
            CreateBy: '创建人', CreateDate: '创建日期', Code: '料号', Name: '品名', SPECS: '规格', HoleNum: '穴数',
            TotalNum: '总次数(K)', DailyCapacity: '日产能', DailyNum: '日模次', RemainNum: '剩余模次', Holder: '使用委外商', Manufacturer: '制造厂商',
            CycleTime: '成型周期(s)', DealDate: '购买日期', ProductWeight: '产品重量(g)', NozzleWeight: '水口重量(g)', EffectiveDate: '启用日期', Remark: '备注'
        };
        vm.Style = {
            CreateBy: '100px'
            , CreateDate: '120px', Code: '100px', Name: '120px', SPECS: '200px', HoleNum: '60px',
            TotalNum: '100px', DailyCapacity: '80px', DailyNum: '80px', RemainNum: '100px', Holder: '140px', Manufacturer: '140px',
            CycleTime: '120px', DealDate: '120px', ProductWeight: '120px', NozzleWeight: '120px', EffectiveDate: '120px', Remark: '200px'
        };
    }
    //保存变更结果
    function ModifySave() {
        vm.IsShowModify = false;
        vm.Results = [];
        var modifyData = {};
        var flag = false;//是否有数据变更
        GetTableInfo();
        var i = 0;
        for (var p in vm.Original) {           
            if (typeof (vm.Original[p]) != "function") {
                if (p.toString()=="ID"||p.toString()=="SPECS") {
                    continue;
                }
                vm.Cols[i] = p;
                i = i + 1;
                if (vm.Original[p] == vm.Item[p]) {
                    vm.IsEqual[p] = false;
                } else {
                    modifyData.ModifySeg = p;
                    modifyData.DataBeforeModify = vm.Original[p];
                    modifyData.DataAfterModify = vm.Item[p];
                    var m = angular.copy(modifyData);
                    vm.ModifySeg.push(m);//保存变更字段信息
                    vm.IsEqual[p] = true;
                    flag = true;
                }
            }            
        }
        if (!flag) {
            toastr.error('数据没有变动！');
            return;
        }
        vm.Results.push(angular.copy(vm.Original));
        vm.Results.push(angular.copy(vm.Item));
    }

    //根据日产能计算日模次
    function CalDailyNum() {
        vm.Item.DailyNum = Math.ceil(vm.Item.DailyCapacity / 22.00);
    }

    function changeTab(index) {
        vm.tabIndex = index;
    }

}
])