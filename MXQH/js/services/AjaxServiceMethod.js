(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl) {
        var generic = 'Common.asmx/Do';

        var obj = {
            //获得表资料
            GetTbViewList: GetTbViewList,
            //登入人員資料取得
            GetUser: GetUser
        };

        return obj;

        //获得表资料
        function GetTbViewList(data) {
            var d = $q.defer(),
                 url = serviceUrl + generic;

            return Ajax(d, url, data, "GetTbViewList");
        }

        //登入人員資料取得
        function GetUser(system) {
            var d = $q.defer(),
                url = serviceUrl + (system || $rootScope.systemName) + generic + 'GetUser';

            return Ajax(d, url, "");
        }

        //實體資料個數取得
        function GetCount(entity, option) {
            var op = option || {},
                parameter = {
                    Plan: op.plan || '',
                    Condition: JSON.stringify(op.condition) || '',
                    UserCondition: JSON.stringify(op.search) || '',
                    User: op.user || false,
                    LimitType: op.limit || ''
                };

            return DataService(entity, 'GetCount', op.system, parameter);
        }

        //自訂實體個數取得
        function CustomCount(entity, method, option) {
            var op = option || {},
                parameter = {
                    Method: method,
                    Condition: JSON.stringify(op.condition),
                    LimitType: op.limit || ''
                };

            return DataService(entity, 'CustomCount', op.system, parameter);
        }

        //使用狀態變更
        function StatusChange(entity, data, option) {
            var op = option || {},
                parameter = { Data: JSON.stringify(data) };

            return DataService(entity, 'StatusChange', op.system, parameter);
        }

        //資料服務
        function DataService(entity, method, system, option) {
            var d = $q.defer(),
                url = serviceUrl + (system || $rootScope.systemName) + generic + 'DataService',
                parameter = {
                    strEntity: entity,
                    strMethod: method,
                    strOption: JSON.stringify(option)
                };

            return Ajax(d, url, parameter);
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type) {

            $http({
                method: type || 'POST',
                url: url,
                dataType: 'json',
                data: { method: Method, Json: JSON.stringify(parameter) }
            })
            .success(function (data) { q.resolve(data); })
            .error(function () { q.reject(); });

            return q.promise;
        }
    }
})();