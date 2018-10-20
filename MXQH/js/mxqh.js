///<jscompress sourcefile="AjaxServiceModule.js" />
(function () {
    angular.module('AjaxServiceModule', ['appData', 'ngAnimate', 'toastr', 'ngCookies']);

    angular.module('AjaxServiceModule').config(appConfig);

    angular.module('AjaxServiceModule').factory('httpWatch', httpWatch);

    //httpWatch.$inject = ['$cookies'];

    function httpWatch($cookieStore) {
        var obj = {
            'request': function (config) {
                if ($cookieStore.get('user-token')) {
                    config.headers['x-session-token'] = $cookieStore.get('user-token');
                   
                }
                config.headers['x-function'] = $cookieStore.get('active-function') || '';
                return config;
            }
        };
        return obj;
    }

    function appConfig($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application / x - www - form - urlencoded';
        
        $httpProvider.defaults.transformRequest = function (data) {
            if (typeof (data) == 'undefined') {
                return data;
            }
            return $.param(data);
        }
        $httpProvider.interceptors.push(httpWatch);
    }
})();;
///<jscompress sourcefile="AjaxServiceMethod.js" />
(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr', '$cookieStore', '$window'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr, $cookieStore, $window) {
        var generic = 'Common.asmx/Do';
        var tableConfigList = [];

        var obj = {
            //登录前服务
            DoBefore: DoBefore,
            //自定义服务方法
            Custom:Custom,

            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //分页获取实体资料
            GetPlansPage: GetPlansPage,
            //实体计划excel导出
            GetPlanExcel: GetPlanExcel,
            //保存计划实体
            SavePlan: SavePlan,
            //刷新计划实体
            ReflashPlan: ReflashPlan,
            //删除计划实体
            DeletePlan: DeletePlan,
            //计划对应表新增
            PlanInsert: PlanInsert,
            //计划对应表更新
            PlanUpdate: PlanUpdate,
            //计划对应表删除
            PlanDelete: PlanDelete,
            //计划备份
            PlanBak: PlanBak,
            //执行计划实体
            ExecPlan: ExecPlan,
            //执行实体关联的存储过程,获取Excel文件
            ExecPlanToExcel: ExecPlanToExcel,
            //获得实体资料-单个
            GetEntity: GetEntity,
            //获得实体资料-列表
            GetEntities: GetEntities,
            //获取Json数据
            GetJson: GetJson,
            //简单单表新增
            Action: Action,
            //文件
            HandleFile: HandleFile,
            //
            AddDialog: AddDialog,
            //链接对象列表
            GetConnect: GetConnect,
            //数据对象
            GetDbObject: GetDbObject,
            //获取表栏位
            GetColumns: GetColumns,
            GetTbColumns: GetTbColumns,
            GetProcColumns: GetProcColumns,
            GetTableConfig: GetTableConfig,
            //User
            AddUser: AddUser,
            LoginAction: LoginAction,
            //file
            FileImport: FileImport,
            //文件上传保存
            ExecPlanUpload: ExecPlanUpload,
            //发送邮件
            ExecPlanMail: ExecPlanMail,


        };

        return obj;

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data + "?v=" + (new Date()).toString();
            return Ajax(d, url, undefined, undefined, "GET");
        }

        //获得计划资料
        function GetPlan(name, json, limitCol) {
            return plan(name, json, "GetPlan", undefined, undefined, limitCol);
        }

        //获得计划资料-列表
        function GetPlans(name, json, limitCol) {
            return plan(name, json, "GetPlans", undefined, undefined, limitCol);
        }

        //获得计划资料-分页
        function GetPlansPage(name, json, index, size, limitCol) {
            var s = index <= 1 ? 1 : (index - 1) * size + 1;
            return plan(name, json, "GetPlansPage", s, s + size, limitCol);
        }

        //获得计划资料-新增
        function PlanInsert(name, json) {
            return planAjax(name, JSON.stringify(json), "Insert");
        }

        //获得计划资料-更新
        function PlanUpdate(name, json) {
            return planAjax(name, JSON.stringify(json), "Update");
        }

        //获得计划资料-删除
        function PlanDelete(name, json) {
            return planAjax(name, JSON.stringify(json), "Delete");
        }
        //计划备份已导入
        function PlanBak(action, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.action = action;
            en.strJson = json;
            return Ajax(d, url, en, "PlanBak")
        }

        //获得单实体资料
        function GetEntity(name, json) {
            return entity(name, json, "GetEntity");
        }

        //获得表资料
        function GetEntities(name, json) {
            return entity(name, json, "GetEntities");
        }

        //获得表资料
        function Action(name, json, action) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strTbView = name;
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, action);
        }

        function HandleFile(type) {
            var d = $q.defer();
            return AjaxHandle(d, "GetFileList", type);
        }

        function AddDialog(data) {
            var d = $q.defer();
            return AjaxHandle(d, "AddDialog", data);
        }

        //HTTP AJAX
        function AjaxHandle(q, method, data) {

            var en = { "method": method, "data": data };
            httpFun(q, appUrl + 'Data/Handler/FileData.ashx', en);
            return q.promise;
        }

        function GetConnect() {
            var d = $q.defer(), url = serviceUrl + generic;
            return Ajax(d, url, {}, "GetConnectList");
        }

        function GetDbObject(con, type, ser) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strCon = con;
            en.strType = type;
            en.strSearch = ser;
            return Ajax(d, url, en, "GetDbObject");
        }

        function GetColumns(con) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.planName = con;
            Ajax(d, url, en, "GetTbViewColumns").then(
                function (data) { g.resolve(data.data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        function GetProcColumns(conn, proc) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.connName = conn;
            en.strProc = proc;
            return Ajax(d, url, en, "GetProcColumns");
        }

        function GetTbColumns(schema, table, con) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.Schema = schema;
            en.TableName = table;
            en.ConnectName = con;
            Ajax(d, url, en, "GetTbColumns").then(
                function (data) { g.resolve(data.data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        function entity(name, json, funName) {
            var d = $q.defer(),
                url = serviceUrl + generic;
            var en = {};
            en.strName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';
            return Ajax(d, url, en, funName);
        }

        function plan(name, json, funName, start, end, limitCol) {
            var enJson = JSON.stringify(convertArray(json)) || '[]';
            return planAjax(name, enJson, funName, start, end, limitCol);
        }

        function planAjax(name, json, funName, start, end, limitCol) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            en.strJson = json;
            en.start = start;
            en.end = end;
            en.limitUserCol = limitCol;
            return Ajax(d, url, en, funName)
        }

        function SavePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, undefined, json);
            return Ajax(d, url, en, "SavePlan");
        }

        function ReflashPlan(name) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            return Ajax(d, url, en, "ReflashPlan");
        }
        function DeletePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, undefined, json);
            return Ajax(d, url, en, "DeletePlan");
        }

        function ExecPlan(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "ExecPlan")
        }

        function ExecPlanMail(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "ExecPlanMail")
        }

        function ExecPlanUpload(name, shortName, json, fileJson, dir) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.fileJson = JSON.stringify(fileJson);
            en.dir = dir;
            return Ajax(d, url, en, "ExecPlanUpload")
        }

        function ExecPlanToExcel(name, shortName, json, sheetTable) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.sheetTable = JSON.stringify(convertArray(sheetTable));
            return Ajax(d, url, en, "ExecPlanToExcel")
        }

        function GetPlanExcel(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "GetPlanExcel")
        }

        function AddUser(json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "AddUser", undefined, 'Authorization')
        }

        function DoBefore(method, en) {
            var d = $q.defer(), url = serviceUrl + "Common.asmx/DoBefore";
            var json = { method: method, Json: JSON.stringify(en) };
            return httpFun(d, url, json);
        }

        function LoginAction(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method, undefined, 'Authorization');
        }

        function Custom(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method, undefined, 'Custom');
        }

        function GetTableConfig(tbName, clName) {
            var d = $q.defer(), listHave = [];
            //从缓存中获取数据
            for (var j = 0, len = tableConfigList.length; j < len; j++) {
                if (tableConfigList[j].TbName == tbName && tableConfigList[j].ClName == clName) {
                    listHave.push(tableConfigList[j])
                }
            }
            if (listHave.length > 0) {
                d.resolve(listHave);
            }
            else {
                var list = [
                    { name: "TbName", value: tbName },
                    { name: "ClName", value: clName }
                ];
                GetPlans("TableConfig", list).then(function (data) {
                    for (var j = 0, len = data.length; j < len; j++) {
                        var have = false;
                        for (var h = 0, len = tableConfigList.length; h < len; h++) {
                            if (tableConfigList[h].TbName == data[j].TbName && tableConfigList[h].ClName == data[j].ClName &&
                                tableConfigList[h].ClInf == data[j].ClInf) {
                                have = true;
                            }
                        }
                        if (have) {
                            tableConfigList.push(data[j]);
                        }
                    }
                    d.resolve(data);
                });
            }
            return d.promise;
        }

        function FileImport(name, shortName, json, file, inData, sheetTable) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.filaName = file;
            en.bt = inData;
            en.sheetTable = JSON.stringify(convertArray(sheetTable));
            return Ajax(d, url, en, 'FileImport');
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
            return httpFun(q, url, en, type);
        }

        function TbAjax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
            return httpTbFun(q, url, en, type);
        }

        function httpTbFun(q, url, postData, type) {
            var g = $q.defer();
            httpFun(g, url, postData, type).then(
                function (data) { q.resolve(data.data); },
                function () { q.reject(); }
            );
            return q.promise;
        }

        function httpFun(q, url, postData, type) {
            $http({
                method: type || 'POST',
                url: url,
                dataType: 'json',
                data: postData
            })
            .then(
                function (data) { q.resolve(data.data); },
                function (data) {
                    q.reject();
                    if (data.status == 401) {
                        $cookieStore.remove('user-token');
                        if ($window.location.href != appUrl + 'Acess.html#!/login') {
                            $window.location.href = appUrl + 'Acess.html#!/login';
                        }
                    } else {
                        console.log(data);
                        var m = data.data ? data.data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误');
                    }
                });
            return q.promise;
        }

        function getEn(name, shortName, json)
        {
            var en = {};
            en.planName = name;
            en.shortName = shortName;
            en.strJson = JSON.stringify(json);
            return en;
        }

        //转换字符串
        function convertArray(en) {
            if (!en) return en;
            var isArr;
            if (typeof Array.isArray === "function") {
                isArr = Array.isArray(en);
            } else {
                isArr = Object.prototype.toString.call(en) === "[object Array]";
            }
            if (isArr) { return en; }
            else {
                var enNew = [];
                enNew.push(en);
                return enNew;
            }
        }
    }
})();;
///<jscompress sourcefile="MyDirective.js" />
'use strict'
angular.module('MyDirective', [])

