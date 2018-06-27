﻿'use strict';
angular.module('app', [
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
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'AjaxServiceModule',
    'ui.router.requirePolyfill'
]);

angular.module('app')
//APP URL
.constant('appUrl', '../')
//Service URL
.constant('serviceUrl', '//localhost:13439/')
//.constant('serviceUrl', '//localhost/MXQHServie/')

 //表單設定
.constant('Form', [
    { index: 0, title: '新增', action: 'Insert' },
    { index: 1, title: '编辑', action: 'Update' },
    { index: 2, title: '查看', action: 'Search' }
])
    //Loading
.constant('cgBusyDefaults', {
    message: '',
    backdrop: true,
    templateUrl: '../Loading/Loading.html',
    //templateUrl: '',
    message:'请稍等...',
    minDuration: 500,
    notBusyDisabled:true
})
.factory('templateUrl', ['$rootScope', 'appUrl', function ($rootScope, appUrl) {
    return {
        get: function (system) {
            return appUrl;
        }
    };
}])

