'use strict';

angular.module('AppSet')
.controller('MOSoftCMPTApplyDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window', 'Dialog',
function ($rootScope, $scope, ItemData, $uibModalInstance, AjaxService, toastr, $window, Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Item = ItemData.ID ? angular.copy(ItemData) : { };
    vm.IsEdit = ItemData.ID ? true : false;
    vm.ChangeHitch = ChangeHitch;
    vm.OpenMO = OpenMO;
    vm.ChangeSelect = ChangeSelect;
    vm.DeleteSoft = DeleteSoft;

    //$scope.$watch(function () { return vm.Item.OpType; }, ChaneType);
    if (ItemData.ID) {
        PageChange1();
    }
    function OpenMO() {
        if (ItemData.ID) { return; }
        var en = {};
        //en.SerList = [{ name: "DocState", value: "3", type: "!=" }];
        en.SerList = [{ name: "Code", value: "202020351", type: "=", tableAs:"b" }];
        Dialog.OpenDialog("U9WorkOrderDialog", en).then(function (data) {
            vm.Item.MOData = data;
            vm.Item.WorkOrder = data.DocNo;
            vm.Item.MateCode = data.Item.Code;
            vm.Item.MateName = data.Item.Name;
            PageChange1();
        }, function (err) { })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        var list = [];
        list.push({ name: "ProCode", value: vm.Item.MateCode });
        list.push({ name: "IsEffective", value: true });
        vm.promise = AjaxService.GetPlansPage("BomMateSoftData", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            //检查选中
            for (var i = 0, len = vm.List1.length; i < len; i++) {
                for (var j = 0, len1 = vm.List.length; j < len1; j++) {
                    if (vm.List[j].ID == vm.List1[i].MateSoftID) {
                        vm.List[j].IsSelect = true;
                    }
                }
            }
            vm.page.total = data.Count;
        });
    }

    function DeleteSoft(item, index) {
        item.IsEffective = false;
        vm.List1.splice(index, 1);
        for (var j = 0, len1 = vm.List.length; j < len1; j++) {
            if (vm.List[j].ID == item.MateSoftID) {
                vm.List[j].IsSelect = false;
            }
        }
    }

    function PageChange1() {
        var list = [];
        if (ItemData.ID) {
            vm.List1 = ItemData.Dtl;
            Search();
        }
        else {
            list.push({ name: "WorkOrder", value: vm.Item.WorkOrder });
            vm.promise = AjaxService.GetPlans("MOSoftCMPT", list).then(function (data) {
                vm.List1 = data;
                Search();
            });
        }
    }

    function ChangeSelect(item) {
       

        if (item.IsSelect) {
            var en = {};
            en.IsEffective = true;
            en.MateSoftID = item.ID;
            en.SoftVersion = item.SoftVersion;
            en.CreateDate = new Date();
            vm.List1.push(en);
        }
        else {
            //添加
            var index = -1;
            for (var j = 0, len1 = vm.List1.length; j < len1; j++) {
                if (item.ID == vm.List1[j].MateSoftID) {
                    index = j;
                    break;
                }
            }
            vm.List1.splice(index, 1);
        }
    }

    function ChaneType() {
        if (!ItemData.ID) {
            vm.Item = { OpType: vm.Item.OpType, Amount: 0, RpType: '0', DocNo: vm.Item.DocNo };
        }
    }

    function ChangeHitch() {
        AjaxService.GetPlan("BcEquipmentHitch", { name: "ID", value: vm.Item.HitchID }).then(function (data) {
            vm.Item.EqData = data.EqData;
        })
    }

    //保存
    function Save(obj) {

        var en = {};
        en.ID = vm.Item.ID;
        en.WorkOrder = vm.Item.WorkOrder;
        en.MateCode = vm.Item.MateCode;
        en.MateName = vm.Item.MateName;
        en.Remark = vm.Item.Remark;
        var list = [];
        for (var j = 0, len1 = vm.List1.length; j < len1; j++) {
            if (vm.List1[j].IsEffective = true) {
                var dat = {};
                dat.SoftVersion = vm.List1[j].SoftVersion;
                dat.MateSoftID = vm.List1[j].MateSoftID;
                dat.ID = vm.List1[j].ID || -1;
                dat.MainID = vm.List1[j].MainID || -1;
                list.push(dat)
            }
        }
        en.Dtl = JSON.stringify(list);

        if (vm.Item.ID) {//编辑
            if (vm.Item.State && vm.Item.State != '0') {
                toastr.error("送审OA单据不允许修改！");
                return;
            }
            vm.promise = AjaxService.PlanUpdate("MOSoftCMPTApply", en).then(function (data) {
                if (obj == '1') {//存储并提交到OA审批
                    ToOA(vm.Item);
                } else {
                    toastr.success("保存成功");
                    $uibModalInstance.close('1');
                }
            });
        } else {
            vm.promise = AjaxService.PlanInsert("MOSoftCMPTApply", en).then(function (data) {
                if (obj == '1') {//存储并提交到OA审批
                    ToOA(data.data[0]);
                } else {
                    toastr.success("保存成功");
                    $uibModalInstance.close('1');
                }
            });
        }

    }

    function Cancel(item) {
        $uibModalInstance.close('1');
    }


    //提交流程到OA
    function ToOA(item) {
        var flowData = {};
        flowData.base = { workflowid: "MOSoftCMPTApply", isnextflow: 1, requestname: '工单软件版本兼容-MES发起' };// + $rootScope.User.ChiFirstName };
        flowData.main = {
            sqr: { transrule: "getUseridByWorkcode" },
            sqrgh: { transrule: "getWorkcodeByU9code" },
            sqrgw: { transrule: "getJobidByWorkcode" },
            ssbm: { transrule: "getDeptidByWorkcode" },
            ssgs: { transrule: "getSubcomidByWorkcode" },
            sqrq: { value: new Date($rootScope.SysTime).Format('yyyy-MM-dd') },

            u9gdh: { value: item.WorkOrder },  //U9工单号
            mesid: { value: item.ID },  //主表ID
            gdlh: { value: item.MateCode },  //工单料号
            gdlm: { value: item.MateName },  //工单料名
            //kssj: { value: new Date(item.StateTime).Format('yyyy-MM-dd hh:mm:ss') }, //故障时间
            bzsm: { value: item.Remark },  //说明

        };

        var dtlist = [];
        for (var i = 0, len = vm.List1.length; i < len; i++) {
            var endtl = getDtl(vm.List1[i]);
            dtlist.push(endtl);
        }
        flowData.dt1 = dtlist;
        var FormList = [];
        FormList.push(flowData);
        //呼叫OA接口
        var en = {};
        en.AccessCode = "OACode";
        en.Url = "OAUrl";
        en.FlowData = JSON.stringify(FormList);
        console.log(1234)
        //en.CreateBy = ""; //不提供值时默认系统登录人
        vm.promise = AjaxService.Custom("CreateWorkFlow", en).then(function (data) {
            console.log(data)
            if (data.type == "1") {
                toastr.error(data.backmsg);
            } else {
                var flag = true;
                for (var i = 0; i < data.resultlist.length; i++) {
                    if (data.resultlist[i].status == "1") {
                        flag = false;
                        toastr.error("提交至OA流程失败：" + data.resultlist[i].msg);
                        break;
                    }
                }
                if (flag) {
                    toastr.success("提交OA流程成功");
                    //获取流程单号
                    var data2 = AjaxService.GetPlanWait("OAWorkFlowData", { name: "REQUESTID", value: data.resultlist[0].requestid });
                    var enEq = {};
                    enEq.ID = item.ID;
                    enEq.State = "1";
                    enEq.OAFlowNO = data2.REQUESTMARK;
                    enEq.OAFlowID = data.resultlist[0].requestid;
                    AjaxService.PlanUpdate("MOSoftCMPTApply", enEq).then(function (data) {
                    });
                    $uibModalInstance.close('1');
                }
            }
        })
    }

    function getDtl(item) {
        var en = {};
        en.rjbb = { value: item.SoftVersion };
        en.tjsj = { value: new Date(item.CreateDate).Format('yyyy-MM-dd hh:mm:ss') };
        return en;
    }

}]);
