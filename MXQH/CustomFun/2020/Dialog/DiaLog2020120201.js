'use strict';

angular.module('AppSet')
.controller('U9LLChangeDialog', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.InItem = ItemData;
    vm.IsCha = false;
    vm.OK = OK;
    vm.Cancel = Cancel;
    vm.KeyDonwOrder = KeyDonwOrder;
    vm.Save = Save;

    vm.op = {
        //mask:'9999/19/39 29:59',
        format: 'Y-m-d H:i',
        step: 30,
        timepickerScrollbar: false,
        //startDate: new Date(),
        beforeShowDay: function (date) {
            var now = new Date((new Date().Format('yyyy-MM-dd')));
            if (date < now) {
                return [false, ""]
            }
            return [true, ""];
        }
    };


    GetData(vm.InItem.PickDocNo, 'S');
    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.ThisForm.DocNo) {
            GetData(vm.ThisForm.DocNo, 'G');
        }
    }

    function GetData(docNo, type) {
        if (!docNo) return;
        var en = {};
        en.DocNo = docNo;
        en.SerType = type;
        vm.promise = AjaxService.ExecPlan("U9MOIssueDocCheck", "getLL", en).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                toastr.error(data.data[0].MsgText);
                vm.ThisForm = {};
                vm.DtlList = [];
            }
            else if (data.data[0].MsgType == "Success") {
                if (type == 'S') {
                    vm.ThisForm = data.data1[0];
                    vm.DtlList = data.data2;
                    vm.ThisForm.Remark = vm.InItem.Remark;
                    vm.ThisForm.NeedTime = vm.InItem.NeedTime;
                }
                else if (type != 'S') {
                    AjaxService.GetPlan("WMSPicking", { name: "PickDocID", value: data.data1[0].ID }).then(function (data2) {
                        if (data2.ID) {
                            toastr.error('单据【' + docNo + '】已经在【' + data.RegTime + '】进行过确认登记');
                            vm.ThisForm = {};
                            vm.DtlList = [];
                        }
                        else {
                            vm.ThisForm = data.data1[0];
                            vm.ThisForm.NeedTime = vm.ThisForm.BusinessCreatedOn;
                            vm.DtlList = data.data2;
                            toastr.success("单据扫描成功");
                        }
                    })
                }
            }
        });
    }

    //保存并提交OA
    function Save() {
        var en = {};
        en.PickID = vm.ThisForm.ID;
        en.FlowState = 2;   //默认通过
        en.OriNeedTime = vm.ThisForm.NeedTime;
        en.DocType = vm.ChaData.DocType;
        en.NeedTime = vm.ChaData.NeedTime;
        en.Remark = vm.ChaData.Remark;

        en.PickDocID = vm.ThisForm.ID;
        en.PickDocNo = vm.ThisForm.DocNo;
        en.WorkOrder = vm.ThisForm.WorkOrder;
        en.MateCode = vm.ThisForm.MOMateCode;
        en.MateName = vm.ThisForm.MOMateName;
        en.MateSpecs = vm.ThisForm.MOMateSPECS;
        en.RegTime = vm.ThisForm.RegTime;
        en.StPreTime = vm.ThisForm.StPreTime;

        vm.promise = AjaxService.PlanInsert("WMSPickFlow", en).then(function (data) {
            //console.log(data);
            ToOA(data.data[0]);
        });
    }


    function ToOA(data) {
        var flowData = {};
        flowData.base = { workflowid: "OALLChangeCode", isnextflow: 1, requestname: '领料单发料变更' };// + $rootScope.User.ChiFirstName };
        flowData.main = {
            sqr: { transrule: "getUseridByWorkcode" },
            sqrgh: { transrule: "getWorkcodeByU9code" },
            sqrgw: { transrule: "getJobidByWorkcode" },
            ssbm: { transrule: "getDeptidByWorkcode" },
            ssgs: { transrule: "getSubcomidByWorkcode" },
            sqrq: { value: new Date($rootScope.SysTime).Format('yyyy-MM-dd') },
            //u9zz: { value: "1001708020135665" },  //u9组织 --固定300
            //ismes: { value: "1" },  //是否是MES发起  1 是
            mesid: { value: data.ID }, //MES表ID字段
            csxqsj: { value: (new Date(data.OriNeedTime)).Format("yyyy-MM-dd hh:mm") }, //初始需求日期
            bghxqsj: { value: (new Date(data.NeedTime)).Format("yyyy-MM-dd hh:mm") }, //变更后需求时间
            bgsx: { value: data.DocType },
            lldh: { value: data.PickDocNo },
            gd: { value: data.WorkOrder },
            ph: { value: data.MateCode },
            pm: { value: data.MateName },
            gg: { value: "123124" },
            //test:{value:"asdfasdasdfas"},
            ckdjsj: { value: (new Date(data.RegTime)).Format("yyyy-MM-dd hh:mm") },
            ksblsj: { value: (new Date(data.StPreTime)).Format("yyyy-MM-dd hh:mm") },
            bgyy: { value: data.Remark },
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
                        toastr.error("保存成功，但提交至OA流程失败：" + data.resultlist[i].msg);
                        break;
                    }
                }
                if (flag) {
                    toastr.success("变更成功, 并提交OA流程成功");
                    $uibModalInstance.close(true);
                }
            }
        })
    }

    function OK(item) {
        $uibModalInstance.close(vm.IsCha);
    }
    function Cancel() {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(vm.IsCha);
    }

}]);
