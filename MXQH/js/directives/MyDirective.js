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
            option: '='
        },
        link: function (scope, element, attr, ngModel) {
            scope.option = scope.option ||
                {
                    formatTime: 'H:i',
                    formatDate: 'Y.m.d',
                    timepicker: false,
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
        AjaxService.BasicCustom("GetConnectList").then(function (data) {
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
        scope.autoFirst = scope.autoFirst || "false";
        scope.placeholder = scope.placeholder || "请选择...";
        if (scope.configOption) {
            //组织
            AjaxService.GetTableConfig(scope.configOption.Table, scope.configOption.Column).then(function (data) {
                scope.data = data;
                if (data.length > 0 && scope.autoFirst.toLowerCase() == 'true') {
                    scope.ngModel = scope.ngModel || data[0].ClInf;
                }
            });
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
                myRequired: '@',
                ngName: '@',
                autoFirst: '@',
                ngChange: '&'
            },
            template: '<ui-select name="{{ ngName }}" ng-change="ngChange()" class="{{ selectClass }}" ng-model="$parent.ngModel" theme="bootstrap" search-enabled="searchEnabled" ng-disabled="ngDisabled" ng-required="myRequired" multiple>'
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
            autoFirst: '@',
            myRequired: '@',
            ngName: '@',
            ngChange:'&'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" ng-change="ValueChange()" class="{{ selectClass }}" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
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
.directive('fileUploadMulti', ['$window', 'Version', 'toastr', 'FileService',
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