angular.module('MyDirective')
.directive('ngConfirm', function () {
    return {
        restrict: 'A',
        priority: 1,
        terminal: true,
        //transclude: true,
        //template: '<div ng-transclude></div>',
        link: link
    };
    function link(scope, element, attr) {

        scope.$watchCollection(attr.ngConfirm, function (options) {
            var en = options || {};
            en.title = en.title || "确认";
            en.text = en.text || "是否删除此笔资料";
            en.type = en.type || "warning";
            en.showCancelButton = en.showCancelButton === undefined || true;
            en.confirmButtonText = en.confirmButtonText || "确定！";
            en.cancelButtonText = en.cancelButtonText || "取消！";

            var clickAction = attr.ngClick;
            element.bind('click', function () {
                swal(en, function (isConfirm) {
                    if (isConfirm) {
                        scope.$eval(clickAction);
                    }
                });
            });
        });
    }
})
.directive("dateTimePicker", ['$ocLazyLoad', function ($ocLazyLoad) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            ngModel: '=',
            option:'='
        },
        link: function (scope, element, attr, ngModel) {
            scope.option = scope.option ||
                {
                    //mask:'9999/19/39 29:59',
                    formatTime: 'H:i',
                    formatDate: 'Y.m.d',
                    timepickerScrollbar: false
                }
            $ocLazyLoad.load('datetimepicker').then(function () {
                $.datetimepicker.setLocale('zh');
                element.datetimepicker(scope.option);
            })
        }
    }
}])
.directive('companySelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            Clear: '=',
            ngDisabled: '=',
            searchEnabled: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select name="{{ ngName }}" ng-model="$parent.ngModel"  class="{{ selectClass }}" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="myRequired">'
                  + '  <ui-select-match placeholder="选择组织...">{{ $select.selected.CompanyName }}</ui-select-match>       '
                  + ' <ui-select-choices repeat="item.CompanyNo as item in data | filter: $select.search track by item.CompanyNo">                          '
                  + '      <div ng-bind-html="item.CompanyNo | highlight: $select.search"></div>                             '
                  + '      <small ng-bind-html="item.CompanyName | highlight: $select.search"></small>                       '
                  + '  </ui-select-choices>                                                                                  '
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + '</div>'
        ,
        link: link,
        compile: function (tELe, tAttrs, transcludeFn) {
            //进行编译后的dom操作
            return {
                pre: function (scope, iElement, iAttrs, controller) {
                    //// 在子元素被链接之前执行
                    //uiLoad.Load("ui.select");
                },
                post: function (scope, iElement, iAttrs, controller) {
                    // 在子元素被链接之后执行
                }
            }
        }
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        //组织
        AjaxService.GetEntities("Company").then(function (data) {
            scope.data = data;
            $.grep(data, function (e) {
                if (e.CompanyNo === scope.ngModel) {
                    scope.selectItem = e;
                    return;
                }
            });
        });
    }
}])
.directive('systemSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            searchEnabled: '=',
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select  ng-model="$parent.ngModel" theme="bootstrap"  class="{{ selectClass }}" search-enabled="searchEnabled" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + ' <ui-select-match placeholder="选择系统...">{{ $select.selected.SysName }}</ui-select-match>       '
                  + ' <ui-select-choices repeat="item.SysNo as item in data | filter: $select.search track by item.SysNo">             '
                  + '      <div ng-bind-html="item.SysNo | highlight: $select.search"></div>                             '
                  + '      <small ng-bind-html="item.SysName | highlight: $select.search"></small>                       '
                  + '  </ui-select-choices>                                                                                  '
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
                  ,

        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        //组织
        AjaxService.GetEntities("SystemList").then(function (data) {
            scope.data = data;
        });
    }
}])
.directive('functionSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            funType: '@',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select ng-model="$parent.ngModel" ng-change="ngChange()" theme="bootstrap" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '  <ui-select-match placeholder="请选择...">{{ $select.selected.FunName }}</ui-select-match>'
                  + ' <ui-select-choices repeat="item.FunNo as item in data | filter: $select.search track by item.FunNo">'
                  + '      <div ng-bind-html="item.FunNo | highlight: $select.search"></div>'
                  + '      <small ng-bind-html="item.FunName | highlight: $select.search"></small>'
                  + '  </ui-select-choices>'
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        var en = {};
        en.name = 'FunType';
        en.value = scope.funType == 1 ? 1 : 2;
        //组织
        AjaxService.GetEntities("Function", en).then(function (data) {
            scope.data = data;
        });
    }
}])
.directive('userSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            placeholder: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '  <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.ChiLastName }}{{ $select.selected.ChiFirstName }}</ui-select-match>'
                  + ' <ui-select-choices repeat="item.UserNo as item in data | filter: $select.search track by item.UserNo">'
                  + '      <div ng-bind-html="item.UserNo | highlight: $select.search"></div>'
                  + '      <small><span ng-bind-html="item.ChiLastName | highlight: $select.search"></span><span ng-bind-html="item.ChiFirstName | highlight: $select.search"></span></small>'
                  + '  </ui-select-choices>'
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };

    function link($scope, element, attrs) {
        $scope.data = undefined;
        $scope.placeholder = $scope.placeholder || "请选择...";
        //组织
        AjaxService.GetPlans("User").then(function (data) {
            $scope.data = data;
        });
    }
}])
.directive('funFileSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            fileType: '=',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected }}</ui-select-match>'
                  + '          <ui-select-choices repeat="item in data | filter: $select.search track by item">'
                  + '             <div ng-bind-html="item | highlight: $select.search"></div>'
                  + '         </ui-select-choices>'
                  + '     </ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        //组织
        AjaxService.HandleFile(scope.fileType).then(function (data) { scope.data = data; });

    }
}])
.directive('objectSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            obConnect: '=',
            obType: '=',
            ngDisabled: '=',
            placeholder: '@',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template:  '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.Name }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item in data | filter: $select.search track by item.Name" refresh="refresh($select.search)" refresh-delay="0">'
                  + '             <small><span ng-bind-html="item.DbSchema | highlight: $select.search"></span>.<span ng-bind-html="item.Name | highlight: $select.search"</span></small>'
                  + '         </ui-select-choices>'
                  + '     </ui-select>'
        ,
        link: link
    };
    function link(scope, element, attrs) {
        scope.data = undefined;
        scope.$watch('obConnect', getData);
        scope.placeholder = scope.placeholder || "请选择...";

        function getData(newValue, oldValue) {
            if (scope.obConnect) {
                scope.data = undefined;
                AjaxService.GetDbObject(scope.obConnect, scope.obType, '').then(function (data) {
                    scope.data = data.data;
                    scope.ListData = angular.copy(scope.data);
                });
            }
        }

        scope.refresh = function refresh(ser) {
            if (ser) {
                scope.data = [];
                scope.ListData = scope.ListData || [];
                for (var j = 0, len = scope.ListData.length; j < len; j++) {
                    if ((scope.ListData[j].DbSchema.toUpperCase().indexOf(ser.toUpperCase()) !== -1) || (scope.ListData[j].Name.toUpperCase().indexOf(ser.toUpperCase()) !== -1)) {
                        scope.data.push(scope.ListData[j]);
                    }
                }
                //取服务器获取新数据
                if (scope.data.length === 0) {
                    scope.data = undefined;
                    AjaxService.GetDbObject(scope.obConnect, scope.obType, ser).then(function (data) {
                        scope.data = data.data;
                    });
                }
            }
            else {
                scope.data = scope.ListData;
            }
        }
    }
}])
.directive('connectSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange: '&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()"  class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item in data | filter: $select.search track by item" refresh-delay="0">'
                  + '             <div ng-bind-html="item | highlight: $select.search"></div>'
                  + '         </ui-select-choices>'
                  + '     </ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };
    function link(scope, element, attrs) {
        AjaxService.GetConnect().then(function (data) {
            scope.data = data;
            scope.ListData = angular.copy(scope.data);
            scope.ngModel = scope.ngModel || data[0];
        });
    }
}])
.directive('configSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            searchEnabled: '=',
            configOption: '=',
            placeholder: '@',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            autoFirst:'@',
            ngChange:'&'
        },
        template: '<ui-select name="{{ ngName }}" ng-change="ngChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="myRequired">'
                  + ' <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.ClDesc }}</ui-select-match>       '
                  + ' <ui-select-choices repeat="item.ClInf as item in data | propsFilter: {ClInf: $select.search, ClDesc: $select.search}">                          '
                  + '      <div ng-bind-html="item.ClDesc | highlight: $select.search"></div>'
                  + '  </ui-select-choices>'
                  + '</ui-select>'
        ,
        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        scope.placeholder = scope.placeholder || "请选择...";
        if (scope.configOption) {
            //组织
            AjaxService.GetTableConfig(scope.configOption.Table, scope.configOption.Column).then(function (data) {
                scope.data = data;
                if (data.length > 0 && scope.autoFirst) {
                    scope.ngModel = scope.ngModel || data[0].ClInf;
                }
            });
        }
    }
}])
.directive('commonDataSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            searchEnabled: '=',
            placeholder: '@',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange: '&'
        },
        template: '<ui-select name="{{ ngName }}" ng-change="ngChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="myRequired">'
                    + ' <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.ComName }}</ui-select-match>       '
                    + ' <ui-select-choices repeat="item.ComName as item in data | propsFilter: {ComName: $select.search}">                          '
                    + '      <div ng-bind-html="item.ComName | highlight: $select.search"></div>'
                    + '  </ui-select-choices>'
                    + '</ui-select>'
        ,
        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        scope.placeholder = scope.placeholder || "请选择...";
        AjaxService.GetPlans("CommonData").then(function (data) {
            scope.data = data;
            if (data.length > 0) {
                scope.ngModel = scope.ngModel || data[0].ComName;
            }
        });
    }
}])
.directive('entitySelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            obType: '=',
            ngDisabled: '=',
            connectName: "=",
            clear: '=',
            selectClass: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" ng-change="ngChange()" class="{{ selectClass }}" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected.EntityName }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item.EntityName as item in data | filter: $select.search track by item.EntityName" refresh="refresh($select.search)" refresh-delay="0">'
                  + '             <div ng-bind-html="item.EntityName | highlight: $select.search"></div>'
                  + '         </ui-select-choices>'
                  + '     </ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };
    function link(scope, element, attrs) {
        scope.$watch('connectName', getData);
        scope.data = undefined;
        function getData(newValue, oldValue) {
            scope.data = undefined;
            scope.ngModel = newValue != oldValue ? undefined : scope.ngModel;
            var en = {};
            en.name = 'ConnectName';
            en.value = scope.connectName || '';
            AjaxService.GetPlans("SelectEntity", en).then(function (data) {
                scope.data = data;
                scope.ListData = angular.copy(scope.data);
            });
        }

        scope.refresh = function refresh(ser) {
            if (ser) {
                scope.data = [];
                scope.ListData = scope.ListData || [];
                for (var j = 0, len = scope.ListData.length; j < len; j++) {
                    if ((scope.ListData[j].EntityName.toUpperCase().indexOf(ser.toUpperCase()) != -1)) {
                        scope.data.push(scope.ListData[j]);
                    }
                }
                //取服务器获取新数据
                if (scope.data.length == 0) {
                    scope.data = undefined;
                    scope.ngModel = undefined;
                    var en = {}, list = [];
                    en.name = 'ConnectName';
                    en.value = scope.connectName;
                    en.type = "=";
                    list.push(en);
                    var en2 = {};
                    en2.name = 'EntityName';
                    en2.value = '%' + ser + '%';
                    en2.type = 'like';
                    list.push(en2);
                    AjaxService.GetPlans("SelectEntity", list).then(function (data) {
                        scope.data = data;
                    });
                }
            }
            else {
                scope.data = scope.ListData;
            }
        }
    }
}])
//文件导入
.directive('importSheetJs', ['$q', 'AjaxService', 'toastr', 'FileLoad', 'ToJsonWorker', 'Version',
    function ($q, AjaxService, toastr, FileLoad, ToJsonWorker, Version) {
        return {
            restrict: 'A',
            //require:'ngModel',
            scope: {
                isImport: '@',
                fileType: '@',
                opts: '=',
                ngComplete: '&'
            },
            //templateUrl: 'js/directives/ImportSheetJs.html',
            templateUrl: 'js/directives/ImportSheetJs.html?v=' + Version,
            link: function ($scope, elm) {
                $scope.opts = $scope.opts || {};
                $scope.fileType = $scope.fileType || "*";
                $scope.isImport = $scope.isImport || 'false';
                $scope.ngModel = $scope.ngModel || '';
                var op = $scope.opts;
                op.sheetNum = op.sheetNum || 1;


                $scope.Open = function (e) {
                    e.target.parentNode.parentElement.firstElementChild.click();
                }
                var fileInput = elm[0].firstElementChild.firstElementChild.firstElementChild;
                var circle = elm[0].lastElementChild;


                //事件添加
                fileInput.onchange = function (changeEvent) {
                    //圆形进度条
                    //$(circle).circleChart({
                    //    size: 20,
                    //    value: 1,
                    //});

                    if (!changeEvent.target.files || changeEvent.target.files.length == 0) {
                        return;
                    }
                    var file = changeEvent.target.files[0];

                    var exec = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name.toLowerCase()) : '';

                    if ($scope.fileType != "*" && $scope.fileType.indexOf(exec[0]) == -1) {
                        toastr.error("文件格式不对，请上传 " + $scope.fileType + " 文件!");
                        return false;
                    }

                    /* update scope */
                    $scope.$apply(function () {
                        $scope.ngModel = file.name;
                        $scope.Progress = 0;
                    });
                    var option = {};
                    option.file = file;
                    //option.type = 'text';
                    option.onProcent = function process(pro) {
                        var d = $q.defer();
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.Progress = pro;
                            });
                        }, 1000);
                        d.resolve('');
                        return d.promise;
                    };
                    option.onComplete = function (data) {
                        ToJsonWorker.onmessage = function (evt) {
                            $scope.$apply(function () {
                                $scope.opts.data = evt.data;
                                $scope.ngComplete();
                                $scope.Progress = 0;
                            });
                        };
                        ToJsonWorker.postMessage({ data: data, op: op });
                        //var sheet = {};
                        //sheet.ColumnsName = ["生成条码", "客户SN码", "模块二维码", "绑定时间"]
                        //sheet.FirstColunms = false;
                        //AjaxService.FileImport('', '', '', file, data, sheet).then(function (data2) {
                        //    console.log(data2)
                        //})
                        //ToJson(data);
                    };
                    FileLoad.Load(option);
                }

                function ToJson(data) {
                    //var d = $q.defer();
                    //console.log(data.length);
                    var wb = XLSX.read(data, { type: 'binary' });
                    var Data = [];
                    for (var i = 0; i < op.sheetNum; i++) {
                        var wsname = wb.SheetNames[i];
                        var ws = wb.Sheets[wsname];
                        var aoa = XLSX.utils.sheet_to_json(ws, op.header);
                        Data.push(aoa);
                    }
                    $scope.opts.data = Data;
                    $scope.ngComplete();
                    //$scope.Progress = 0;
                    //d.resolve(Data);
                    //return d.promise;
                }
            }
        }
    }])
