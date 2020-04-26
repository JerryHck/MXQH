'use strict';

angular.module('app')
.controller('MoLineArrangeCtrl', ['$rootScope', '$scope', 'MyPop', 'AjaxService', 'toastr', '$timeout', 'Dialog',
function ($rootScope, $scope, MyPop, AjaxService, toastr, $timeout, Dialog) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.SelectedMo = {};
    vm.Option = {
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    };
    vm.MesList = [];

    vm.KeyDonwOrder = KeyDonwOrder;
    vm.ClearMo = ClearMo;
    vm.SelectArr = SelectArr;
    vm.AddLinePerson = AddLinePerson;
    vm.ChangeProc = ChangeProc;
    vm.AddArrange = AddArrange;
    vm.KeyDonwUserNo = KeyDonwUserNo;
    vm.CopyArr = CopyArr;
    vm.ChangeMo = ChangeMo;
    //排班
    vm.SaveArrange = SaveArrange;
    vm.OpenMoDialog = OpenMoDialog;

    vm.Cancel = Cancel;
    vm.DeletePer = DeletePer;
    vm.DeleteArr = DeleteArr;
    vm.ChangeRemark = ChangeRemark;
    vm.ChangeStart = ChangeStart;
    vm.ChangeEnd = ChangeEnd;
    vm.ChangeArrStart = ChangeArrStart;
    vm.ChangeArrEnd = ChangeArrEnd;
    vm.CalPer = CalPer;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }
    var conList = [
        { name: "WorkOrder", value: "20%", type: "not like" },
    ];
    //工单获取
    vm.promise = AjaxService.GetPlans("MesMxWOrder", conList).then(function (data) {
        vm.MoList = data;
        for (var i = 0, len = vm.MoList.length; i < len; i++) {
            vm.MoList[i].FirstChar = vm.MoList[i].WorkOrder.substring(0, 1);
        }
    });
    //工序获取
    vm.promise = AjaxService.GetPlans("MESBoProcedure", { name: "IsUse", value: 1 }).then(function (data) {
        vm.ProcedureList = data;
    });
    //MES用户获取 -非离职
    vm.promise = AjaxService.GetPlans("MESUser", [{ name: "IsLeave", value: "0" }]).then(function (data) {
        vm.UserList = [];
        vm.HrData = data;
        for (var i = 0, len = data.length; i < len; i++) {
            vm.UserList.push({ UserNo: data[i].UserNo, Name: data[i].Name });
        }
        
    });

    function KeyDonwOrder(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.Item.WorkOrder) {
            vm.IsEdit = false;
            var en = {};
            en.name = "WorkOrder";
            en.value = vm.Item.WorkOrder;
            AjaxService.GetPlan("MesMxWOrder", en).then(function (data) {
                var mss = "工单 [" + vm.Item.WorkOrder + '] ';
                if (!data.ID) {
                    vm.Item.WorkOrder = undefined;
                    toastr.error(mss + '  不存在或已经完工');
                }
                else {
                    vm.SelectedMo = data;
                    GetMoArrange();
                    vm.SelectedArrange = {};
                }
            });
        }
    }

    function ClearMo() {
        if (!MyPop.Show(vm.editArrange, '功能信息还在编辑，请先保存！')) {
            vm.SelectedMo = undefined;
            vm.Item.WorkOrder = undefined;
            vm.ArrangeList = [];
            vm.MesLis = [];
            vm.SelectedArrange = {};
        }
    }

    function OpenMoDialog() {
        Dialog.OpenDialog("MESMODialog", {}).then(function (data) {
            vm.SelectedMo = data;
            vm.Item.WorkOrder = data.WorkOrder;
            GetMoArrange();
            vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
                vm.SelectedArrange.WorkOrder = vm.SelectedMo.WorkOrder;
                vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName };
                vm.SelectedArrange.LineId = data2.Plan.Line.ID;
                vm.SelectedArrange.Line = { Name: data2.Plan.Line.Name };
                vm.SelectedArrange.LineLeader = data2.Plan.Line.UserName.Id;
                vm.SelectedArrange.MesUser = { Name: data2.Plan.Line.UserName.Name };
                vm.SelectedArrange.StandPerson = data2.Plan.Line.LineNumber
            })
            vm.MesLis = [];
        })
    }

    //备注现在改变
    function ChangeRemark() {
        if (vm.SelectedArrange.Remark == "正常工单") {
            AjaxService.GetPlan("MoPlanCount", [{ name: "WorkOrder", value: vm.SelectedArrange.WorkOrder }, { name: "PlanDate", value: vm.SelectedArrange.ArrangeDate }]).then(function (data) {
                if (!data.Id) {
                    toastr.error("该工单[" + vm.SelectedArrange.ArrangeDate + "]日排产计划没有录入，请找PMC维护");
                }
                vm.SelectedArrange.PlanCount = data.PlanCount;
            });
        }
    }

    function ChangeArrEnd(item) {
        var d = new Date(vm.SelectedArrange.ArrangeDate + ' ' + item.EndTime);
        var dm = new Date(vm.SelectedArrange.ArrangeDate + ' ' + vm.SelectedArrange.EndTime);
        if (d > dm) {
            toastr.error("选择的结束时间不能晚于产线排班的结束时间")
            item.EndTime = item.OriEndTime;
        }
        else {
            item.OriEndTime = item.EndTime;
        }
    }

    function ChangeArrStart(item) {
        var d = new Date(vm.SelectedArrange.ArrangeDate + ' ' + item.StartTime);
        var dm = new Date(vm.SelectedArrange.ArrangeDate + ' ' + vm.SelectedArrange.StartTime);
        if (d < dm) {
            toastr.error("选择的开始时间不能早于产线排班的开始时间")
            item.StartTime = item.OriStartTime;
        }
        else {
            item.OriStartTime = item.StartTime;
        }
    }

    function ChangeStart() {
        for (var j = 0, len1 = vm.SelectedArrange.Dtl.length; j < len1; j++) {
            vm.SelectedArrange.Dtl[j].StartTime = vm.SelectedArrange.StartTime;
            vm.SelectedArrange.Dtl[j].OriStartTime = vm.SelectedArrange.StartTime;
        }
    }

    function ChangeEnd() {
        for (var j = 0, len1 = vm.SelectedArrange.Dtl.length; j < len1; j++) {
            vm.SelectedArrange.Dtl[j].EndTime = vm.SelectedArrange.EndTime;
            vm.SelectedArrange.Dtl[j].OriEndTime = vm.SelectedArrange.EndTime;
        }
    }

    //扫描人员
    function KeyDonwUserNo(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.HrUserNo) {
            if (!vm.SelectedArrange.ArrangeDate || !vm.SelectedArrange.StartTime || !vm.SelectedArrange.EndTime) {
                toastr.error("请先填写排班开始时间/结束时间");
                vm.HrUserNo = undefined;
                return;
            }

            var have = false;
            for (var i = 0, len = vm.HrData.length; i < len; i++) {
                if (vm.HrData[i].UserNo == vm.HrUserNo) {
                    have = true;
                    vm.KeyUser = vm.HrData[i];
                }
            }
            if (have) {
                var DtlHave = false;
                for (var j = 0, len1 = vm.SelectedArrange.Dtl.length; j < len1; j++) {
                    if (vm.HrUserNo == vm.SelectedArrange.Dtl[j].User.UserNo) {
                        DtlHave = true; break;
                    }
                }
                if (DtlHave) {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: '人员[' + vm.KeyUser.Name + ']已经扫描， 不可以再添加' });

                }
                else {
                    vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: true, Msg: '已成功扫描并添加[' + vm.KeyUser.Name + ']' });
                    vm.NewPerItem = { User: { UserNo: vm.KeyUser.UserNo, Name: vm.KeyUser.Name }, Merits: '1.0', EmpType: 'P', StartTime: vm.SelectedArrange.StartTime, EndTime: vm.SelectedArrange.EndTime };
                    vm.SelectedArrange.Dtl.push(vm.NewPerItem);
                    CalPer();
                }
            }
            else {
                vm.MesList.splice(0, 0, { Id: vm.MesList.length + 1, IsOk: false, Msg: '该用户工号[' + vm.HrUserNo + ']不存在' });
            }
            vm.HrUserNo = undefined;
        }
    }

    function SelectArr(item) {
        if (!MyPop.Show(vm.editArrange, '功能信息还在编辑，请先保存！')) {
            vm.SelectedArrange = angular.copy(item);
            vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, MaterialName: vm.SelectedMo.MaterialName, Quantity: vm.SelectedMo.Quantity };
            for (var i = 0, len = vm.SelectedArrange.Dtl.length; i < len; i++) {
                vm.SelectedArrange.Dtl[i].User = { UserNo: vm.SelectedArrange.Dtl[i].HrUserNo, Name: vm.SelectedArrange.Dtl[i].HrUserName };
                vm.SelectedArrange.Dtl[i].OriStartTime = vm.SelectedArrange.Dtl[i].StartTime;
                vm.SelectedArrange.Dtl[i].OriEndTime = vm.SelectedArrange.Dtl[i].EndTime;
            }
            CalPer();
            vm.MesLis = [];
        }
    }

    function Cancel() {
        vm.editArrange = false;
        vm.IsCopy = false;
        if (vm.SelectedArrange.Id == -1) {
            vm.NewArrange = {};
            vm.SelectedArrange = {};
        }
    }

    function ChangeProc() {
        vm.ProcItem.Item2 = vm.ProcItem.ProcedureInfo.LowerFPY;
        vm.ProcItem.Item4 = vm.ProcItem.ProcedureInfo.LowerFPY;
    }

    function GetMoArrange() {
        vm.promise = AjaxService.GetPlans("MESMoLineArrange", [{ name: "WorkOrder", value: vm.SelectedMo.WorkOrder }]).then(function (data) {
            vm.ArrangeList = data;
        });
    }

    //添加工艺排程
    function AddLinePerson() {
        vm.NewPerItem = {};
        vm.SelectedArrange.Dtl.push(vm.NewPerItem);
        CalPer();
    }

    function CalPer() {
        var index = 0;
        for (var i = 0, len = vm.SelectedArrange.Dtl.length; i < len; i++) {
            if (vm.SelectedArrange.Dtl[i].EmpType == 'P') {
                index++;
            }
        }
        vm.SelectedArrange.ActPerson = index;
        vm.SelectedArrange.NeedPerson = parseInt(vm.SelectedArrange.NeedPerson);
        vm.SelectedArrange.DutyType = vm.SelectedArrange.ActPerson == vm.SelectedArrange.NeedPerson ? "满勤" :
            (vm.SelectedArrange.ActPerson > vm.SelectedArrange.NeedPerson ? "超员" : "缺勤");
    }

    function AddArrange() {
        var en = { TbName: "MesLineArrange", ClName: "DocNo", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
                vm.OrderData = data2;
                vm.NewArrange = {
                    Id: -1,
                    ArrangeDate: (new Date()).Format("yyyy-MM-dd"),
                    WorkOrder: vm.SelectedMo.WorkOrder,
                    Order: { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName },
                    LineId: data2.Plan.Line.ID,
                    Line: { Name: data2.Plan.Line.Name },
                    LineLeader: data2.Plan.Line.UserName.Id,
                    MesUser: { Name: data2.Plan.Line.UserName.Name },
                    StandPerson: data2.Plan.Line.LineNumber,
                    Dtl: []
                };
                vm.NewArrange.DocNo = data.data[0].SN;
                vm.editArrange = true;
                vm.SelectedArrange = vm.NewArrange;
            })
        })
    }

    //保存排班
    function SaveArrange() {
        CalPer();
        var en = angular.copy(vm.SelectedArrange);
        var list = [];
        for (var j = 0, len2 = en.Dtl.length; j < len2; j++) {
            var p = {};
            p.Id = en.Dtl[j].Id || -1;
            p.Remark = en.Dtl[j].Remark || "";
            p.HrUserNo = en.Dtl[j].User.UserNo;
            p.HrUserName = en.Dtl[j].User.Name;
            p.ProcedureId = en.Dtl[j].ProcedureId;
            p.EmpType = en.Dtl[j].EmpType;
            p.StartTime = en.Dtl[j].StartTime;
            p.EndTime = en.Dtl[j].EndTime;
            p.Merits = en.Dtl[j].Merits;
            list.push(p);
        }
        en.Order = undefined;
        en.Line = undefined;
        en.MesUser = undefined;
        en.Dtl = undefined;
        en.PerList = JSON.stringify(list);
        en.TempColumns = "PerList";
        var SNList = [{ name: "MesLineArrange", col: "DocNo", parm: "DocNo" }];
        if (en.Id == -1) {
            en.SNColumns = JSON.stringify(SNList);
        }
        console.log(en);
        vm.promise = AjaxService.ExecPlan("MESMoLineArrange", "save", en).then(function (data) {
            if (data.data[0].MsgType == "Seccuss") {
                toastr.success("排班保存成功");
                vm.editArrange = false;
                vm.IsCopy = false;
                //vm.SelectedArrange = undefined;
                vm.NewArrange = {};
                GetMoArrange();
            }
            else {
                toastr.error(data.data[0].MsgText);
            }
        })
    }

    //复制排班
    function CopyArr() {
        MyPop.ngConfirm({ text: "确定要复制该排班吗?" }).then(function (data) {
            var en = { TbName: "MesLineArrange", ClName: "DocNo", CharName: null };
            vm.promise = AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
                vm.NewArrange = vm.SelectedArrange;
                vm.NewArrange.Id = -1;
                vm.NewArrange.DocNo = data.data[0].SN;
                vm.NewArrange.ArrangeDate = undefined;
                vm.editArrange = true;
                vm.IsCopy = true;
                vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
                    vm.NewArrange.WorkOrder = vm.SelectedMo.WorkOrder;
                    vm.NewArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName };
                    vm.NewArrange.LineId = data2.Plan.Line.ID;
                    vm.NewArrange.Line = { Name: data2.Plan.Line.Name };
                    vm.NewArrange.LineLeader = data2.Plan.Line.UserName.Id;
                    vm.NewArrange.MesUser = { Name: data2.Plan.Line.UserName.Name };
                    vm.NewArrange.StandPerson = data2.Plan.Line.LineNumber
                })

            })
        });
    }

    //改变工单
    function ChangeMo() {
        GetMoArrange();
        vm.promise = AjaxService.GetPlan("MESLineOrder", { name: "ID", value: vm.SelectedMo.ID }).then(function (data2) {
            vm.SelectedArrange.WorkOrder= vm.SelectedMo.WorkOrder;
            vm.SelectedArrange.Order = { MaterialCode: vm.SelectedMo.MaterialCode, Quantity: vm.SelectedMo.Quantity, MaterialName: vm.SelectedMo.MaterialName };
            vm.SelectedArrange.LineId= data2.Plan.Line.ID;
            vm.SelectedArrange.Line= { Name: data2.Plan.Line.Name };
            vm.SelectedArrange.LineLeader= data2.Plan.Line.UserName.Id;
            vm.SelectedArrange.MesUser= { Name: data2.Plan.Line.UserName.Name };
            vm.SelectedArrange.StandPerson= data2.Plan.Line.LineNumber
        })
        vm.MesLis = [];
    }

    //删除排班
    function DeleteArr(item) {
        vm.promise = AjaxService.ExecPlan("MESMoLineArrange", "del", item).then(function (data) {
            toastr.success("排班保存成功");
            GetMoArrange();
        })
    }

    //删除排班人员
    function DeletePer(index) {
        MyPop.ngConfirm({ text: "确定要删除吗?" }).then(function (data) {
            vm.SelectedArrange.Dtl.splice(index, 1);
            CalPer();
        });
    }

    //验证是否存在
    function isExists() {
        if (vm.SelectedRo.RoutingName) {
            var en = [{ name: "RoutingName", value: vm.SelectedRo.RoutingName },
                { name: "ID", value: vm.SelectedRo.ID, type: "!=" }];
            AjaxService.GetPlan('BoRouting', en).then(function (data) {
                vm.RouteForm.RouteName.$setValidity('unique', !data.RoutingName);
            });
        }
    }

}]);
