'use strict';

/* Controllers */

angular.module('flow')
  .controller('FlowMainCtrl', ['$rootScope', '$scope', 'serviceUrl', '$window', 'AjaxService', 'Version', 'toastr', 'FileUrl', '$cookieStore', '$state', 'MyPop', 'router',
    function ($rootScope, $scope, serviceUrl, $window, AjaxService, Version, toastr, FileUrl, $cookieStore, $state, MyPop, router) {
        var vm = this;

        vm.FormOkSign = FormOkSign;

        //获取URL中的参数
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        //表单类型-功能编号
        var funno = getQueryString("ft");
        //表单操作方式 -- I - 新增  S-签核， V-查看
        var operate = getQueryString("op");
        //表单号
        var flowno = getQueryString("flowno");

        if (!funno) {
            ShowError("未知表单流程或表单流程缺失");
        }
        //获取流程信息
        //var flowData = AjaxService.GetPlansWait("Function", [{ name: "FunNo", value: funno }, { name: "IsSystem", value: 2 }]);
        AjaxService.GetPlan("Function", [{ name: "FunNo", value: funno }, { name: "IsSystem", value: 2 }]).then(function (data) {
            if (data && data.FunNo) {
                vm.ThisFun = data;
                //console.log(data);
                GetUserRoute();
            }
            else {
                ShowError("未知表单流程错误");
            }
        })

        function FormOkSign() {
            //调用子controller 方法
            //angular.element(document.getElementById('formContent')).scope().Search();
            $rootScope.MainSearch();
        }

        

        function GetUserRoute() {
            //获取路由信息
            AjaxService.LoginAction("GetFunRoute").then(function (data) {
                var have = false;
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    if (item.FunNo == vm.ThisFun.FunNo) {
                        var route = {};
                        if (item.RouteName && item.RouteName != '') {
                            route.Name = item.RouteName;
                            route.Url = item.RouteUrl;
                            route.Controller = item.Controller;
                            route.ControllerAs = item.ControllerAs;
                            route.TempleteUrl = item.FunHtml + "?v=" + Version;
                            route.FunNo = item.FunNo;
                            if (item.FunLoad) {
                                var loadJs = [];
                                angular.forEach(item.FunLoad, function (l) {
                                    if (l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == 'css' || l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == '.js') {
                                        loadJs.push(l.LoadName + "?v=" + Version);
                                    }
                                    else {
                                        loadJs.push(l.LoadName);
                                    }
                                });
                                route.LazyLoad = loadJs;
                            }
                            router.setDataRouters(route, true);
                        }
                        have = true;
                    }
                }
                if (have) {
                    $state.go(vm.ThisFun.RouteName);
                }
                else {
                    ShowError("用户未具有流程权限或权限缺失");
                }
            });
        }


        function ShowError(text) {
            MyPop.ngShow(text).then(function (data) {
                //closeWindows();
            })
        }

        //console.log(data)

        //AjaxService.GetPlan("User", {}).then(function (data) {
        //    console.log(data)
        //});
        function closeWindows() {
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {

                window.location.href="about:blank";

            } else {

                window.opener = null;

                window.open("", "_self");

                window.close();

            }
        }
       
    }]);



