'use strict';

if (window.location.href.indexOf("index.html") > 0) {
    angular.module('app').controller('U9IssuedLLMateBoardCtrl', U9IssuedLLMateBoardCtrl);
}
if (window.location.href.indexOf("Access.html") > 0) {
    angular.module('access').controller('U9IssuedLLMateBoardCtrl', U9IssuedLLMateBoardCtrl);
}
U9IssuedLLMateBoardCtrl.$inject = ['$scope', '$rootScope', '$state', 'AjaxService', 'toastr', 'appUrl', '$window', 'Dialog', '$timeout', '$cookieStore'];
function U9IssuedLLMateBoardCtrl($scope, $rootScope, $state, AjaxService, toastr, appUrl, $window, Dialog, $timeout, $cookieStore) {

    var vm = this;

    if (!$cookieStore.get('GUID') || $cookieStore.get('GUID') == "") {
        $cookieStore.put("GUID", AjaxService.uuid());
    }

    vm.page = { index: 1, size: 12 };
    vm.SerItemList = [
        { Now: new Date().Format('yyyy-MM-dd'), StartDate: '08:00', EndDate: '23:00', SerType: '1', IsRun: false }
    ];

    vm.IsAss = window.location.href.indexOf("Access.html") > 0;
    vm.DateOp = {
        //formatTime: 'H:i',
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false,
    }

    vm.IsRun = false;
    vm.BtnText = "开始";
    vm.Offline = Offline;
    
    Begin(0);

    if (vm.IsAss) {
        getSysTime();
        //定时计--每3分钟换下一次以防止服务器断开连接
        vm.timeSocketIntervalId = setInterval(function () {
            getSysTime()
        }, 300000);
    }

    function getSysTime() {
        //console.log(en);
        if (vm.timeSocket) {
            vm.timeSocket.close();
        }
        AjaxService.GetServerTime(function (data) {
            $scope.$apply(function () {
                var dat = JSON.parse(data);
                vm.NowTime = dat.Time;
            });
        }, vm.timeSocket)
    }


    function Offline() {
        if (!vm.IsAss) {
            $window.open(appUrl + 'Access.html#!/app/U9IssuedLLMateBoard?v=' + new Date());
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
        vm.SerItemList[index].IsHave = '';
        //var enCon = { TempCacheEn: "U9vwIssueMain,U9vwIssueMain", TempPlans:"Funtion,U9Test" };
        var enCon = {};
        var en = {};
        en.Method = 'ExecPlan';
        en.PlanName = "WMSPicking";
        en.ShortName = "board";
        en.Interval = 60;
            
        //传送的参数字符串
        en.Json = JSON.stringify(enCon);

           
        GetData(en, index);
        //定时计--每3分钟换下一次以防止服务器断开连接
        vm.SerItemList[index].intervalId = setInterval(function () {
            GetData(en, index)
        }, 300000);
    }

    function GetData(en, index) {
        //console.log(en);
        if (vm.SerItemList[index].socket) {
            vm.SerItemList[index].socket.close();
        }
        AjaxService.GetServerSocket(en, "KeyBoard" + index, function (data, socket) {
            vm.SerItemList[index].socket = socket;
            //停止循环
            if (vm.Inter) {
                clearInterval(vm.Inter);
            }

            $scope.$apply(function () {
                vm.MainData = JSON.parse(data).data;
                vm.MainList = [];
                var index = 0, pagesize = 8;
                var len2 = vm.MainData.length > pagesize ? pagesize : vm.MainData.length;
                for (var a = 0; a < len2; a++) {
                    vm.MainList.push(vm.MainData[a]);
                }
                var count = Math.ceil(vm.MainData.length / pagesize);
                //定时计--每3分钟换下一次以防止服务器断开连接
                var i = 1;
                vm.Inter = setInterval(function () {
                    i = i == count ? 0 : i;
                    var list = [];
                    var len = (i + 1) * pagesize >= vm.MainData.length ? vm.MainData.length : (i + 1) * pagesize;
                    for (var j = i * pagesize; j < len; j++) {
                        list.push(vm.MainData[j]);
                    }
                    $scope.$apply(function () {
                        vm.MainList = list;
                    });
                    i++;
                }, 20000);
            });
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
};