.directive('fileUploadMuti', ['$window', 'Version', 'toastr', 'FileService',
    function ($window, Version, toastr, FileService) {
        return {
            restrict: 'A',
            scope: {
                ngDisabled: '@',
                fileType: '@',
                ngName: '@',
                ngRequired: '@',
                placeholder: '@',
                ableDrag:'@',
                fileData: '=',
                ngComplete: '&'
            },
            templateUrl: 'js/directives/UploadFileMuti.html?v=' + Version,
            controller: ['$scope',function ($scope) {
                var option = {};
                $scope.List = [];
                $scope.fileData = $scope.fileData || [];
                option.onComplete = function (data) {
                    if ($scope.ngComplete)
                    {
                        $scope.ngComplete();
                    }
                }
                option.onCompleteItem = function (item) {
                    $scope.fileData.push(angular.copy(item.data));
                    item.remove();
                }
                if ($scope.fileType && $scope.fileType != "*")
                {
                    option.filter = $scope.fileType;
                }

                $scope.uploader = FileService.upLoad(option);
            }],
            link: function ($scope, elm) {
                $scope.fileType = $scope.fileType || "*";
                $scope.opts = $scope.opts || {};
                $scope.ngDisabled = $scope.ngDisabled || 'false';
                var op = $scope.opts;

                $scope.Open = function (e) {
                    e.target.parentNode.parentElement.parentElement.lastElementChild.click();
                }
                $scope.Delete = function (index) {
                    $scope.fileData.splice(index, 1);
                }
                $scope.DownLoad = function (url){
                    $window.open(url);
                }
            }
        }
    }])
