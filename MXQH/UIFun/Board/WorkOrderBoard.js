﻿'use strict';

angular.module('app')
.controller('WorkOrderBoardCtrl', ['Dialog', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function (Dialog, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = { StartDate: new Date().Format('yyyy/MM/dd') + ' 00:00', EndDate: new Date().Format("yyyy/MM/dd" + ' 23:59') };
    vm.IsRun = false;
    vm.BtnText = "开始刷新";
    vm.Begin = Begin;
    
    AjaxService.GetPlans("MesMxWOrder", [{ name: "Status", value: 4, type: "!=" }]).then(function (data) {
        vm.OrderList = data;
    })

    function Begin() {
        vm.IsHave = '';
        if (!vm.IsRun) {
            if (!vm.Ser.WorkOrder) {
                toastr.error("请先输入工单");
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

            vm.IsRun = true;
            vm.BtnText = "停止刷新";
            var enCon = vm.Ser;
            var en = {};
            en.Method = 'ExecPlan';
            en.PlanName = "MesMxWOrder";
            en.ShortName = "board"
            en.Interval = 60;
            //传送的参数字符串
            en.Json = JSON.stringify(enCon);
            AjaxService.GetServerSocket(en, "KeyBoard", function (data, socket) {
                vm.socket = socket;
                if (vm.IsRun) {
                    CalPie(JSON.parse(data));
                }
            })
        }
        else {
            if (vm.socket) {
                vm.socket.close();
            }
            vm.IsRun = false;
            vm.BtnText = "开始刷新";
        }
    }

    function CalPie(data) {
        var ListTitle = ['项目'];
        var List = [];
        var List1 = [{Val: 1, Text: "投入数量/人数" }],
            List2 = [{Val: 2, Text: "标准产出/UPH" }],
            List3 = [{Val: 3, Text: "实际产出/UPH" }],
            List4 = [{Val: 4, Text: "不良数量/合格率" }],
            List5 = [{Val: 5, Text: "标准工时(秒)" }],
            List6 = [{Val: 6, Text: "实际工时(秒)" }],
            List7 = [{Val: 7, Text: "效率" }];
        var MainData = data.data[0];
        var ProductCount = data.data2[0].ProductCount;
        vm.IsHave = data.data1.length > 0 ? 'Y':'N';
        for (var i = 0, len = data.data1.length; i < len; i++) {
            var item = data.data1[i];
            ListTitle.push(item.WorkPartName);
            //添加 投入数量
            List1.push({ Val: i + 1, Text: (item.WorkOkSum + item.WorkNgSum) + '/' + item.PersonCount });
            //标准产出
            List2.push({ Val: i + 1, Text: MainData.StardCount + '/' + item.StandardCapacity });
            //实际产出
            List3.push({ Val: i + 1, Text: item.WorkOkSum + '/' + (item.WorkOkSum / MainData.RangeHour).toFixed(0) });
            //不良数量/合格率
            var okRate = (100.0 * item.WorkOkSum / (item.WorkOkSum + item.WorkNgSum == 0 ? 1 : item.WorkOkSum + item.WorkNgSum)).toFixed(2);
            List4.push({
                Val: i + 1, Text: item.WorkNgSum + '/' + okRate + "%", IsLow: okRate < 96
            });
            //标准工时(秒)
            List5.push({ Val: i + 1, Text: item.StandTime });
            //实际工时(秒)
            List6.push({ Val: i + 1, Text: (MainData.RangeHour * 3600.0 / (item.WorkOkSum + item.WorkNgSum == 0 ? 1 : item.WorkOkSum + item.WorkNgSum)).toFixed(2) });
            //效率
            List7.push({ Val: i + 1, Text: (100.0 * item.WorkOkSum / MainData.StardCount).toFixed(2) + "%" });
        }
        List.push(List1);
        List.push(List2);
        List.push(List3);
        List.push(List4);
        List.push(List5);
        List.push(List6);
        List.push(List7);
        $scope.$apply(function () {
            vm.List = List;
            vm.ListTitle = ListTitle;
            vm.MainData = MainData;
            vm.ProductCount = ProductCount;
            vm.OKRate = data.data2[0].OKRate;
        });
    }

}]);