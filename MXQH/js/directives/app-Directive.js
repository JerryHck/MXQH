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
        scope: {
            ngModel: '='
        },
        //template: '<ui-select  ng-model="ngModel" theme="bootstrap" required>'
        //          +'  <ui-select-match placeholder="选择组织...">{{ $select.selected.CompanyName }}</ui-select-match>       '
        //          +'  <ui-select-choices repeat="item in data | filter: $select.search">                                    '
        //          +'      <div ng-bind-html="item.CompanyNo | highlight: $select.search"></div>                             '
        //          +'      <small ng-bind-html="item.CompanyName | highlight: $select.search"></small>                       '
        //          +'  </ui-select-choices>                                                                                  '
        //          + '</ui-select>',
        template: '<select ng-model="ngModel" ui-select2="{ allowClear: empClear }">' +
                      '    <option value="" ng-if="empClear"></option>' +
                      '    <option ng-repeat="com in data" value="{{ com.CompanyNo }}">' +
                      '        [{{ com.CompanyNo }}] {{ com.CompanyName }}' +
                      '    </option>' +
                      '</select>',

        link: link
    };

    function link(scope, element, attrs) {

        
        //scope.$watch('item', updateModel);
        //组织
        AjaxService.GetEntities("Company").then(function (data) {
            scope.data = data;
        });

        ////Update Model
        //function updateModel() {
        //    if (scope.data && scope.item) {
        //        console.log(scope.item)
        //        scope.ngModel = scope.item;
        //    }
        //}
    }
}])
//.directive('selectLocation', [
//    function () {

//        return {
//            restrict: 'E',
//            scope: {
//                model: '=',
//                refresh: '=',
//                itemArray: '='
//            },
//            template: '  <ui-select ng-model="model.item">\
//                        <ui-select-match>\
//                            <span ng-bind="$select.selected.location_code"></span>\
//                        </ui-select-match>\
//                        <ui-select-choices refresh-delay=500 refresh="refresh({ $search: $select.search })" repeat="item in (itemArray | filter: $select.search) track by item.id">\
//                            <span ng-bind="item.location_code"></span>\
//                        </ui-select-choices>\
//                      </ui-select>',
//            link: function (scope, elemt, attr) {
//                scope.$on('choices:update', function (e, data) {
//                    scope.choices = data.choices;
//                    updateChoices(scope, data.choices);
//                });
//            }

//        }
//    }
//])