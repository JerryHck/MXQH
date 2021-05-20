'use strict'
angular.module('AppSet', [])

angular.module('AppSet')
.directive('stopPropagation', function () {
    return {
        restrict: 'A',
        link: link
    };
    function link(scope, element, attr) {
        element.on('click', function (e) {
            e.stopPropagation();
        });
    }
})
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
            option: '=',
            format: '@',
            step: '@',
        },
        link: function (scope, element, attr, ngModel) {
            scope.option = scope.option ||
                {
                    //mask:'9999/19/39 29:59',
                    format: scope.format || 'Y.m.d H:i',
                    //formatTime: 'H:i',
                    //formatDate: 'Y.m.d',
                    step: parseInt(scope.step || "5"),
                    timepickerScrollbar: false
                }
            //scope.option.formatTime = scope.option.formatTime || 'H:i';
            //scope.option.formatDate = scope.option.formatDate || 'Y.m.d';

            $ocLazyLoad.load('datetimepicker').then(function () {
                $.datetimepicker.setLocale('zh');
                element.datetimepicker(scope.option);
            })
        }
    }
}])
.directive("datePicker", ['$ocLazyLoad', function ($ocLazyLoad) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            ngModel: '=',
            option: '=',
            format: '@'
        },
        link: function (scope, element, attr, ngModel) {
            scope.option = scope.option ||
                {
                    //formatTime: 'H:i',
                    format: scope.format || 'Y/m/d',
                    formatDate: scope.format || 'Y/m/d',
                    timepicker: false,
                }
            //scope.option.formatTime = scope.option.formatTime || 'H:i';
            //scope.option.formatDate = scope.option.formatDate || 'Y.m.d';

            $ocLazyLoad.load('datetimepicker').then(function () {
                //console.log(scope.option);
                $.datetimepicker.setLocale('zh');
                element.datetimepicker(scope.option);
            })
        }
    }
}])
.directive("timePicker", ['$ocLazyLoad', function ($ocLazyLoad) {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            ngModel: '=',
            step: '@',
            format:'@'
        },
        link: function (scope, element, attr, ngModel) {
            scope.option = scope.option ||
                {
                    datepicker: false,
                    format: scope.format||'H:i:s',
                    step: parseInt(scope.step || "5")
                }
            //scope.option.formatTime = scope.option.formatTime || 'H:i';
            //scope.option.formatDate = scope.option.formatDate || 'Y.m.d';

            $ocLazyLoad.load('datetimepicker').then(function () {
                //console.log(scope.option);
                $.datetimepicker.setLocale('zh');
                element.datetimepicker(scope.option);
            })
        }
    }
}])
.directive('basicSelect', ['AjaxService', 'appUrl', '$window', function (AjaxService, appUrl, $window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            searchEnabled: '=',
            srcData: '=',
            clear: '=',
            selectClass: '@',
            autoFirst: '@',
            placeholder: '@',
            ngRequired: '@',
            ngName: '@',
            limit: '@',
            con:'@',
            ngChange: '&'
        },
        //templateUrl: function (element, attrs) {
        //    var url = appUrl + "CustomFun/UISelect/" + attrs.basicSelect + ".html?date=" + (new Date()).toString();
        //    return url;
        //},
        //从数据库中取得值
        template: function (element, attrs) {
            if (attrs.basicSelect) {
                var Con = {};
                Con.planName = "SysUISelect";
                Con.strJson = JSON.stringify([{ name: "SelectName", value: attrs.basicSelect }]);
                //var data = AjaxService.GetPlansWait("SysUISelect", { name: "SelectName", value: attrs.basicSelect })
                var data = AjaxService.DoBeforeWait("GetPlans", Con);
                attrs.SyData = data[0];
                if (attrs.SyData && attrs.SyData.HTMLCode && attrs.SyData.HTMLCode != "") {
                    return $window.decodeURIComponent($window.atob(attrs.SyData.HTMLCode));
                }
            }
        },
        link: link,
    };
    function link(scope, element, attrs) {
        //console.log(scope)
        scope.data = undefined;
        scope.autoFirst = scope.autoFirst || "false";
        var list = [], enName = undefined, ListData = [], NowList = [];
        if (attrs.SyData && attrs.SyData.SelectName == attrs.basicSelect) {
            enName = attrs.SyData;
            //获取数据
            var holder = attrs.SyData.Placeholder || "请选择...";
            scope.placeholder = scope.placeholder || holder;
            if (scope.con && scope.con != "") {
                list = AjaxService.convertArray(JSON.parse(scope.con));
            }
            else if (attrs.SyData.SerList && attrs.SyData.SerList.length > 0) {
                for (var i = 0, len = attrs.SyData.SerList.length; i < len; i++) {
                    var en = {};
                    en.name = attrs.SyData.SerList[i].ColName;
                    en.value = attrs.SyData.SerList[i].SerValue;
                    en.type = attrs.SyData.SerList[i].SerExp;
                    en.action = attrs.SyData.SerList[i].SerAss;
                    en.level = attrs.SyData.SerList[i].SerLevel;
                    list.push(en);
                }
            }
            IntiData(1);
        }

        function IntiData(index) {
            var list2 = angular.copy(list);
            if (scope.srcData && scope.srcData.length > 0) {
                ListData = angular.copy(scope.srcData);
                if (scope.autoFirst.toLowerCase() == 'true' && !scope.ngModel) {
                    scope.ngModel = enName.ReturnColumn == undefined || enName.ReturnColumn == '' ? ListData[0] : ListData[0][enName.ReturnColumn];
                }
                scope.limit = scope.limit || ListData.length;
                scope.limit = scope.limit == 0 ? 1 : scope.limit;
                //超过100时限定
                scope.limit = scope.limit > 100 ? 100 : scope.limit;
                InitSerData(1, ListData.length);
            }
            else {
                var Con2 = {};
                Con2.planName = enName.EntityName;
                Con2.strJson = JSON.stringify(list2);
                AjaxService.DoBefore("GetPlans", Con2).then(function (data2) {
                //AjaxService.GetPlans(enName.EntityName, list2).then(function (data2) {
                    ListData = angular.copy(data2);
                    if (scope.srcData) {
                        scope.srcData = data2;
                    }
                    if (data2.length > 0 && scope.autoFirst.toLowerCase() == 'true' && !scope.ngModel) {
                        scope.ngModel = enName.ReturnColumn == undefined || enName.ReturnColumn == '' ? data2[0] : data2[0][enName.ReturnColumn];
                    }
                    scope.limit = scope.limit || ListData.length;
                    scope.limit = scope.limit == 0 ? 1 : scope.limit;
                    //超过100时限定
                    scope.limit = scope.limit > 100 ? 100 : scope.limit;
                    InitSerData(1, ListData.length);
                });
            }
        }

        function InitSerData(index, total) {
            
            if (scope.ngModel && scope.ngModel != "" && Math.ceil(1.0 * total / scope.limit) >= index) {
                var have = false, count = index * scope.limit;
                var Templist = [];
                for (var j = count - scope.limit, len = count >= total ? total + scope.limit - count : count; j < len; j++) {
                    if (enName.ReturnColumn && ListData[j][enName.ReturnColumn] == scope.ngModel) {
                        have = true;
                    }
                    else if (!enName.ReturnColumn && ListData[j] == scope.ngModel) {
                        have = true;
                    }
                    Templist.push(ListData[j]);
                }
                if (have) {
                    scope.data = Templist;
                    NowList = angular.copy(Templist);
                }
                if (!have) {
                    //递回取值
                    InitSerData(index + 1, total);
                }
            }
            else {
                scope.data = ListData;
                NowList = angular.copy(ListData);
            }
        }

        scope.refresh = function refresh(ser) {
            if (ser) {
                scope.data = [];
                ListData = ListData || [];
                for (var j = 0, len = ListData.length; j < len; j++) {
                    if (( ListData[j][enName.ShowColumn] && ListData[j][enName.ShowColumn].toUpperCase().indexOf(ser.toUpperCase()) !== -1) ||
                        (ListData[j][enName.ShowSmallColumn] && ListData[j][enName.ShowSmallColumn].toUpperCase().indexOf(ser.toUpperCase()) !== -1)) {
                        scope.data.push(ListData[j]);
                    }
                }
                //取服务器获取新数据
                if (scope.data.length === 0) {
                    scope.data = [];
                    var list2 = angular.copy(list);
                    list2.push({ name: enName.ShowColumn, value: '%' + ser + '%' })
                    AjaxService.GetPlansTop(enName.EntityName, list2, 30).then(function (data) {
                        scope.data = data;
                    });
                }
            }
            else if (!ser || ser == "") {
                scope.data = angular.copy(NowList);
            }
        }

        scope.ValueChange = function () {
            if (scope.ngChange) {
                AjaxService.AjaxHandle("GetFileText", "123").then(function (data) {
                    scope.ngChange();
                })
            }
        }
    }
}])
.directive('serData', ['AjaxService', 'appUrl', function (AjaxService, appUrl) {
    return {
        restrict: 'A',
        scope: {
            list: '=',
            serData: '@',
        },
        link: link,
    };
    function link(scope, element, attrs) {
        if (scope.serData) {
            var en = [{ name: "SelectName", value: scope.serData }];
            //组织
            var promise = AjaxService.GetPlan("SysUISelect", en).then(function (data) {
                if (data.SelectName) {
                    //获取数据
                    var list = [];
                    if (data.SerList && data.SerList.length > 0) {
                        for (var i = 0, len = data.SerList.length; i < len; i++) {
                            var en = {};
                            en.name = data.SerList[i].ColName;
                            en.value = data.SerList[i].SerValue;
                            en.type = data.SerList[i].SerExp;
                            en.action = data.SerList[i].SerAss;
                            en.level = data.SerList[i].SerLevel;
                            list.push(en);
                        }
                    }
                    AjaxService.GetPlans(data.EntityName, list).then(function (data2) {
                        scope.list = data2;
                    });
                }
            });
        }
    }
}])
.directive('functionSelect', ['AjaxService', 'appUrl', 'Version', function (AjaxService, appUrl, Version) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            funType: '@',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            ngRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        templateUrl:  "js/directives/FunSelect.html?v=" + Version,
        link: link
    };

    function link(scope, element, attrs) {
        scope.data = undefined;
        var en = {};
        en.name = 'FunType';
        en.value = scope.funType == 1 ? 1 : 2;
        //组织
        AjaxService.GetPlans("FunSelect", en).then(function (data) {
            scope.data = data;
        });
    }
}])
.directive('funFileSelect', ['AjaxService', 'LoadModules', function (AjaxService, LoadModules) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            fileType: '=',
            ngDisabled: '=',
            clear: '=',
            selectClass: '@',
            ngRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="ngRequired">'
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
        AjaxService.HandleFile(scope.fileType).then(function (data) {
            if (scope.fileType == '2') {
                scope.data = data;
                scope.data = scope.data || [];
                for (var i = 0, len = LoadModules.length; i<len; i++){
                    scope.data.push(LoadModules[i].name);
                }
            }
            else {
                scope.data = data;
            }
            //scope.data = data;
        });

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
            ngRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template:  '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="ngRequired">'
                  + '         <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.Name }}</ui-select-match>'
                  + '          <ui-select-choices  repeat="item in data | filter: $select.search track by item.Name" refresh="refresh($select.search)" refresh-delay="0">'
                  + '             <small title="{{ item.DbSchema }}.{{ item.Name }} {{ item.TbDesc }}"><span ng-bind-html="item.Name | highlight: $select.search"</span></small>'
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
                var en = {};
                en.strCon = scope.obConnect;
                en.strType = scope.obType;
                en.strSearch = '';
                AjaxService.BasicCustom('GetDbObject', en).then(function (data) {
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
                    var en = {};
                    en.strCon = scope.obConnect;
                    en.strType = scope.obType;
                    en.strSearch = ser;
                    AjaxService.BasicCustom('GetDbObject', en).then(function (data) {
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
            ngRequired: '@',
            ngName: '@',
            ngChange: '&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-change="ngChange()"  class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="ngRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected.Conn }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item.Conn as item in data | filter: $select.search track by item.Conn" refresh-delay="0">'
                  + '             <div  style="min-width: 150px;"><span ng-bind-html="item.Conn | highlight: $select.search"></span>  <span class="pull-right h6 text-muted">{{ item.DbType }}</span></div>'
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
        AjaxService.BasicCustom("GetConnectList").then(function (data) {
            scope.data = data;
            scope.ListData = angular.copy(scope.data);
            scope.ngModel = scope.ngModel || data[0].Conn;
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
            tb: '@',
            col:'@',
            placeholder: '@',
            selectClass: '@',
            ngRequired: '@',
            ngName: '@',
            autoFirst:'@',
            ngChange:'&'
        },
        template: '<ui-select name="{{ ngName }}" ng-change="OnChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="ngRequired">'
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
        scope.autoFirst = scope.autoFirst || "false";
        scope.placeholder = scope.placeholder || "请选择...";
        if (scope.configOption || (scope.tb && scope.col)) {
            var tb = (scope.configOption && scope.configOption.Table) ? scope.configOption.Table : scope.tb;
            var col = scope.configOption && scope.configOption.Column ? scope.configOption.Column : scope.col;
            //组织
            AjaxService.GetTableConfig(tb, col).then(function (data) {
                scope.data = data;
                if (data.length > 0 && scope.autoFirst.toLowerCase() == 'true') {
                    scope.ngModel = scope.ngModel || data[0].ClInf;
                }
            });
        }
        scope.OnChange = function () {
            if (scope.ngChange) {
                AjaxService.doAysc().then(function (data) {
                    scope.ngChange();
                })
            }
        }
    }
}])
.directive('configSelectMulti', ['AjaxService', function (AjaxService) {
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
                ngRequired: '@',
                ngName: '@',
                autoFirst: '@',
                ngChange: '&'
            },
            template: '<ui-select name="{{ ngName }}" ng-change="ngChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="ngRequired" multiple>'
                      + ' <ui-select-match placeholder="{{ placeholder }}">{{ $item.ClDesc }}</ui-select-match>       '
                      + ' <ui-select-choices repeat="item.ClInf as item in data | propsFilter: {ClInf: $select.search, ClDesc: $select.search}">                          '
                      + '      <div ng-bind-html="item.ClDesc | highlight: $select.search"></div>'
                      + '  </ui-select-choices>'
                      + '</ui-select>'
            ,
            link: link
        };

        function link(scope, element, attrs) {
            scope.data = undefined;
            scope.autoFirst = scope.autoFirst || "false";
            scope.placeholder = scope.placeholder || "请选择...";
            if (scope.configOption) {
                //组织
                AjaxService.GetTableConfig(scope.configOption.Table, scope.configOption.Column).then(function (data) {
                    scope.data = data;
                    if (data.length > 0 && scope.autoFirst.toLowerCase() == 'true') {
                        if (!scope.ngModel || scope.ngModel.length == 0) {
                            scope.ngModel = [];
                            scope.ngModel.push(data[0].ClInf);
                        }
                    }
                });
            }
        }
}])
.directive('configCheck', ['AjaxService', function (AjaxService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                ngDisabled: '=',
                configOption: '=',
                tb: '@',
                col: '@',
                ngRequired: '@',
                size:'@',
                ngName: '@',
                ngChange: '&'
            },
            //template: '<ui-select name="{{ ngName }}" ng-change="OnChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="ngRequired">'
            //          + ' <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.ClDesc }}</ui-select-match>       '
            //          + ' <ui-select-choices repeat="item.ClInf as item in data | propsFilter: {ClInf: $select.search, ClDesc: $select.search}">                          '
            //          + '      <div ng-bind-html="item.ClDesc | highlight: $select.search"></div>'
            //          + '  </ui-select-choices>'
            //          + '</ui-select>'
            template: function (element, attrs) {
                if (attrs.horiz && attrs.horiz.toLowerCase() == 'true') {
                    return '   <label class="i-checks i-checks-sm padder-r-{{ size }}" ng-repeat="item in data">'
                           + '      <input autocomplete="off" name="{{ ngName }}" type="checkbox" ng-change="ngChecked(item)" '
                           + '          ng-required="checkReq()"  ng-disabled="ngDisabled" ng-model="item.Check"><i></i>{{ item.ClDesc }}'
                           + '  </label>'+ '</div>';
                }
                else {
                    return  '  <label class="i-checks i-checks-sm padder-r-sm col-xs-12" ng-repeat="item in data">'
                           + '      <input autocomplete="off" name="{{ ngName }}" type="checkbox" ng-change="ngChecked(item)" '
                           + '          ng-required="checkReq()" ng-disabled="ngDisabled"  ng-model="item.Check"><i></i>{{ item.ClDesc }}'
                           + '  </label>';
                }
            },
            link: link
        };

        function link(scope, element, attrs) {
            scope.size = scope.size || 'sm';
            scope.data = undefined;
            if (scope.configOption || (scope.tb && scope.col)) {
                var tb = (scope.configOption && scope.configOption.Table) ? scope.configOption.Table : scope.tb;
                var col = scope.configOption && scope.configOption.Column ? scope.configOption.Column : scope.col;
                //组织
                AjaxService.GetTableConfig(tb, col).then(function (data) {
                    scope.data = angular.copy(data);
                    scope.$watch('ngModel', Set);
                });
            }

            function Set() {
                if (scope.ngModel) {
                    var cList = [];
                    if (attrs.multi && attrs.multi.toLowerCase() == 'true') {
                        cList = scope.ngModel || [];
                    }
                    else {
                        cList.push(scope.ngModel)
                    }
                    for (var i = 0, len = scope.data.length; i < len; i++) {
                        for (var j = 0, len1 = cList.length; j < len1; j++) {
                            scope.data[i].Check = scope.data[i].ClInf == cList[j];
                        }
                    }
                }
            }

            //选中
            scope.ngChecked = function (item) {
                scope.data = scope.data || [];
                if (attrs.multi && attrs.multi.toLowerCase() == 'true') {
                    scope.ngModel = [];
                }
                for (var i = 0, len = scope.data.length; i < len; i++) {
                    if (attrs.multi && attrs.multi.toLowerCase() == 'true') {
                        if (scope.data[i].Check) {
                            scope.ngModel.push(scope.data[i].ClInf);
                        }
                    }
                    else {
                        if (scope.data[i].ClInf == item.ClInf && item.Check) {
                            scope.ngModel = scope.data[i].ClInf;
                        }
                        else if (scope.data[i].ClInf == item.ClInf && !item.Check) {
                            scope.ngModel = undefined;
                        }
                        else {
                            scope.data[i].Check = false;
                        }
                    }
                }
                if (scope.ngChange) {
                    AjaxService.doAysc().then(function (data) {
                        scope.ngChange();
                    })
                }
            }
            //验证必填
            scope.checkReq = function () {
                var b = false;
                if (attrs.ngRequired && attrs.ngRequired.toLowerCase() == 'true') {
                    b = true;
                    scope.data = scope.data || [];
                    for (var i = 0, len = scope.data.length; i < len; i++) {
                        if (scope.data[i].Check) {
                            b = false; break;
                        }
                    }
                }
                return b;
            }
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
            autoFirst: '@',
            ngRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" ng-change="ValueChange()" class="{{ selectClass }}" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="ngRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected.EntityName }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item.EntityName as item in data | filter: $select.search track by item.EntityName" refresh="refresh($select.search)" refresh-delay="0">'
                  + '             <div><span class="text-info h6 pull-right" ng-bind-html="item.ConnectName | highlight: $select.search"></span><span ng-bind-html="item.EntityName | highlight: $select.search"></span></div>'
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
        scope.autoFirst = scope.autoFirst || "false";
        scope.data = undefined;
        function getData(newValue, oldValue) {
            scope.data = undefined;
            scope.ngModel = newValue != oldValue ? undefined : scope.ngModel;
            var en = {};
            en.name = 'ConnectName';
            en.value = scope.connectName || '';
            AjaxService.GetPlans("SelectEntity", en).then(function (data) {
                scope.data = data;
                if (data.length > 0 && scope.autoFirst.toLowerCase() == 'true') {
                    scope.ngModel = scope.ngModel || data[0].EntityName;
                }
                scope.ListData = angular.copy(scope.data);
            });
        }

        scope.ValueChange = function () {
            setTimeout(function () {
                scope.ngChange();
            }, 100);
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
.directive('importSheetJs', ['$q', 'AjaxService', 'toastr', 'FileLoad', 'ToJsonWorker', 'Version', 'appUrl',
    function ($q, AjaxService, toastr, FileLoad, ToJsonWorker, Version, appUrl) {
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
                $scope.opts = $scope.opts == undefined || $scope.opts == [] ? [{ sheet: 0 }] : $scope.opts;
                $scope.fileType = $scope.fileType || "*";
                $scope.isImport = $scope.isImport || 'false';
                $scope.ngModel = $scope.ngModel || '';
                var op = $scope.opts;
                op[0].sheet = op[0].sheet || 0;

                $scope.Open = function (e) {
                    e.target.parentNode.parentElement.parentElement.firstElementChild.click();
                }
                var fileInput = elm[0].firstElementChild.firstElementChild.firstElementChild;
                var circle = elm[0].lastElementChild;


                //事件添加
                fileInput.onchange = function (changeEvent) {
                    $scope.show = true;
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
                                $scope.Progress = 0;
                                $scope.show = false;
                                $scope.opts.data = evt.data;
                                $scope.ngComplete({ data: evt.data });
                                fileInput.value = "";
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
.directive('fileUploadMulti', ['$window', 'Version', 'toastr', 'FileService',
    function ($window, Version, toastr, FileService) {
        return {
            restrict: 'A',
            scope: {
                ngDisabled: '=',
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
.directive('fileUpload', ['$window', 'Version', 'toastr', 'FileService', 'appUrl',
    function ($window, Version, toastr, FileService) {
        return {
            restrict: 'A',
            scope: {
                ngDisabled: '=',
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
                console.log($scope.fileData)
                option.onComplete = function (data) {
                    if ($scope.ngComplete) {
                        var index = data.length > 0 ? data.length - 1 : 0;
                        $scope.ngComplete({ fileData: data[index] });
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
    //替换texarea回车
.directive('replaceEnter', function () {
    return {
        restrict: 'A',
        priority: 1,
        terminal: true,
        link: link
    };
    function link($scope, element, attr) {
        element.html("");
        $scope.$watchCollection(attr.replaceEnter, function (data) {
            var en = data ? data.replace(/\n/g, '<br/>') : "";
            element.html(en);
        })
        
    }
})
//图标插件指令
.directive('eChart', function () {
         return {
             restrict: 'AE',
             scope: {
                 show: '=',
                 width: '@',
                 height: '@'
             },
             template: '<div style="width: 100%;height:100%;">图标</div>',
             controller: function ($scope) {
             },
             link: function (scope, element, attr) {
                 scope.show = scope.show || {};

                 var chart = element.find('div')[0];
                 var parent = element['context'];
                 //    console.log(parent.clientHeight+":"+parent.clientWidth);
                 //chart.style.width = scope.width || '400px';
                 //chart.style.height = scope.height || '400px';

                 // 基于准备好的dom，初始化echarts实例
                 var myChart = echarts.init(chart);
                 myChart.showLoading();
                 scope.show.setOption = function (option) {
                     option = option ||
                     {
                         title: {
                             text: '数据加载中'
                         },
                         tooltip: {},
                         legend: {
                             data: []
                         },
                         xAxis: {
                             data: []
                         },
                         yAxis: {},
                         series: [{
                             name: '销量',
                             type: 'bar',
                             data: []
                         }]
                     };
                     myChart.hideLoading();
                     // 使用刚指定的配置项和数据显示图表。
                     myChart.setOption(option);
                     //myChart.resize()
                 }
             }
         };
})

.directive('inputDialog', ['AjaxService', 'Dialog', function (AjaxService, Dialog) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            ableEnter:'@',
            ngName: '@',
            text: '@',  //显示的栏位
            value:'@',  //值的栏位
            ngRequired: '@',
            ngName: '@',
            ngChange: '&'
        },
        template: '<div class="form-group col-md-12 padder-xxs has-feedback m-b-none">'
                  +'    <div class="col-md-12 no-padder input-group">'
                  + '        <input autocomplete="off" class="form-control" type="text" ng-disabled="able" ng-model="ngModel" name="{{ ngName }}" ng-required="ngRequired">'
                  + '        <span class="input-group-addon text-info-dk" title="打开窗口" ng-click="Open($event)" style="cursor: pointer; background-color: #e7e7e7">'
                  +'            <a><i class="glyphicon glyphicon-search"></i></a>'
                  +'        </span>'
                  +'    </div>'
                  +'</div>'
        ,
        link: link
    };
    function link(scope, element, attrs) {
        scope.ableEnter = scope.ableEnter == undefined ? 'true' : scope.ableEnter;
        if (scope.ngDisabled) {
            scope.ngDisabled = scope.ngDisabled || 'false';
        }
        else {
            scope.ngDisable = 'false';
        }
        scope.able = scope.ableEnter == 'false' || scope.ngDisabled == 'true';
        if (attrs.inputDialog && scope.ngDisable == 'false') {
            scope.Open = function (e) {
                Dialog.OpenDialog(attrs.inputDialog, {}).then(function (data) {
                    scope.ngModel = data;
                    if (scope.ngChange) {
                        scope.ngChange({ data: data });
                    }
                })
            }
        }
    }
}])
.directive('embedSrc', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var current = element;
            scope.$watch(function () { return attrs.embedSrc; }, function () {
                var clone = element
                  .clone()
                  .attr('src', attrs.embedSrc);
                current.replaceWith(clone);
                current = clone;
            });
        }
    }
})
