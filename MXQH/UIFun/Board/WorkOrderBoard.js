'use strict';

//if (angular.module('app')) {
//    angular.module('app').controller('WorkOrderBoardCtrl', WorkOrderBoardCtrl);
//}
//if (angular.module('access')) {
//    angular.module('access').controller('WorkOrderBoardCtrl', WorkOrderBoardCtrl);
//}
WorkOrderBoardCtrl.$inject = ['$scope', '$state', 'AjaxService', 'toastr', 'appUrl', '$window', 'Dialog', '$timeout', '$cookieStore'];
function WorkOrderBoardCtrl($scope, $state, AjaxService, toastr, appUrl, $window, Dialog, $timeout, $cookieStore) {

    var vm = this;

    if (!$cookieStore.get('GUID') || $cookieStore.get('GUID') == "") {
        $cookieStore.put("GUID", uuid());
    }

    console.log($cookieStore.get('GUID'));

    vm.page = { index: 1, size: 12 };
    vm.SerItemList = [
        { Now: new Date().Format('yyyy-MM-dd'), StartDate: '08:00', EndDate: '23:00', SerType: '1', IsRun: false },
        { Now: new Date().Format('yyyy-MM-dd'), StartDate: '08:00', EndDate: '23:00', SerType: '1', IsRun: false }
    ];
    //vm.Ser = { Now: new Date().Format('yyyy-MM-dd'), StartDate: '08:00', EndDate: '23:00', SerType:'1' };
    
    //vm.Ser = { WorkOrder: 'AMO-30190805004', Now: '2019-09-16', StartDate: '08:00', EndDate: '23:00' };

    vm.IsAss = $state.current.name == 'AssProBoard';

    
    vm.DateOp = {
        //formatTime: 'H:i',
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false,
    }

    vm.IsRun = false;
    vm.BtnText = "开始";
    vm.Begin = Begin;
    vm.Offline = Offline;
    vm.ChangeLine = ChangeLine;
    vm.Open = Open;

    $timeout(function () {
        Open(0);
    }, 1000, false);

    
    function Open(index) {
        if (vm.SerItemList[index].IsRun) {
            Begin(index);
        }
        Dialog.OpenDialog("WorkOrderSerDialog", vm.SerItemList[index]).then(function (data) {
            vm.SerItemList[index] = data;
            Begin(index);
            //$scope.$applyAsync();
        }).catch(function (reason) {
            Begin(index);
            //console.log(reason);
        });
    }


   
    //线别变动
    function ChangeLine() {
        vm.Ser.WorkOrder = undefined;
        var conList = [
       { name: "Status", value: 4, type: "!=", level: 0 },
       //{ name: "WorkOrder", value: "MO%", type: "not like" },
       { name: "WorkOrder", value: "20%", type: "not like", level: 0 },
       { name: "WorkOrder", value: "HMO%", type: "not like", level: 0 },
       { name: "AssemblyLineID", value: vm.LineId, level: 1 }
        ];
        var Con = {};
        Con.planName = "MesMxWOrder";
        Con.strJson = JSON.stringify(conList);
        AjaxService.DoBefore("GetPlans", Con).then(function (data) {
            vm.OrderList = data;
        })
    }

    function Offline() {
        //$window.location.href = appUrl + 'Access.html#!/AssProBoard?v=' + new Date();
        if ($state.current.name != 'AssProBoard') {
            $window.open(appUrl + 'Access.html#!/AssProBoard?v=' + new Date());
        }
        vm.IsFull = !vm.IsFull;
        if (vm.IsFull) {
            fullScreen();
        }
        else {
            exitScreen();
        }
    }

    function Begin(index) {
        //console.log(index);
        //console.log(vm.SerItemList);
        //console.log(vm.SerItemList[index]);
        vm.SerItemList[index].IsHave = '';
        if (!vm.SerItemList[index].IsRun) {
            if (!vm.SerItemList[index].WorkOrder) {
                toastr.error("请先输入工单");
                return;
            }
            if (!vm.SerItemList[index].StartDate) {
                toastr.error("请选择开始时间");
                return;
            }
            if (!vm.SerItemList[index].EndDate) {
                toastr.error("请选择结束时间");
                return;
            }
            vm.SerItemList[index].IsRun = true;
            vm.SerItemList[index].BtnText = "停止";
            var enCon = { WorkOrder: vm.SerItemList[index].WorkOrder, Now: vm.SerItemList[index].Now, StartDate: vm.SerItemList[index].StartDate, EndDate: vm.SerItemList[index].EndDate };
            var en = {};
            en.Method = 'ExecPlan';
            en.PlanName = "MesMxWOrder";
            en.ShortName = "board";
            en.Interval = 60;
            
            //传送的参数字符串
            en.Json = JSON.stringify(enCon);

           
            GetData(en, index);
            //定时计--每3分钟换下一次以防止服务器断开连接
            vm.SerItemList[index].intervalId = setInterval(function () {
                GetData(en, index)
            }, 10000);
        }
        else {
            if (vm.SerItemList[index].intervalId) {
                clearInterval(vm.SerItemList[index].intervalId);
            }
            if (vm.SerItemList[index].socket) {
                vm.SerItemList[index].socket.close();
            }
            vm.SerItemList[index].IsRun = false;
            vm.SerItemList[index].BtnText = "开始";
        }
    }

    function GetData(en, index) {
        //console.log(en);
        AjaxService.GetServerSocket(en, "KeyBoard" + index, function (data, socket) {
            vm.SerItemList[index].socket = socket;
            if (vm.SerItemList[index].IsRun) {
                CalPie(JSON.parse(data), index);
            }
        })
    }

    //全屏
    function fullScreen() {
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        };
        return;
    }

    //退出全屏
    function exitScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
        }
    }

    function CalPie(data, index) {
        //console.log(data)
        //var ListTitle = ['项目'];
        //var List = [];
        //var List1 = [{Val: 1, Text: "投入数量/人数" }],
        //    List2 = [{Val: 2, Text: "标准产出/UPH" }],
        //    List3 = [{Val: 3, Text: "实际产出/UPH" }],
        //    List4 = [{Val: 4, Text: "不良数量/合格率" }],
        //    List5 = [{Val: 5, Text: "标准工时(秒)" }],
        //    List6 = [{Val: 6, Text: "实际工时(秒)" }],
        //    List7 = [{Val: 7, Text: "效率" }];
        //var MainData = data.data[0];
        //var ProductCount = data.data2[0].ProductCount;
        //vm.IsHave = data.data1.length > 0 ? 'Y':'N';
        //for (var i = 0, len = data.data1.length; i < len; i++) {
        //    var item = data.data1[i];
        //    ListTitle.push(item.WorkPartName);
        //    //添加 投入数量
        //    List1.push({ Val: i + 1, Text: (item.WorkOkSum + item.WorkNgSum) + '/' + item.PersonCount });
        //    //标准产出
        //    List2.push({ Val: i + 1, Text: MainData.StardCount + '/' + item.StandardCapacity });
        //    //实际产出
        //    List3.push({ Val: i + 1, Text: item.WorkOkSum + '/' + (item.WorkOkSum / (MainData.RangeHour == 0?1:MainData.RangeHour)).toFixed(0) });
        //    //不良数量/合格率
        //    var okRate = (100.0 * item.WorkOkSum / (item.WorkOkSum + item.WorkNgSum == 0 ? 1 : item.WorkOkSum + item.WorkNgSum)).toFixed(2);
        //    List4.push({
        //        Val: i + 1, Text: item.WorkNgSum + '/' + okRate + "%", IsLow: okRate<96
        //    });
        //    //标准工时(秒)
        //    List5.push({ Val: i + 1, Text: item.StandTime });
        //    //实际工时(秒)
        //    List6.push({ Val: i + 1, Text: (MainData.RangeHour * 3600.0 / (item.WorkOkSum + item.WorkNgSum == 0 ? 1 : (item.WorkOkSum + item.WorkNgSum))).toFixed(2) });
        //    //效率
        //    List7.push({ Val: i + 1, Text: (100.0 * item.WorkOkSum / MainData.StardCount).toFixed(2) + "%" });
        //}
        //List.push(List1);
        //List.push(List2);
        //List.push(List3);
        //List.push(List4);
        //List.push(List5);
        //List.push(List6);
        //List.push(List7);
        var ListTitle = ['项目'];
        var List = [];
        var List1 = [{ Val: 1, Text: "标准产出/实际产出/留存数" }],
            List2 = [{ Val: 2, Text: "不良数量/合格率" }];
        var MainData = data.data[0];
        var ProductCount = data.data2[0].ProductCount;
        vm.SerItemList[index].IsHave = data.data1.length > 0 ? 'Y' : 'N';
        for (var i = 0, len = data.data1.length; i < len; i++) {
            var item = data.data1[i];
            ListTitle.push(item.WorkPartName);
            ////添加 投入数量
            //List1.push({ Val: i + 1, Text: MainData.StardCount + '/' + item.WorkOkSum + '/' + item.NotDoneNum, IsLow: MainData.StardCount > item.WorkOkSum });
            //添加 投入数量
            List1.push({ Val: i + 1, Text: MainData.StardCount + '/' + item.WorkOkSum + '/' + item.NotDoneNum});
            //不良数量/合格率
            var okRate = parseFloat((100.0 * item.WorkOkSum / (item.WorkOkSum + item.WorkNgSum == 0 ? 1 : item.WorkOkSum + item.WorkNgSum)).toFixed(2));
            List2.push({
                Val: i + 1, Text: item.WorkNgSum + '/' + okRate + "%", IsLow: okRate < 96
            });
        }
        List.push(List1);
        List.push(List2);

        $scope.$apply(function () {
            vm.SerItemList[index].List = List;
            vm.SerItemList[index].ListTitle = ListTitle;
            vm.SerItemList[index].MainData = MainData;
            vm.SerItemList[index].ProData = data.data2[0];
            //vm.ProductCount = ProductCount;
            //vm.OKRate = data.data2[0].OKRate;
        });
    }

};
