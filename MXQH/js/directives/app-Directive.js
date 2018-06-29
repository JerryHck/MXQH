'use strict'
//angular.module('Routing', ['ui.router', 'oc.lazyLoad'])
angular.module('app')
.directive('ngConfirm', function () {
    return {
        restrict: 'A',
        priority: 1,
        terminal: true,
        //scope: {
        //    option: "=",
        //},
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
.directive('systemSelect', ['AjaxService', function (AjaxService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            Company: '=',
            empClear: '@'
        },
        template: '<ui-select  ng-disabled="sys.form.index == 1" ng-model=\"Company\" theme=\"bootstrap\" required>'
                  +'  <ui-select-match placeholder="选择组织...">{{ $select.selected.CompanyName }}</ui-select-match>       '
                  +'  <ui-select-choices repeat="item in data | filter: $select.search">                                    '
                  +'      <div ng-bind-html="item.CompanyNo | highlight: $select.search"></div>                             '
                  +'      <small ng-bind-html="item.CompanyName | highlight: $select.search"></small>                       '
                  +'  </ui-select-choices>                                                                                  '
                  +'  </ui-select>',                                                                                          
        link: link
    };

    function link(scope, element) {
        //组织
        AjaxService.GetEntities("Company").then(function (data) {
            scope.data = data;
        });
    }
}])