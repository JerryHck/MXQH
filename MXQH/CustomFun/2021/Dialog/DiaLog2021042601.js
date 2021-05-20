'use strict';

angular.module('AppSet')
.controller('EquipmentRpDialogCtrl', ['$rootScope','$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Item = ItemData.ID ? ItemData : { OpType: '1', Amount: 0, RpType:'0' };
    vm.IsEdit = ItemData.ID ? true : false;
    vm.ChangeHitch = ChangeHitch;

    $scope.$watch(function () { return vm.Item.OpType; }, ChaneType);

    console.log(ItemData);

    Init();
    function Init() {
        if (ItemData.ID) {

        } else {
            GetDocNo();
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
        en.OpType = vm.Item.OpType;
        en.EqID = vm.Item.EqData.ID;
        en.HitchID = vm.Item.HitchID;
        en.StartTime = vm.Item.StartTime;
        en.Amount = vm.Item.Amount;
        en.ChargePer = vm.Item.ChargePer;
        en.Remark = vm.Item.Remark;
        en.Reason = vm.Item.Reason;
        en.RpType = vm.Item.RpType;

        if (vm.Item.ID) {//编辑
            if (vm.Item.State && vm.Item.State != '0') {
                toastr.error("送审OA单据不允许修改！");
                return;
            }
            vm.promise = AjaxService.PlanUpdate("BcEquipmentRp", en).then(function (data) {
                AjaxService.PlanUpdate("BcEquipment", { ID: en.EqID, State: '3' }).then(function (data2) {
                    if (obj == '1') {//存储并提交到OA审批
                        ToOA(vm.Item.EqData, vm.Item);
                    } else {
                        toastr.success("保存成功");
                        $uibModalInstance.close('1');
                    }
                })
            });
        } else {
            var SNList = [{ name: "BcEquipmentRp", col: "DocNo", parm: "DocNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.DocNo = "";
            vm.promise = AjaxService.PlanInsert("BcEquipmentRp", en).then(function (data) {
                AjaxService.PlanUpdate("BcEquipment", { ID: en.EqID, State: '3' }).then(function (data2) {
                    if (obj == '1') {//存储并提交到OA审批
                        ToOA(vm.Item.EqData, data.data[0]);
                    } else {
                        toastr.success("保存成功");
                        $uibModalInstance.close('1');
                    }
                })
            });
        }

    }

    //自动生成计划序号
    function GetDocNo() {
        var en = { TbName: "BcEquipmentRp", ClName: "DocNo", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.DocNo = data.data[0].SN;
        })
    }


    function Cancel(item) {
        $uibModalInstance.close('1');
    }


    //提交流程到OA
    function ToOA(eqData, item) {
        var flowData = {};
        flowData.base = { workflowid: "OAEquipmentApplyCode", isnextflow: 1, requestname: '设备保养/维修申请-MES发起' };// + $rootScope.User.ChiFirstName };
        flowData.main = {
            sqr: { transrule: "getUseridByWorkcode" },
            sqrgh: { transrule: "getWorkcodeByU9code" },
            sqrgw: { transrule: "getJobidByWorkcode" },
            ssbm: { transrule: "getDeptidByWorkcode" },
            ssgs: { transrule: "getSubcomidByWorkcode" },
            sqrq: { value: new Date($rootScope.SysTime).Format('yyyy-MM-dd') },

            bywxsqdh: { value: item.DocNo },  //申请单号
            mesid: { value: item.ID },  //报障单号
            sbid: { value: eqData.ID },  //设备信息主表ID
            kssj: { value: new Date(item.StateTime).Format('yyyy-MM-dd hh:mm:ss') }, //故障时间
            lx: { value: item.OpType },  //类型
            yy: { value: item.Reason },  //原因
            fy: { value: item.Amount },  //费用
            zrr: { value: item.ChargePer },  //责任人
            wxlx: { value: item.RpType },  //维修类型

            //gzms: { value: item.HitchDesc },  //故障描述
            //bzsm: { value: eqData.Remark },  //备注说明
            sbbm: { value: eqData.Code },  //设备编码
            sbmc: { value: eqData.Name },  //设备名称
            //sblx: { value: eqData.TypeCode },  //设备类型
            sbpp: { value: eqData.Brand },  //设备品牌
            grfy: { value: eqData.BuyAmount },  //购入费用
            grsj: { value: new Date(eqData.BuyTime).Format('yyyy-MM-dd hh:mm:ss') }, //购入时间
            sybm: { value: eqData.UseDept },  //使用部门
            glbm: { value: eqData.Dept },  //管理部门
            cfwz: { value: eqData.Location },  //存放位置
            sbzt: { value: eqData.State },  //设备状态
            gys: { value: eqData.VenderName },  //供应商
            u9kpbm: { value: eqData.U9CardCode },  //U9卡片编码
            sm: { value: item.Remark },  //说明

        };
        //flowData.dt1 = dtlist;
        var FormList = [];
        FormList.push(flowData);
        //呼叫OA接口
        var en = {};
        en.AccessCode = "OACode";
        en.Url = "OAUrl";
        en.FlowData = JSON.stringify(FormList);

        //en.CreateBy = ""; //不提供值时默认系统登录人
        vm.promise = AjaxService.Custom("CreateWorkFlow", en).then(function (data) {
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
                    AjaxService.PlanUpdate("BcEquipmentRp", enEq).then(function (data) {
                    });
                    //更新报障单状态
                    if (item.OpType == '1') {
                        AjaxService.PlanUpdate("BcEquipmentHitch", { ID: item.HitchID, IsRp: true })
                    }

                    $uibModalInstance.close('1');
                }
            }
        })
    }

    function getDtl(item) {
        var en = {};
        en.mesid = { value: item.DtlID };
        return en;
    }

}]);
