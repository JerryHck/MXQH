'use strict'
angular.module('appData', []);


angular.module('appData')
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
    message: '请稍等...',
    minDuration: 500,
    notBusyDisabled: true
})
.factory('templateUrl', ['$rootScope', 'appUrl', function ($rootScope, appUrl) {
    return {
        get: function (system) {
            return appUrl;
        }
    };
}])
.factory('MyPop', function () {
    return {
        Show: function (show, text) {
            if (show) {
                var en = {};
                en.title = en.title || "提示";
                en.text = text || "资料还在编辑中";
                en.type = en.type || "warning";
                en.showConfirmButton = false
                en.showCancelButton = true;
                en.cancelButtonText = en.cancelButtonText || "关闭";
                //显示提示消息
                swal(en, function (isConfirm) { });
            }
            return show;
        }
    };
})
