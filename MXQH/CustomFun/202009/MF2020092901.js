'use strict';

angular.module('AppSet')
.controller('WorkOrderPlanDiffCtrl', ['$rootScope', '$scope', 'Dialog', 'AjaxService', 'toastr', '$window','MyPop',
function ($rootScope, $scope, Dialog, AjaxService, toastr, $window, MyPop) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.OpenHis = OpenHis;
    vm.SaveCompare = SaveCompare;
    vm.DeleteCompare = DeleteCompare;
    vm.ToOAFlow = ToOAFlow;
    vm.PageCheckChange = PageCheckChange;
    vm.AllCheckChange = AllCheckChange;
    vm.OpenOAUrl = OpenOAUrl;

    GetLatestVer({});
    function GetLatestVer(en) {
        AjaxService.GetPlansTop("WorkOrderPlanDiff", en, 1).then(function (data) {
            if (data[0]) {
                vm.VerData = data[0];
                Search();
                Search1();
            }
        })
    }

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function SaveCompare() {
        var en = { ID: vm.VerData.ID, IsCompare: true };
        vm.promise = AjaxService.PlanUpdate("WorkOrderPlanDiff", en).then(function (data) {
            toastr.success("保存成功");
            GetLatestVer({ name: "ID", value: vm.VerData.ID });

        })
    }

    function DeleteCompare() {
        MyPop.ngConfirm({ text: '确定要删除本比对版本吗？' }).then(function (data1) {
            var en = { MainID: vm.VerData.ID };
            vm.promise = AjaxService.ExecPlan("WorkOrderPlanDiff", "delete", en).then(function (data) {
                //console.log(data)
                if (data.data[0].MsgType == "Success") {
                    GetLatestVer({});
                }
                else {
                    toastr.error(data.data[0].MsgText);
                }
            })
        })
    }

    function PageChange() {

        if (!vm.U9List || vm.U9List.length == 0) {
            AjaxService.GetPlansWait
        }

        vm.promise = AjaxService.GetPlansPage("WorkOrderPlanDiffErr", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });

        


    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("WorkOrderPlanDiffErr", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        list.push({ name: "MainID", value: vm.VerData.ID })
        if (vm.Ser.bProduceDate) {
            list.push({ name: "ProduceDate", value: vm.Ser.bProduceDate, tableAs:"b" });
        }
        return list;
    }

    function OpenHis() {
        Dialog.OpenDialog("WOPlanImportDiff", vm.VerData).then(function (data) {
            vm.VerData = data;
            Search();
            Search1();
        }, function (data) { })
    }


    vm.page1 = { index: 1, size: 12 };
    vm.Ser1 = {};

    vm.PageChange1 = PageChange1;
    vm.Search1 = Search1;
    vm.ExportExcel1 = ExportExcel1;

    function Search1() {
        vm.page1.index = 1;
        vm.IsPage = false;
        vm.IsAll = false;
        PageChange1();
    }

    function PageChange1() {
        vm.promise = AjaxService.GetPlansPage("WorkOrderPlanDiffU9", GetContition1(), vm.page1.index, vm.page1.size).then(function (data) {
            vm.List1 = data.List;
            AllCheckChange();
            vm.page1.total = data.Count;
            $(".table-basic").freezeTable();
            $(".table-scrollable").freezeTable({
                'scrollable': true,
            });
        });

    }
    function ExportExcel1() {
        vm.promise = AjaxService.GetPlanOwnExcel("WorkOrderPlanDiffU9", GetContition1()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition1() {
        var list = [];
        list.push({ name: "MainID", value: vm.VerData.ID });
        list.push({ name: "IsToU9", value: vm.Ser1.IsToU9 })
        if (vm.Ser1.aWorkOrder) {
            list.push({ name: "WorkOrder", value: vm.Ser1.aWorkOrder, tableAs: "a" });
        }
        if (vm.Ser1.aMaterialCode) {
            list.push({ name: "MaterialCode", value: vm.Ser1.aMaterialCode, tableAs: "a" });
        }
        if (vm.Ser1.aLine) {
            list.push({ name: "Line", value: vm.Ser1.aLine, tableAs: "a" });
        }
        if (vm.Ser1.aMaterialName) {
            list.push({ name: "MaterialName", value: vm.Ser1.aMaterialName, tableAs: "a" });
        }
        if (vm.Ser1.aMRPType) {
            list.push({ name: "MRPType", value: vm.Ser1.aMRPType, tableAs: "a" });
        }
        if (vm.Ser1.OAFlowNO) {
            list.push({ name: "OAFlowNO", value: vm.Ser1.OAFlowNO, tableAs: "a" });
        }
        return list;
    }

    function PageCheckChange() {
        for (var i = 0, len = vm.List1.length; i < len; i++) {
            vm.List1[i].isCheck = vm.IsPage;
        }
    }

    function AllCheckChange() {
        for (var i = 0, len = vm.List1.length; i < len; i++) {
            vm.List1[i].isCheck = vm.IsAll == true;
        }
    }

    function ToOAFlow() {

        var MainList = [], ToCheck = [];
        //获取列表信息
        if (vm.IsAll) {
            MyPop.ngConfirm({ text: '确定要把本比对版本的所有差异都提交OA工单变更流程吗？' }).then(function (data1) {
                vm.promise = AjaxService.GetPlans("WorkOrderPlanDiffU9", GetContition1()).then(function (data) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (data[i].IsToU9 == 0) {
                            MainList.push(data[i]);
                            var en = { RowNo: data[i].RowNo, WorkOrder: data[i].WorkOrder, MOID: data[i].MOID, DtlID: data[i].DtlID, MainID: data[i].MainID };
                            ToCheck.push(en);
                        }
                    }
                    CheckData(MainList, ToCheck);
                });
            })
        }
        else if (vm.IsPage) {
            MyPop.ngConfirm({ text: '确定要把本页的差异都提交OA工单变更流程吗？' }).then(function (data1) {
                for (var i = 0, len = vm.List1.length; i < len; i++) {
                    if (vm.List1[i].IsToU9 == 0) {
                        MainList.push(vm.List1[i]);
                        var en = { RowNo: vm.List1[i].RowNo, WorkOrder: vm.List1[i].WorkOrder, MOID: vm.List1[i].MOID, DtlID: vm.List1[i].DtlID, MainID: vm.List1[i].MainID };
                        ToCheck.push(en);
                    }
                }
                CheckData(MainList, ToCheck);
            })
        }
        else {
            MyPop.ngConfirm({ text: '确定要把选中的差异项都提交OA工单变更流程吗？' }).then(function (data1) {
                for (var i = 0, len = vm.List1.length; i < len; i++) {
                    if (vm.List1[i].isCheck) {
                        MainList.push(vm.List1[i]);
                        var en = { RowNo: vm.List1[i].RowNo, WorkOrder: vm.List1[i].WorkOrder, MOID: vm.List1[i].MOID, DtlID: vm.List1[i].DtlID, MainID: vm.List1[i].MainID };
                        ToCheck.push(en);
                    }
                }
                CheckData(MainList, ToCheck);
            })
        }
    }

    function CheckData(MainList, ToCheck) {
        var en = {};
        en.TempColumns = "ListCheck";
        en.ListCheck = JSON.stringify(ToCheck);
        if (ToCheck.length == 0) {
            toastr.error("还未选择任何差异行，不允许提交OA流程");
            return;
        }
        vm.promise = AjaxService.ExecPlan("WorkOrderPlanDiff", "check", en).then(function (data) {
            console.log(1123)
            if (data.data[0].MsgType == "Success") {
                ToOA(MainList, en);
            }
            else {
                toastr.error(data.data[0].MsgText);
            }
           
        })
    }


    function ToOA(list, enCheck) {
        var dtlist = [];
        for (var i = 0, len = list.length; i < len; i++) {
            dtlist.push(getDtl(list[i]));
        }
        var flowData = {};
        flowData.base = { workflowid: "OAOrderChangeCode", isnextflow: 1, requestname: '工单变更-MES发起' };// + $rootScope.User.ChiFirstName };
        flowData.main = {
            sqr: { transrule: "getUseridByWorkcode" },
            sqrgh: { transrule: "getWorkcodeByU9code" },
            sqrgw: { transrule: "getJobidByWorkcode" },
            ssbm: { transrule: "getDeptidByWorkcode" },
            ssgs: { transrule: "getSubcomidByWorkcode" },
            sqrq: { value: new Date($rootScope.SysTime).Format('yyyy-MM-dd') },
            u9zz: { value: "1001708020135665" },  //u9组织 --固定300
            ismes: { value: "1" },  //是否是MES发起  1 是
        };
        flowData.dt1 = dtlist;
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
                    vm.promise = AjaxService.ExecPlan("WorkOrderPlanDiff", "upState", enCheck).then(function (data2) {
                        PageChange1();
                    })
                }
            }
        })
    }

    function OpenOAUrl(item) {
        //呼叫OA接口
        var en = {};
        en.Url = "OAUrl";
        en.OAFlowID = item.OAFlowID;
        //en.CreateBy = ""; //不提供值时默认系统登录人
        vm.promise = AjaxService.Custom("GetOAWorkFlowUrl", en).then(function (data) {
            console.log(data)
            $window.open(data);
        })

    }

    function getDtl(item) {
        var en = {};
        en.mesid = { value: item.DtlID };
        en.mid = { value: item.MainID };
        en.hh = { value: item.RowNo };
        en.DocNo = { value: item.WorkOrder };
        en.moid = { value: item.MOID };
        en.Code = { value: item.MaterialName };
        en.DocState = { value: item.State };
        en.Reason = { value: item.Dtl.Remark };
        en.bgqcj = { value: item.WorkShop };
        en.bgqxb = { value: item.Line };
        en.bghxb = { value: item.LineCode };
        en.xsd = { value: item.SODocNo };
        en.xsjq = { value: new Date(item.DeliveryDate).Format('yyyy-MM-dd') };
        en.lh = { value: item.MaterialCode };
        en.OriginalStartDate = { value: new Date(item.PlanStDate).Format('yyyy-MM-dd') };
        en.OriginalCompleteDate = { value: new Date(item.PlanEdDate).Format('yyyy-MM-dd') };
        en.StartDate = { value: new Date(item.Dtl.PlanStDate).Format('yyyy-MM-dd')};
        en.CompleteDate = { value: new Date(item.Dtl.PlanEdDate).Format('yyyy-MM-dd') };
        en.bghxsdh = { value: item.Dtl.DemandCode };
        en.bgqxsdh = { value: item.DemandCode };
        return en;
    }

}]);
