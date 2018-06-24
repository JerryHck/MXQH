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
                        scope.$parent.$eval(clickAction);
                    }
                });
            });
        });
    }
})
.directive('ngBusy', function () {
    return {
        restrict: 'A',
        priority: 1,
        terminal: true,
        scope: {
            promise: "=",
        },
        link: link
    };
    function link(scope, element, attr) {

        var en = scope.option || {};
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
                    scope.$parent.$eval(clickAction);
                }
            });
        });
    }
})