.directive('fileUpload', ['$window', 'Version', 'toastr', 'FileService',
    function ($window, Version, toastr, FileService) {
        return {
            restrict: 'A',
            scope: {
                ngDisabled: '@',
                fileType: '@',
                ngName: '@',
                ngRequired: '@',
                placeholder: '@',
                fileData: '=',
                ngComplete: '&'
            },
            templateUrl: 'js/directives/UploadFile.html?v=' + Version,
            controller: ['$scope', function ($scope) {
                var option = {};
                $scope.fileData = $scope.fileData || {};
                option.onComplete = function (data) {
                    if ($scope.ngComplete) {
                        $scope.ngComplete();
                    }
                    $scope.isUploaded = true;
                }
                option.onCompleteItem = function (item) {
                    $scope.fileData = item.data;
                    $scope.item = item;
                }
                if ($scope.fileType && $scope.fileType != "*") {
                    option.filter = $scope.fileType;
                }

                $scope.uploader = FileService.upLoad(option);
                $scope.uploader.autoUpload = true;
            }],
            link: function ($scope, elm) {
                $scope.fileType = $scope.fileType || "*";
                $scope.ngDisabled = $scope.ngDisabled || 'false';
                $scope.Open = function (e) {
                    $scope.uploader.clearQueue();
                    e.target.parentNode.parentElement.parentElement.lastElementChild.click();
                }
                $scope.DownLoad = function (url) {
                    $window.open(url);
                }

                var fileInput = elm[0].firstElementChild.firstElementChild.lastElementChild;
                //事件添加
                fileInput.onchange = function (changeEvent) {
                    if (!changeEvent.target.files || changeEvent.target.files.length == 0) {
                        return;
                    }
                    var file = changeEvent.target.files[0].name;
                    var exec = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name.toLowerCase()) : '';
                    if ($scope.fileType != '*' &&  $scope.fileType.indexOf(exec[0]) == -1) {
                        return;
                    }
                    $scope.fileData.OriginalName = file.name;
                    $scope.isUploaded = false;
                }
            }
        }
    }])
