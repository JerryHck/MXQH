(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr) {
        var generic = 'Common.asmx/Do';

        var obj = {
            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //获得实体资料-单个
            GetEntity, GetEntity,
            //获得实体资料-列表
            GetEntities: GetEntities,
            //获得表资料-单个
            GetTbView, GetTbView,
            //获得表资料-列表
            GetTbViewList: GetTbViewList,
            //获取Json数据
            GetJson: GetJson,
            //简单单表新增
            Action: Action,
            //存储过程执行
            EditBack: EditBack,
            //文件
            HandleFile: HandleFile
        };

        return obj;

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data;
            return Ajax(d, url, undefined, undefined, "GET");
        }

        //获得单实体资料
        function GetEntity(name, json) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            Ajax(d, url, en, "GetEntity").then(
                function (data) { g.resolve(data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        //获得计划资料
        function GetPlan(name, json) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            Ajax(d, url, en, "GetPlan").then(
                function (data) { g.resolve(data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        //获得计划资料
        function GetPlans(name, json) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            Ajax(d, url, en, "GetPlans").then(
                function (data) { g.resolve(data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        //获得表资料
        function GetEntities(name, json) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            return Ajax(d, url, en, "GetEntities");
        }

        //获得单实体资料
        function GetTbView(name, json) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strTbView = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            Ajax(d, url, en, "GetTbViewList").then(
                function (data) { g.resolve(data.data[0]); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        //获得表资料
        function GetTbViewList(name, json) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strTbView = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';

            return Ajax(d, url, en, "GetTbViewList");
        }

        //获得表资料
        function EditBack(name, json) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strProc = name;
            en.strJson = JSON.stringify(json) || '{}';

            return Ajax(d, url, en, "EditBack");
        }

        //获得表资料
        function Action(name, json, action) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strTbView = name;
            en.strJson = JSON.stringify(json);

            return Ajax(d, url, en, action);
        }

        function HandleFile(type) {
            var d = $q.defer();
            return AjaxHandle(d, type);
        }

        //HTTP AJAX
        function AjaxHandle(q, type) {

            $http({
                method: 'post',
                url: 'Data/Handler/FileData.ashx',
                dataType: 'json',
                data: { "type": type }
            })
            .then(
                function (data) { q.resolve(data.data); },
                function (mes) {
                    q.reject();
                    console.log(mes);
                    var m = mes.data ? mes.data.split("。")[0] : "错误";
                    toastr.error(m, '服务访问错误')
                });
            return q.promise;
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type) {

            $http({
                method: type || 'POST',
                url: url,
                dataType: 'json',
                data: { method: Method, Json: JSON.stringify(parameter) }
            })
            .then(
                function (data) { q.resolve(data.data); },
                function (mes) {
                    q.reject();
                    console.log(mes);
                    var m = mes.data ? mes.data.split("。")[0] : "错误";
                    toastr.error(m, '服务访问错误')
                });

            return q.promise;
        }

        //转换字符串
        function convertArray(en) {
            if (!en) return en;
            var isArr;
            if (typeof Array.isArray === "function") {
                isArr = Array.isArray(en);
            } else {
                isArr = Object.prototype.toString.call(en) === "[object Array]";
            }
            if (isArr) { return en; }
            else {
                var enNew = [];
                enNew.push(en);
                return enNew
            }
        }
    }
})();