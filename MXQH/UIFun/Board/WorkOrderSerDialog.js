'use strict';
angular.module('AppSet').controller('WorkOrderSerDialogCtrl', WorkOrderSerDialogCtrl);

WorkOrderSerDialogCtrl.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$rootScope'];

function WorkOrderSerDialogCtrl($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    vm.Ser = ItemData;
    //储存
    vm.Save = Save;
    vm.ChangeMonitor = ChangeMonitor;
    vm.ChangeDate = ChangeDate;
    vm.GetData = GetData;
    vm.page = { index: 1, size: 30 };

    GetData();
    ChangeDate();
    ChangeMonitor();

    //获取生产日期
    function GetData() {
        var Con = {};
        Con.strJson = JSON.stringify([]);
        if (vm.Ser.SerType == "1") {
            Con.start = vm.page.index <= 1 ? 1 : (vm.page.index - 1) * vm.page.size + 1;
            Con.end = Con.start + vm.page.size - 1;
            Con.planName = "MesOrderProduceDate";
            AjaxService.DoBefore("GetPlansPage", Con).then(function (data) {
                vm.DateList = data.List;
                vm.page.total = data.Count;
            })
        } else if (vm.Ser.SerType == "2") {
            Con.planName = "AssemblyLine";
            AjaxService.DoBefore("GetPlans", Con).then(function (data) {
                vm.LineList = data;
                vm.page.total = data.length;
            })
        }
    }

    //日期选择变动
    function ChangeDate() {
        
        if (!vm.Ser.Now) {
            return;
        }
        //var conList = [{ name: "OpDate", value: vm.Ser.Now }];//
        var conList = [{ name: "ArrangeDate", value: vm.Ser.Now }];//ArrangeDate
        var Con = {};
        //Con.planName = "MesPlanExBackNumMain";//MoLineArrangeBoard
        Con.planName = "MoLineArrangeBoard";
        Con.strJson = JSON.stringify(conList);
        AjaxService.DoBefore("GetPlans", Con).then(function (data) {
            vm.OrderList = data;
            vm.MoQuery = undefined;
        })
    }

    //
    //线别变动
    function ChangeMonitor() {
        if (!vm.Ser.LineId) {
            return;
        }
        var conList = [
       { name: "Status", value: 4, type: "!=", level: 0 },
       //{ name: "WorkOrder", value: "MO%", type: "not like" },
       { name: "WorkOrder", value: "20%", type: "not like", level: 0 },
       { name: "WorkOrder", value: "HMO%", type: "not like", level: 0 },
       { name: "AssemblyLineID", value: vm.Ser.LineId, level: 1 }
        ];
        var Con = {};
        Con.planName = "MesMxWOrder";
        Con.strJson = JSON.stringify(conList);
        AjaxService.DoBefore("GetPlans", Con).then(function (data) {
            vm.OrderList = data;
            vm.MoQuery = undefined;
        })
    }

    //储存
     function Save () {
         if (!vm.Ser.WorkOrder) {
             toastr.error("请先选择工单");
             return;
         }
         if (!vm.Ser.StartDate) {
             toastr.error("请选择开始时间");
             return;
         }
         if (!vm.Ser.EndDate) {
             toastr.error("请选择结束时间");
             return;
         }
         $uibModalInstance.close(vm.Ser);
    };

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}