//步骤条
.directive('ngStep', function () {
    return {
        restrict: 'A',
        scope: {
            opts: '=',
            //step: '@',
            //reject: '@',
        },
        template: '<div></div>',
        link: link
    };
    function link($scope, element, attr) {
        
        $scope.opts = $scope.opts || {};
        $scope.opts.now = $scope.opts.now || 1;
        $scope.opts.reject = $scope.opts.reject || $scope.opts.now;

        //ystep的外观大小
        //可选值：small,large
        $scope.opts.size = $scope.opts.size || "small";
        //ystep配色方案
        //可选值：green,blue
        $scope.opts.color = $scope.opts.color || 'green';
        
        $scope.opts.steps = $scope.opts.steps || [{
            //步骤名称
            title: "发起",
            //步骤内容(鼠标移动到本步骤节点时，会提示该内容)
            content: "步骤1"
        }, {
            title: "结束",
            content: "步骤2"
        }];

        //根据jQuery选择器找到需要加载ystep的容器
        //loadStep 方法可以初始化ystep
        $(element).loadStep($scope.opts);
        $(element).setStep($scope.opts.now, $scope.opts.reject);
    }
})
;
///<jscompress sourcefile="FileLoad.js" />
'use strict'
//importScripts("../Scripts/Concurrent.Thread/Concurrent.Thread.min.js");
//importScripts("../Scripts/SheetJs/xlsx.full.min.js");

angular.module('FileLoad', []).factory('FileLoad', ['$rootScope', '$q', 'AjaxService', '$ocLazyLoad',
function ($rootScope, $q, AjaxService, $ocLazyLoad) {
    
    var h = {
        Load: function (option) {

            //$ocLazyLoad.load('fileLoad').then(function () {
                var me = h;
                me.precetMethod = option.onProcent;
                me.type = option.type || 'binary';//binary,buffer,url,text
                me.encode = option.encode || 'utf-8';
                me.onComplete = option.onComplete;
                me.onSliceData = option.onProgress;
                me.onProcent = option.onProcent;
                //每次读取128k
                me.step = 1024 * 1024;
                me.loaded = 0;
                me.times = 0;
                me.result = '';
            
                var d = $q.defer();
                var file = me.file = option.file;
                var reader = me.reader = new FileReader();
                //
                me.total = file.size;

                reader.onloadstart = me.onLoadStart;
                reader.onprogress = me.onProgress;
                reader.onabort = me.onAbort;
                reader.onerror = me.onerror;
                reader.onload = me.onLoad;
                reader.onloadend = me.onLoadEnd;
                //读取第一块
                me.readBlob(file, me.loaded);
                me.result = me.result + reader.result;
            //})
        },
        onLoadStart: function () {
            var me = h;
        },
        onProgress: function (e) {
            var me = h;
            if (me.onProcent) {
                me.onProcent((me.loaded / me.total) * 100);
            }
        },
        onAbort: function () {
            var me = h;
        },
        onError: function () {
            var me = h;
        },
        onLoad: function (e) {
            var me = h;
            if (me.onSliceData) {
                me.onSliceData(e.target.result);
            }

            if (me.loaded < me.total) {
                me.result = me.result + e.target.result;
                me.readBlob(me.loaded);
                //下次读取
                me.loaded += me.step;
            } else {
                me.loaded = me.total;
                me.result = me.result + e.target.result;
                if (me.onComplete) {
                    me.onComplete(me.result);
                }
            }
            //console.log(me.result.length);
        },
        onLoadEnd: function () {
            var me = h;
        },
        readBlob: function (start) {
            var me = h;
            var blob, file = me.file;
            me.times += 1;
            if (file.slice) {
                blob = file.slice(start, start + me.step);
            } else {
                blob = file;
            }
            switch (me.type) {
                case 'binary': me.reader.readAsBinaryString(blob); break;
                case 'buffer': me.reader.readAsArrayBuffer(blob); break;
                case 'url': me.reader.readAsDataURL(blob); break;
                case 'text': me.reader.readAsText(blob, me.encode); break;
            }
        },
        abortHandler: function () {
            var me = h;
            if (me.reader) {
                me.reader.abort();
            }
        }
    };

    return h;
}
]);
///<jscompress sourcefile="FileService.js" />
(function () {
    angular.module('FileService', ['angularFileUpload']);

    angular.module('FileService').factory('FileService', FileService);

    FileService.$inject = ['FileUploader', 'FileServiceUrl', 'toastr'];

    function FileService(FileUploader, FileServiceUrl, toastr) {
        var file = {
            upLoad: function (option) {
                option = option || {};
                var me = file;
                me.List = [];
                option.maxFile = option.maxFile || 10;
                uploader = new FileUploader({
                    url:  FileServiceUrl + 'FileService.asmx/FileUpload'
                });
                // FILTERS
                uploader.filters.push({
                    name: 'maxFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < option.maxFile;
                    }
                });

                if (option.filter) {
                    uploader.filters.push({
                        name: 'FileFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var exec = (/[.]/.exec(item.name)) ? /[^.]+$/.exec(item.name.toLowerCase()) : '';
                            if (option.filter.indexOf(exec[0]) == -1) {
                                toastr.error("文件格式不对，请上传 " + option.filter + " 文件!");
                                return false;
                            }
                            return option.filter.indexOf(exec[0]) != -1;
                        }
                    });
                }

                uploader.filters.push({
                    name: 'asyncFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                        setTimeout(deferred.resolve, 1e3);
                    }
                });
                // CALLBACKS
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                   
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.log(response);
                    toastr.error('文件上传失败');
                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response[0]) {
                        me.List.push(response[0]);
                        fileItem.data = response[0];
                        if (option.onCompleteItem) {
                            option.onCompleteItem(fileItem);
                        }
                    }
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    
                };
                uploader.onCompleteAll = function () {
                    if (option.onComplete) {
                        option.onComplete(me.List);
                    }
                };
                return uploader;
            },
            
        };

        return file;
    }
})();;
///<jscompress sourcefile="ui-load.js" />
'use strict';

/**
 * 0.1.1
 * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
 * 
 * @ flatfull.com All Rights Reserved.
 * Author url: #user/flatfull
 */

