'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$localStorage', '$window', 'AjaxService', '$state', '$rootScope', '$cookieStore', 'appUrl', 'Dialog',
    function ($scope, $localStorage, $window, AjaxService, $state, $rootScope, $cookieStore, appUrl, Dialog) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

        var vm = this;

        vm.FunctionList = [];
        //路由状态改变
        vm.Go = Go;
        vm.ChangPsw = ChangPsw;
        vm.LogOff = LogOff;

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
                asideFolded: false,
                asideDock: false,
                container: false
            }
        }
        GetList();


        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            vm.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = vm.app.settings;
        }
        $scope.$watch('app.settings', function () {
            if (vm.app.settings.asideDock && vm.app.settings.asideFixed) {
                // aside dock and fixed must set the header fixed.
                vm.app.settings.headerFixed = true;
            }
            // save to local storage
            $localStorage.settings = vm.app.settings;
        }, true);

        function GetList() {
            vm.promise = AjaxService.LoginAction("GetUserRoot").then(function (data) {
                vm.FunTree = data;
                vm.FunctionList = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    for (var j = 0, len2 = data[i].FunList.length; j < len2; j++) {
                        var en = {};
                        en.RouteName = data[i].FunList[j].RouteName;
                        en.FunName = data[i].FunName + '/' + data[i].FunList[j].FunName;
                        vm.FunctionList.push(en);
                    }
                }

                //console.log(data);
            });

            vm.ConfigData = [];
        }

        function Go(routeName) {
            $state.go(routeName);
        }

        function ChangPsw() {
            var resolve = {
                ItemData: function () {
                    return {};
                }
            };
            Dialog.open("ChangePswDialog", resolve).then(function (data) {
                getListRole();
            }).catch(function (reason) {
            });
        }

        function LogOff() {
            AjaxService.LoginAction("LoginOff").then(function (data) {
                $cookieStore.remove('user-token');
                $window.location.href = appUrl + 'Login.html';
            })
        }

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

    }]);