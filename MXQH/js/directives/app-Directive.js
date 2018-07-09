﻿'use strict'
//angular.module('Routing', ['ui.router', 'oc.lazyLoad'])
angular.module('app')
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
            en.title = en.title || "确认删除";
            en.text = en.text || "是否删除此笔资料";
            en.type = en.type || "warning";
            en.showCancelButton = en.showCancelButton == undefined || true;
            en.confirmButtonText = en.confirmButtonText || "确定删除！";
            en.cancelButtonText = en.cancelButtonText || "取消删除！";

            var clickAction = attr.ngClick;
            element.bind('click', function () {
                swal(en, function (isConfirm) {
                    if (isConfirm) {
                        scope.$eval(clickAction);
                        //scope.$parent.$eval(clickAction);
                        //scope.$parse(clickAction);
                    }
                });
            });
        });
    }
})

.directive('companySelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            selectItem:'=',
            Clear: '=',
            ngDisabled: '=',
            myRequired: '@',
            ngName:'@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select name="{{ ngName }}" ng-model="$parent.selectItem" theme="bootstrap" ng-disabled="ngDisabled" ng-required="myRequired">'
                  +'  <ui-select-match placeholder="选择组织...">{{ $select.selected.CompanyName }}</ui-select-match>       '
                  + ' <ui-select-choices repeat="item in data | filter: $select.search track by item.CompanyNo">                          '
                  +'      <div ng-bind-html="item.CompanyNo | highlight: $select.search"></div>                             '
                  +'      <small ng-bind-html="item.CompanyName | highlight: $select.search"></small>                       '
                  +'  </ui-select-choices>                                                                                  '
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.selectItem= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + '</div>'
        ,
        link: link
    };

    function link(scope, element, attrs) {

        scope.$watch('selectItem', UpdateItem);

        //组织
        AjaxService.GetEntities("Company").then(function (data) {
            scope.data = data;
            $.grep(data, function (e) {
                if (e.CompanyNo == scope.ngModel) {
                    scope.selectItem = e;
                    return;
                }
            });
        });

        function UpdateItem()
        {
            if (scope.selectItem && scope.selectItem.CompanyNo) {
                scope.ngModel = scope.selectItem.CompanyNo;
            }
        }
    }
}])
.directive('systemSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            selectItem: '=',
            ngDisabled: '=',
            clear: '=',
            myRequired: '@',
            ngName: '@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select  ng-model="$parent.selectItem" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '  <ui-select-match placeholder="选择系统...">{{ $select.selected.SysName }}</ui-select-match>       '
                  + ' <ui-select-choices repeat="item in data | filter: $select.search track by item.SysNo">             '
                  + '      <div ng-bind-html="item.SysNo | highlight: $select.search"></div>                             '
                  + '      <small ng-bind-html="item.SysName | highlight: $select.search"></small>                       '
                  + '  </ui-select-choices>                                                                                  '
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.selectItem= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
                  ,

        link: link
    };

    function link(scope, element, attrs) {

        scope.$watch('selectItem', UpdateItem);
        scope.$watch('ngModel', SetValue);

        //组织
        AjaxService.GetEntities("SystemList").then(function (data) {
            scope.data = data;
            SetValue();
        });

        function SetValue() {
            if (scope.data) {
                scope.selectItem = undefined;
                $.grep(scope.data, function (e) {
                    if (e.SysNo == scope.ngModel) {
                        scope.selectItem = e;
                        return;
                    }
                });
            }
        }

        function UpdateItem() {
            if (scope.selectItem && scope.selectItem.SysNo) {
                scope.ngModel = scope.selectItem.SysNo;
            }
        }
    }
}])