angular.module('ui.load', [])
	.service('uiLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {

		var loaded = [];
		var promise = false;
		var deferred = $q.defer();

		/**
		 * Chain loads the given sources
		 * @param srcs array, script or css
		 * @returns {*} Promise that will be resolved once the sources has been loaded.
		 */
		this.load = function (srcs) {
		    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
		    var self = this;
		    if (!promise) {
		        promise = deferred.promise;
		    }
		    angular.forEach(srcs, function (src) {
		        promise = promise.then(function () {
		            return src.indexOf('.css') >= 0 ? self.loadCSS(src) : self.loadScript(src);
		        });
		    });
		    deferred.resolve();
		    return promise;
		}

		/**
		 * Dynamically loads the given script
		 * @param src The url of the script to load dynamically
		 * @returns {*} Promise that will be resolved once the script has been loaded.
		 */
		this.loadScript = function (src) {
			if(loaded[src]) return loaded[src].promise;

			var deferred = $q.defer();
			var script = $document[0].createElement('script');
			script.src = src;
			script.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			script.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].body.appendChild(script);
			loaded[src] = deferred;

			return deferred.promise;
		};

		/**
		 * Dynamically loads the given CSS file
		 * @param href The url of the CSS to load dynamically
		 * @returns {*} Promise that will be resolved once the CSS file has been loaded.
		 */
		this.loadCSS = function (href) {
			if(loaded[href]) return loaded[href].promise;

			var deferred = $q.defer();
			var style = $document[0].createElement('link');
			style.rel = 'stylesheet';
			style.type = 'text/css';
			style.href = href;
			style.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			style.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].head.appendChild(style);
			loaded[href] = deferred;

			return deferred.promise;
		};
}]);;
///<jscompress sourcefile="app.js" />
'use strict';
angular.module('app', [
    'appData',
    'ngAnimate',
    'toastr',
    'cgBusy',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'FileService',
    'toggle-switch',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'AjaxServiceModule',
    'ui.router.requirePolyfill',
    'MyDirective',
    'FileLoad'
]);
;
///<jscompress sourcefile="config.js" />
// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value = $provide.value;
    }
  ])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });

    //$translateProvider.translations('en', {
    //    'TITLE': 'Hello',
    //    'FOO': 'This is a paragraph'
    //});
     
    //$translateProvider.translations('zh',{
    //    'TITLE':'你好',
    //    'FOO':'这是一幅图'
    //});
     

        $translateProvider.preferredLanguage('zh');

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('cn');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);;
///<jscompress sourcefile="config.lazyload.js" />
// lazyload config

angular.module('app')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['Scripts/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['Scripts/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['Scripts/jquery/charts/flot/jquery.flot.min.js', 
                          'Scripts/jquery/charts/flot/jquery.flot.resize.js',
                          'Scripts/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          'Scripts/jquery/charts/flot/jquery.flot.spline.js',
                          'Scripts/jquery/charts/flot/jquery.flot.orderBars.js',
                          'Scripts/jquery/charts/flot/jquery.flot.pie.min.js'],
      slimScroll:     ['Scripts/jquery/slimscroll/jquery.slimscroll.min.js'],
      sortable:       ['Scripts/jquery/sortable/jquery.sortable.js'],
      nestable:       ['Scripts/jquery/nestable/jquery.nestable.js',
                          'Scripts/jquery/nestable/nestable.css'],
      filestyle:      ['Scripts/jquery/file/bootstrap-filestyle.min.js'],
      slider:         ['Scripts/jquery/slider/bootstrap-slider.js',
                          'Scripts/jquery/slider/slider.css'],
      chosen:         ['Scripts/jquery/chosen/chosen.jquery.min.js',
                          'Scripts/jquery/chosen/chosen.css'],
      TouchSpin:      ['Scripts/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                          'Scripts/jquery/spinner/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['Scripts/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          'Scripts/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['Scripts/jquery/datatables/jquery.dataTables.min.js',
                          'Scripts/jquery/datatables/dataTables.bootstrap.js',
                          'Scripts/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['Scripts/jquery/jvectormap/jquery-jvectormap.min.js', 
                          'Scripts/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          'Scripts/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          'Scripts/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['Scripts/jquery/footable/footable.all.min.js',
                          'Scripts/jquery/footable/footable.core.css']
      }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  false,
          events: true,
          modules: [
              {
                  name: 'uiGrid',
                  files: [
                      'Scripts/ui-grid.min.js',
                      'Content/ui-grid.min.css'
                  ]
              },
              {
                  name: 'ngGrid',
                  files: [
                      'Scripts/modules/ng-grid/ng-grid.min.js',
                      'Scripts/modules/ng-grid/ng-grid.min.css',
                      'Scripts/modules/ng-grid/theme.css'
                  ]
              },
              {
                  name: 'fileLoad',
                  files: [
                      'Scripts/SheetJs/xlsx.full.min.js',
                  ]
              },
              {
                  name: 'datetimepicker',
                  files: [
                      //'Scripts/bootstrap/DateTimePicker/bootstrap-datetimepicker.min.css',
                      //'Scripts/bootstrap/DateTimePicker/bootstrap-datetimepicker.min.js',
                      'Scripts/jquery/DateTimePicker/jquery.datetimepicker.min.css',
                      'Scripts/jquery/DateTimePicker/jquery.datetimepicker.full.min.js',
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      'Scripts/select.min.js',
                      'Content/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    'Scripts/modules/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['Scripts/modules/angular-ui-calendar/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      'Scripts/modules/ngImgCrop/ng-img-crop.js',
                      'Scripts/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      'Scripts/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                      'Scripts/modules/angular-bootstrap-nav-tree/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      'Scripts/modules/angularjs-toaster/toaster.js',
                      'Scripts/modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      'Scripts/modules/textAngular/textAngular-sanitize.min.js',
                      'Scripts/modules/textAngular/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      'Scripts/modules/angular-slider/angular-slider.min.js',
                      'Scripts/modules/angular-slider/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      'Scripts/modules/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      'Scripts/modules/videogular/plugins/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      'Scripts/modules/videogular/plugins/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      'Scripts/modules/videogular/plugins/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      'Scripts/modules/videogular/plugins/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      'Scripts/modules/videogular/plugins/ima-ads.min.js'
                  ]
              }
          ]
      });
  }])
;;
///<jscompress sourcefile="config.router.js" />
'use strict';
angular.module('app').run(Run);
Run.$inject = ['$rootScope', '$state', '$stateParams', '$cookieStore', '$window', '$q', 'AjaxService', 'router', 'appUrl', 'Version'];
function Run($rootScope, $state, $stateParams, $cookieStore, $window, $q, AjaxService, router, appUrl, Version) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $cookieStore.put('active-function', "Main");
    //State Change Start
    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    //console.log($state.current.name)
    //檢查是否登入
    function onStateChangeStart(e, toState, toParams, fromState, fromParams) {
        if (!$cookieStore.get('user-token')) {
            $window.location.href = appUrl + 'Acess.html#!/login';
        }
    }
    //获取路由信息
    AjaxService.LoginAction("GetFunRoute").then(function (data) {
        angular.forEach(data, function (item) {
            var route = {};
            route.Name = item.RouteName;
            route.Url = item.RouteUrl;
            route.Controller = item.Controller;
            route.ControllerAs = item.ControllerAs;
            route.TempleteUrl = item.FunHtml + "?v=" + Version;
            route.FunNo = item.FunNo;
            if (item.FunLoad) {
                var loadJs = [];
                angular.forEach(item.FunLoad, function (l) {
                    loadJs.push(l.LoadName + "?v=" + Version);
                });
                route.LazyLoad = loadJs;
            }
            router.setDataRouters(route);
        });
    });

    //获取用户信息
    AjaxService.LoginAction("GetLoginEmp").then(function (data) {
        $rootScope.User = data;
    });

    //获取dialog信息
    AjaxService.GetPlans('Dialog').then(function (data) {
        $rootScope.DialogData = data;
    });
}

