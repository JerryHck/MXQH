'use strict';
angular.module('app')
.controller('EquipmentHitchDialogCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window','$uibModalInstance','ItemData',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window, $uibModalInstance,ItemData) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.Ser = {};
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Item = ItemData.ID ? ItemData : { Status: 0 };
    vm.IsEdit = ItemData.ID ? true : false;
    Init();
    function Init() {
        if (ItemData.ID) {

        } else {
            GetDocNo();
        }
    }

    //保存
    function Save(obj) {
        
        var en = {};
        en.ID = vm.Item.ID;
        en.EqID = vm.Item.EqData.ID;
        en.HitchTime = vm.Item.HitchTime;
        en.HitchDesc = vm.Item.HitchDesc;
       

        if (vm.Item.ID) {//编辑
            if (vm.Item.State && vm.Item.State != '0') {
                toastr.error("送审OA单据不允许修改！");
                return;
            }
            vm.promise = AjaxService.PlanUpdate("BcEquipmentHitch", en).then(function (data) {
                AjaxService.PlanUpdate("BcEquipment", { ID: en.EqID, State: '2' }).then(function (data2) {
                    if (obj == '1') {//存储并提交到OA审批
                        ToOA(vm.Item.EqData, vm.Item);
                    } else {
                        toastr.success("保存成功");
                        $uibModalInstance.close('1');
                    }
                })
            });
        } else {

            if (vm.Item.EqData.State == '2') {
                toastr.error("设备已经报障，不允许重复报障！");
                return;
            }
            if (vm.Item.EqData.State == '3') {
                toastr.error("设备维修中，不允许重复报障！");
                return;
            }
            if (vm.Item.EqData.State == '3') {
                toastr.error("设备已经报废，不允许报障！");
                return;
            }

            var SNList = [{ name: "BcEquipmentHitch", col: "DocNo", parm: "DocNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.DocNo = "";
            vm.promise = AjaxService.PlanInsert("BcEquipmentHitch", en).then(function (data) {
                AjaxService.PlanUpdate("BcEquipment", { ID: en.EqID, State: '2' }).then(function (data2) {
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
        var en = { TbName: "BcEquipmentHitch", ClName: "DocNo", CharName: null };
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
        flowData.base = { workflowid: "OAEquipmentHitchCode", isnextflow: 1, requestname: '设备报障单-MES发起' };// + $rootScope.User.ChiFirstName };
        flowData.main = {
            sqr: { transrule: "getUseridByWorkcode" },
            sqrgh: { transrule: "getWorkcodeByU9code" },
            sqrgw: { transrule: "getJobidByWorkcode" },
            ssbm: { transrule: "getDeptidByWorkcode" },
            ssgs: { transrule: "getSubcomidByWorkcode" },
            sqrq: { value: new Date($rootScope.SysTime).Format('yyyy-MM-dd') },

            bzdh: { value: item.DocNo },  //报障单号
            mesid: { value: item.ID },  //报障单号
            sbxxzbid: { value: eqData.ID },  //设备信息主表ID
            gzsj: { value: new Date(item.HitchTime).Format('yyyy-MM-dd hh:mm:ss') }, //故障时间
            gzms: { value: item.HitchDesc },  //故障描述
            bzsm: { value: item.Remark },  //备注说明
            sbbm: { value: eqData.Code },  //设备编码
            sbmc: { value: eqData.Name },  //设备名称
            sblx: { value: eqData.TypeCode },  //设备类型
            sbpp: { value: eqData.Brand },  //设备品牌
            grfy: { value: eqData.BuyAmount },  //购入费用
            grsj: { value: new Date(eqData.BuyTime).Format('yyyy-MM-dd hh:mm:ss') }, //购入时间
            sybm: { value: eqData.UseDept },  //使用部门
            glbm: { value: eqData.Dept },  //管理部门
            cfwz: { value: eqData.Location },  //存放位置
            sbzt: { value: eqData.State },  //设备状态
            gys: { value: eqData.VenderName },  //供应商
            u9kpbm: { value: eqData.U9CardCode },  //U9卡片编码
            bz: { value: eqData.Remark },  //U9卡片编码
           
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
                    AjaxService.PlanUpdate("BcEquipmentHitch", enEq).then(function (data) {
                    });
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

}
])