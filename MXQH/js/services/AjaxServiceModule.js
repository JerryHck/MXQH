(function () {
    angular.module('AjaxServiceModule', []);

    angular.module('AjaxServiceModule').config(appConfig);

    angular.module('AjaxServiceModule').factory('httpWatch', httpWatch);

    //httpWatch.$inject = ['$cookies'];

    function httpWatch($cookies) {
        var obj = {
            'request': function (config) {
                //if ($cookies.get('user-token')) {
                //    config.headers['x-session-token'] = $cookies.get('user-token');
                //}
                //config.headers['x-function'] = $cookies.get('function-token') || '';
                config.headers['x-session-token'] = "123fasdf";
                config.headers['x-function'] = "123fasdf";
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

        //$.ajax({
        //    type: "POST", //访问WebService使用Post方式请求
        //    contentType: "application/x-www-form-urlencoded;charset=utf-8", //WebService 会返回Json类型
        //    url: "http://localhost:13439/Common.asmx/Do", //调用WebService
        //    data: { method: "GetTbViewList", Json: JSON.stringify(data) }, //Email参数
        //    dataType: 'json',
        //    headers: {
        //        // 'Content-Type': 'application/json; charset=utf-8 ',
        //        "Content-Type":"application/x-www-form-urlencoded",
        //        "x-session-token": "1234",
        //        "x-function": "dfasdaf"
        //    },
        //    error: function (x, e) {
        //        console.log(x);
        //        console.log(x.responseText);
        //    },
        //    success: function (response) { //回调函数，result，返回值
        //        alert(response);
        //        console.log(response);
        //    }
        //});


        $httpProvider.interceptors.push(httpWatch);
    }
})();