.directive('functionSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            selectItem: '=',
            funType: '@',
            ngDisabled: '=',
            clear: '=',
            myRequired: '@',
            ngName: '@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '<ui-select ng-model="$parent.selectItem" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '  <ui-select-match placeholder="请选择...">{{ $select.selected.FunName }}</ui-select-match>'
                  + ' <ui-select-choices repeat="item in data | filter: $select.search track by item.FunNo">'
                  + '      <div ng-bind-html="item.FunNo | highlight: $select.search"></div>'
                  + '      <small ng-bind-html="item.FunName | highlight: $select.search"></small>'
                  + '  </ui-select-choices>'
                  + '</ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.selectItem= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  + '         </button>'
                  + '     </span>'
                  + ' </div>'
        ,
        link: link
    };

    function link(scope, element, attrs) {
        scope.$watch('selectItem', UpdateItem);
        scope.$watch('ngModel', SetValue);
        var en = {};
        en.name = 'FunType';
        en.value = scope.funType == 1 ? 1 : 2;
        //组织
        AjaxService.GetEntities("Function", en).then(function (data) {
            scope.data = data;
            SetValue();
        });


        function SetValue()
        {
            if (scope.data) {
                scope.selectItem = undefined;
                $.grep(scope.data, function (e) {
                    if (e.FunNo == scope.ngModel) {
                        scope.selectItem = e;
                        return;
                    }
                });
            }
        }

        function UpdateItem() {
            if (scope.selectItem && scope.selectItem.FunNo) {
                scope.ngModel = scope.selectItem.FunNo;
            }
        }
    }
}])
.directive('funFileSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            fileType: '=',
            ngDisabled: '=',
            clear: '=',
            myRequired: '@',
            ngName: '@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  +'         <ui-select-match placeholder="请选择...">{{ $select.selected }}</ui-select-match>'
                  + '          <ui-select-choices repeat="item in data | filter: $select.search track by item">'
                  +'             <div ng-bind-html="item | highlight: $select.search"></div>'
                  +'         </ui-select-choices>'
                  +'     </ui-select>'
                  + '    <span class="input-group-btn" ng-if="clear">'
                  + '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">'
                  + '            <span class="glyphicon glyphicon-trash text-danger"></span>'
                  +'         </button>'
                  +'     </span>'
                  + ' </div>'
        ,
        link: link
    };

    function link(scope, element, attrs) {

        //组织
        AjaxService.HandleFile(scope.fileType).then(function (data) { scope.data = data; });
    }
}])
.directive('objectSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            obConnect: '=',
            obType: '=',
            ngDisabled: '=',
            clear: '=',
            myRequired: '@',
            ngName: '@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected.Name }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item in data | filter: $select.search track by item.Name" refresh="refresh($select.search)" refresh-delay="0">'
                  + '             <small><span ng-bind-html="item.DbSchema | highlight: $select.search"></span>.<span ng-bind-html="item.Name | highlight: $select.search"</span></small>'
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
        scope.$watch('obConnect', getData);

        function getData() {
            if (scope.obConnect) {
                scope.data = undefined;
                scope.ngModel = undefined;
                AjaxService.GetDbeObject(scope.obConnect, scope.obType, '').then(function (data) {
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
                    if ((scope.ListData[j].DbSchema.toUpperCase().indexOf(ser.toUpperCase()) != -1) || (scope.ListData[j].Name.toUpperCase().indexOf(ser.toUpperCase()) != -1)) {
                        scope.data.push(scope.ListData[j])
                    }
                }
                //取服务器获取新数据
                if (scope.data.length == 0) {
                    scope.data = undefined;
                    scope.ngModel = undefined;
                    AjaxService.GetDbeObject(scope.obConnect, scope.obType, ser).then(function (data) {
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
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            clear: '=',
            myRequired: '@',
            ngName: '@'
        },
        template: '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">'
                  + '    <ui-select ng-model="$parent.ngModel" theme="bootstrap" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="myRequired">'
                  + '         <ui-select-match placeholder="请选择...">{{ $select.selected }}</ui-select-match>'
                  + '          <ui-select-choices class="pl-1" repeat="item in data | filter: $select.search track by item" refresh="refresh($select.search)" refresh-delay="0">'
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

        scope.$watch('ngModel', setValue);

        AjaxService.GetConnect().then(function (data) {
            scope.data = data;
            scope.ListData = angular.copy(scope.data);
            scope.ngModel = scope.ngModel || data[0];
        });

        function setValue() {
            if (scope.data && !scope.ngModel) {
                scope.ngModel = scope.data[0];
            }
        }

        scope.refresh = function refresh(ser) {
            if (ser) {
                scope.data = [];
                scope.ListData = scope.ListData || [];
                for (var j = 0, len = scope.ListData.length; j < len; j++) {
                    if ((scope.ListData[j].toUpperCase().indexOf(ser.toUpperCase()) != -1)) {
                        scope.data.push(scope.ListData[j])
                    }
                }
                //取服务器获取新数据
                if (scope.data.length == 0) {
                    AjaxService.GetConnect().then(function (data) {
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