angular.module('app').config(Config);
Config.$inject = ['$stateProvider', '$urlRouterProvider', "Version"];
function Config($stateProvider, $urlRouterProvider, Version) {
    $urlRouterProvider
        .otherwise('/app/dashboard-v1');
    $stateProvider
        .state('app', {
            //表明此状态不能被显性激活，只能被子状态隐性激活
            abstract: true,
            url: '/app',
            controllerAs: 'vm',
            controller: 'AppCtrl',
            templateUrl: 'Basic/app.html' + "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['ui.select', 'ngGrid']);
                  }]
            }
        })
        .state('apps', {
            abstract: true,
            controllerAs: 'vm',
            controller: 'AppCtrl',
            url: '/apps',
            templateUrl: 'Basic/layout.html' + "?v=" + Version
        })
        //首页
        .state('app.dashboard-v1', {
            url: '/dashboard-v1',
            templateUrl: 'Basic/app_dashboard_v1.html'+ "?v=" + Version,
            resolve: {
                deps: ['$ocLazyLoad',
                  function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['js/controllers/chart.js']);
                  }]
            }
        })
        .state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>'
        })
};
///<jscompress sourcefile="Dialog.js" />
'use strict'
angular.module('app').factory('Dialog', ['$rootScope', '$ocLazyLoad', '$uibModal', '$q', 'AjaxService', 'Version',
function ($rootScope, $ocLazyLoad, $uibModal, $q, AjaxService, Version) {
    var obj = {
        //開啟
        open: open
    };

    return obj;

    //開啟
    function open(name, resolve, option) {
        var d = $q.defer();
        var
            dialog = $.grep($rootScope.DialogData, function (e) { return e.name == name; })[0],
            config = angular.extend({
                templateUrl: dialog.templateUrl + "?v=" + Version,
                controller: dialog.controller,
                backdrop: dialog.backdrop || 'static',
                size: dialog.size
            }, option || {});

        if (dialog.controllerAs) {
            config.controllerAs = dialog.controllerAs;
        }

        if (dialog.keyboard && config.keyboard == undefined) {
            config.keyboard = dialog.keyboard == 'true';
        }

        config.resolve = resolve;
        if (dialog.LoadFiles) {
            var loadList = [];
            for (var i = 0, len = dialog.LoadFiles.length; i < len; i++) {
                loadList.push(dialog.LoadFiles[i].LoadName+ "?v=" + Version);
            }
            $ocLazyLoad.load(loadList).then(function () {
                d.resolve($uibModal.open(config).result);
            });
        }
        return d.promise;
    }
}

])
;
///<jscompress sourcefile="main.js" />
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
        $scope.$watch('vm.app.settings', function () {
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
                $window.location.href = appUrl + 'Acess.html#!/login';
            })
        }

        function isSmartDevice($window) {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

    }]);;
///<jscompress sourcefile="Router.js" />
'use strict'
//angular.module('Routing', ['ui.router', 'oc.lazyLoad'])
angular.module('app')
.provider('router', function ($stateProvider) {
      var urlCollection;
      this.$get = function ($http, $state) {
          return {
              setUpRoutes: function () {
                  $http.get(urlCollection).success(function (collection) {
                      for (var routeName in collection) {
                          if (!$state.get(routeName)) {
                              $stateProvider.state(routeName, collection[routeName]);
                          }
                      }
                  });
              },
              //配置路由
              setDataRouters: function (route) {
                  if (!$state.get(route.Name)) {
                      var item = {};
                      item.url = route.Url;
                      item.templateUrl = route.TempleteUrl;
                      if (route.Controller) {
                          item.controller = route.Controller;
                      }
                      if (route.ControllerAs) {
                          item.controllerAs = route.ControllerAs;
                      }
                      if (route.LazyLoad && route.LazyLoad.length > 0)
                      {
                          var len = route.LazyLoad.length;
                          item.resolve = {
                              deps: ['$ocLazyLoad',
                              function ($ocLazyLoad) {
                                  return $ocLazyLoad.load(route.LazyLoad);
                              }]
                          }
                      }

                      item.resolve = angular.extend(item.resolve || {}, {
                          Fun: ['$cookieStore', function ($cookieStore) {
                              $cookieStore.put('active-function', route.FunNo);
                              return route.FunNo;
                          }]
                      });
                      $stateProvider.state(route.Name, item);
                  }
              }
          }
      };
      this.setCollectionUrl = function (url) {
          urlCollection = url;
      }
  });
///<jscompress sourcefile="setnganimate.js" />
angular.module('app')
  .directive('setNgAnimate', ['$animate', function ($animate) {
    return {
        link: function ($scope, $element, $attrs) {
            $scope.$watch( function() {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function(valnew, valold){
                $animate.enabled(!!valnew, $element);
            });
        }
    };
  }]);;
///<jscompress sourcefile="ui-butterbar.js" />
angular.module('app')
  .directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
     return {
      restrict: 'AC',
      template:'<span class="bar"></span>',
      link: function(scope, el, attrs) {        
        el.addClass('butterbar hide');
        scope.$on('$stateChangeStart', function(event) {
          $anchorScroll();
          el.removeClass('hide').addClass('active');
        });
        scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
          event.targetScope.$watch('$viewContentLoaded', function(){
            el.addClass('hide').removeClass('active');
          })
        });
      }
     };
  }]);;
///<jscompress sourcefile="ui-focus.js" />
angular.module('app')
  .directive('uiFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attr) {
        var model = $parse(attr.uiFocus);
        scope.$watch(model, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function () {
            if (model && model.assign) {
                scope.$apply(model.assign(scope, false));
            }
        });
      }
    };
  });;
///<jscompress sourcefile="ui-fullscreen.js" />
 angular.module('app')
  .directive('uiFullscreen', ['uiLoad', '$document', '$window', function(uiLoad, $document, $window) {
    return {
      restrict: 'AC',
      template:'<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
      link: function(scope, el, attr) {
        el.addClass('hide');
        uiLoad.load('Scripts/libs/screenfull.min.js').then(function () {
          // disable on ie11
          if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
            el.removeClass('hide');
          }
          el.on('click', function(){
            var target;
            attr.target && ( target = $(attr.target)[0] );            
            screenfull.toggle(target);
          });
          $document.on(screenfull.raw.fullscreenchange, function () {
            if(screenfull.isFullscreen){
              el.addClass('active');
            }else{
              el.removeClass('active');
            }
          });
        });
      }
    };
  }]);;
///<jscompress sourcefile="ui-jq.js" />
'use strict';

