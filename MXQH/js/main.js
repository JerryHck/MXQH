'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$localStorage', '$window', 'toastr', 'AjaxService', '$state', '$rootScope', '$cookieStore', 'appUrl', 'Dialog', 'FileUrl',
    function ($scope, $localStorage, $window, toastr, AjaxService, $state, $rootScope, $cookieStore, appUrl, Dialog, FileUrl) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
        var vm = this;

        vm.FunctionList = [];
        vm.SysList = [];
        vm.FunTree = [];
        //路由状态改变
        vm.Go = Go;
        vm.ChangPsw = ChangPsw;
        vm.LogOff = LogOff;
        vm.Reflash = Reflash;
        vm.ChangeSys = ChangeSys;
        vm.DownTool = DownTool;

        // config
        vm.app = {
            name: '管理平台',
            version: '1.3.3',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-black',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-black',
                //Fixs:[{headerFixed: true}]
                headerFixed: true,
                asideFixed: false,
                asideFolded: true,
                asideDock: false,
                container: false
            }
        }

        if (angular.isDefined($localStorage.settings)) {
            vm.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = vm.app.settings;
        }

        GetList();

        //显示系统时间
        ShowServerTime();

        AjaxService.DoBefore("GetSystemData").then(function (data) {
            vm.SysData = data;
        });

        // save settings to local storage
        
        $scope.$watch('vm.app.settings', function () {
            if (vm.app.settings.asideDock && vm.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                vm.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = vm.app.settings;
        }, true);

        function GetList() {
            vm.promise = AjaxService.GetPlans("System").then(function (dataSys) {
                AjaxService.LoginAction("GetUserRoot").then(function (data) {
                    vm.FunData = data;
                    //console.log(data);
                    //vm.FunTree = data;
                    vm.FunctionList = [];
                    vm.SysList = vm.SysList || [];
                    dataSys = dataSys || [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        //获取具有的系统列表
                        var sysEn = {};
                        sysEn.SysNo = data[i].SysNo;
                        for (var h = 0, len1 = dataSys.length; h < len1; h++) {
                            if (sysEn.SysNo == dataSys[h].SysNo) {
                                sysEn.SysName = dataSys[h].SysName; break;
                            }
                        }
                        //添加到列表
                        var have = false;
                        for (var a = 0, len3 = vm.SysList.length; a < len3; a++) {
                            if (sysEn.SysNo == vm.SysList[a].SysNo) {
                                have = true; break;
                            }
                        }
                        if (!have) {
                            vm.SysList.push(sysEn);
                        }
                        //获取所有功能列表
                        data[i].FunList = data[i].FunList || [];
                        for (var j = 0, len2 = data[i].FunList.length; j < len2; j++) {
                            var en = {};
                            en.RouteName = data[i].FunList[j].RouteName;
                            en.FunName = data[i].FunName + '/' + data[i].FunList[j].FunName;
                            vm.FunctionList.push(en);
                            if ($cookieStore.get('active-router') == en.RouteName) {
                                vm.DefaultSys = sysEn;
                            }
                        }
                    }
                    GenRoot();
                    //默认第一项
                    ChangeSys(vm.DefaultSys || vm.SysList[0]);
                    GetBrowse();
                });
            })

            AjaxService.GetPlans("DownloadPlugin").then(function (data) {
                vm.DownList = data;
                //console.log(data);
            })
        }
        
        function ChangeSys(item) {
            if (!item) {
                return;
            }
            if (!item.SysList) {
                for (var i = 0, len = vm.SysList.length; i < len; i++) {
                    if (vm.SysList[i].SysNo == item.SysNo) {
                        item = vm.SysList[i];
                    }
                }
            }
            vm.SelectedSys = item;
        }

        function GenRoot() {
            for (var j = 0, len1 = vm.SysList.length; j < len1; j++) {
                vm.SysList[j].FunTree = [];
                for (var i = 0, len = vm.FunData.length; i < len; i++) {
                    if (vm.SysList[j].SysNo == vm.FunData[i].SysNo) {
                        vm.SysList[j].FunTree.push(vm.FunData[i]);
                    }
                }
            }
        }
        
        function GetBrowse() {
            AjaxService.GetPlans("VwUserBro", { name: "UserNo", value: ($rootScope.User? $rootScope.User.UserNo:"") }).then(function (data) {
                vm.BrowseList = data;
            })
        }

        function Go(routeName) {
            if (routeName) {
                $state.go(routeName);
            }
        }

        function Reflash() {
            //console.log($cookieStore.get('active-router'));
            $state.reload($cookieStore.get('active-router'));
        }

        function ChangPsw() {

            Dialog.OpenDialog("ChangePswDialog", {}).then(function (data) {
                getListRole();
            }).catch(function (reason) {
            });
        }

        function LogOff() {
            AjaxService.LoginAction("LoginOff").then(function (data) {
                $cookieStore.remove('user-token');
                $window.location.href = appUrl + 'Access.html#!/login';
            })
        }

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        function ShowServerTime() {
            AjaxService.GetServerTime(function (data) {
                $scope.$apply(function () {
                    vm.SysTime = data;
                    $rootScope.SysTime = data;
                });
            })
        }

        function DownTool(path) {
            $window.location.href = FileUrl + "DownLoad/" + path;
        }
    }]);


var signs =$('.font-x');

var randomIn = function randomIn(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var mixupInterval = function mixupInterval(el) {
    var ms = randomIn(2000, 4000);
    el.style.setProperty('--interval', "".concat(ms, "ms"));
};
if (signs && signs.length > 0) {
    signs.forEach(function (el) {
        mixupInterval(el);
        el.addEventListener('webkitAnimationIteration', function () {
            mixupInterval(el);
        });
    });
}