/**
 * 0.1.1
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq', ['ui.load']).
  value('uiJqConfig', {}).
  directive('uiJq', ['uiJqConfig', 'JQ_CONFIG', 'uiLoad', '$timeout', function uiJqInjectingFunction(uiJqConfig, JQ_CONFIG, uiLoad, $timeout) {

  return {
    restrict: 'A',
    compile: function uiJqCompilingFunction(tElm, tAttrs) {

      if (!angular.isFunction(tElm[tAttrs.uiJq]) && !JQ_CONFIG[tAttrs.uiJq]) {
        throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
      }
      var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

      return function uiJqLinkingFunction(scope, elm, attrs) {

        function getOptions(){
          var linkOptions = [];

          // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
          if (attrs.uiOptions) {
            linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
            if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
              linkOptions[0] = angular.extend({}, options, linkOptions[0]);
            }
          } else if (options) {
            linkOptions = [options];
          }
          return linkOptions;
        }

        // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
        if (attrs.ngModel && elm.is('select,input,textarea')) {
          elm.bind('change', function() {
            elm.trigger('input');
          });
        }

        // Call jQuery method and pass relevant options
        function callPlugin() {
          $timeout(function() {
            elm[attrs.uiJq].apply(elm, getOptions());
          }, 0, false);
        }

        function refresh(){
          // If ui-refresh is used, re-fire the the method upon every change
          if (attrs.uiRefresh) {
            scope.$watch(attrs.uiRefresh, function() {
              callPlugin();
            });
          }
        }

        if ( JQ_CONFIG[attrs.uiJq] ) {
          uiLoad.load(JQ_CONFIG[attrs.uiJq]).then(function() {
            callPlugin();
            refresh();
          }).catch(function() {
            
          });
        } else {
          callPlugin();
          refresh();
        }
      };
    }
  };
}]);;
///<jscompress sourcefile="ui-module.js" />
angular.module('app')
  .directive('uiModule', ['MODULE_CONFIG','uiLoad', '$compile', function(MODULE_CONFIG, uiLoad, $compile) {
    return {
      restrict: 'A',
      compile: function (el, attrs) {
        var contents = el.contents().clone();
        return function(scope, el, attrs){
          el.contents().remove();
          uiLoad.load(MODULE_CONFIG[attrs.uiModule])
          .then(function(){
            $compile(contents)(scope, function(clonedElement, scope) {
              el.append(clonedElement);
            });
          });
        }
      }
    };
  }]);;
///<jscompress sourcefile="ui-nav.js" />
angular.module('app')
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }
         
          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }]);;
///<jscompress sourcefile="ui-scroll.js" />
angular.module('app')
  .directive('uiScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.uiScroll);
          $anchorScroll();
        });
      }
    };
  }]);;
///<jscompress sourcefile="ui-shift.js" />
angular.module('app')
  .directive('uiShift', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, el, attr) {
        // get the $prev or $parent of this el
        var _el = $(el),
            _window = $(window),
            prev = _el.prev(),
            parent,
            width = _window.width()
            ;

        !prev.length && (parent = _el.parent());
        
        function sm(){
          $timeout(function () {
            var method = attr.uiShift;
            var target = attr.target;
            _el.hasClass('in') || _el[method](target).addClass('in');
          });
        }
        
        function md(){
          parent && parent['prepend'](el);
          !parent && _el['insertAfter'](prev);
          _el.removeClass('in');
        }

        (width < 768 && sm()) || md();

        _window.resize(function() {
          if(width !== _window.width()){
            $timeout(function(){
              (_window.width() < 768 && sm()) || md();
              width = _window.width();
            });
          }
        });
      }
    };
  }]);;
///<jscompress sourcefile="ui-toggleclass.js" />
angular.module('app')
.directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
          angular.forEach(classes, function( _class ) {
            var target = targets[(targets.length && key)];            
            ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
            $( target ).toggleClass(_class);
            key ++;
          });
          $(el).toggleClass('active');

          function magic(_class, target){
            var patt = new RegExp( '\\s' + 
                _class.
                  replace( /\*/g, '[A-Za-z0-9-_]+' ).
                  split( ' ' ).
                  join( '\\s|\\s' ) + 
                '\\s', 'g' );
            var cn = ' ' + $(target)[0].className + ' ';
            while ( patt.test( cn ) ) {
              cn = cn.replace( patt, ' ' );
            }
            $(target)[0].className = $.trim( cn );
          }
        });
      }
    };
  }])
.directive('uiRemoveClass', ['$timeout', '$document', function ($timeout, $document) {
    return {
        restrict: 'AC',
        //scope: {
        //    ngModel: '=',
        //},
        link: function (scope, el, attr) {
            el.on('click', function(e) {
                e.preventDefault();
                var classes = attr.uiRemoveClass.split(','),
                    targets = (attr.target && attr.target.split(',')) || Array(el),
                    key = 0;
                angular.forEach(classes, function( _class ) {
                    var target = targets[(targets.length && key)];            
                    ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
                    $(target).removeClass(_class);
                    key ++;
                });
                $(el).removeClass('active');

                function magic(_class, target){
                    var patt = new RegExp( '\\s' + 
                        _class.
                          replace( /\*/g, '[A-Za-z0-9-_]+' ).
                          split( ' ' ).
                          join( '\\s|\\s' ) + 
                        '\\s', 'g' );
                    var cn = ' ' + $(target)[0].className + ' ';
                    while ( patt.test( cn ) ) {
                        cn = cn.replace( patt, ' ' );
                    }
                    $(target)[0].className = $.trim( cn );
                }
            });
        }
    };
}]);;
///<jscompress sourcefile="ui-validate.js" />
'use strict';

/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of a custom formatters and / or parsers.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 */
angular.module('ui.validate',[]).directive('uiValidate', function () {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, validators = {},
          validateExpr = scope.$eval(attrs.uiValidate);

      if (!validateExpr){ return;}

      if (angular.isString(validateExpr)) {
        validateExpr = { validator: validateExpr };
      }

      angular.forEach(validateExpr, function (exprssn, key) {
        validateFn = function (valueToValidate) {
          var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
          if (angular.isObject(expression) && angular.isFunction(expression.then)) {
            // expression is a promise
            expression.then(function(){
              ctrl.$setValidity(key, true);
            }, function(){
              ctrl.$setValidity(key, false);
            });
            return valueToValidate;
          } else if (expression) {
            // expression is true
            ctrl.$setValidity(key, true);
            return valueToValidate;
          } else {
            // expression is false
            ctrl.$setValidity(key, false);
            return valueToValidate;
          }
        };
        validators[key] = validateFn;
        ctrl.$formatters.push(validateFn);
        ctrl.$parsers.push(validateFn);
      });

      function apply_watch(watch)
      {
          //string - update all validators on expression change
          if (angular.isString(watch))
          {
              scope.$watch(watch, function(){
                  angular.forEach(validators, function(validatorFn){
                      validatorFn(ctrl.$modelValue);
                  });
              });
              return;
          }

          //array - update all validators on change of any expression
          if (angular.isArray(watch))
          {
              angular.forEach(watch, function(expression){
                  scope.$watch(expression, function()
                  {
                      angular.forEach(validators, function(validatorFn){
                          validatorFn(ctrl.$modelValue);
                      });
                  });
              });
              return;
          }

          //object - update appropriate validator
          if (angular.isObject(watch))
          {
              angular.forEach(watch, function(expression, validatorKey)
              {
                  //value is string - look after one expression
                  if (angular.isString(expression))
                  {
                      scope.$watch(expression, function(){
                          validators[validatorKey](ctrl.$modelValue);
                      });
                  }

                  //value is array - look after all expressions in array
                  if (angular.isArray(expression))
                  {
                      angular.forEach(expression, function(intExpression)
                      {
                          scope.$watch(intExpression, function(){
                              validators[validatorKey](ctrl.$modelValue);
                          });
                      });
                  }
              });
          }
      }
      // Support for ui-validate-watch
      if (attrs.uiValidateWatch){
          apply_watch( scope.$eval(attrs.uiValidateWatch) );
      }
    }
  };
});
;
///<jscompress sourcefile="app-filter.js" />
'use strict'
//angular.module('Routing', ['ui.router', 'oc.lazyLoad'])
angular.module('app')
.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});;
///<jscompress sourcefile="fromNow.js" />
'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });;
