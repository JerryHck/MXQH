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
            HandleFile: HandleFile,
            //链接对象列表
            GetConnect: GetConnect,
            //数据对象
            GetDbeObject: GetDbeObject,
            //获取表栏位
            GetColumns: GetColumns,
            GetTbColumns: GetTbColumns,
            GetTableConfig: GetTableConfig,
        };

        return obj;

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data;
            return Ajax(d, url, undefined, undefined, "GET");
        }

        function GetTableConfig(tbName, clName) {
            var list = [
                { name: "TbName", value: tbName },
                { name: "ClName", value: clName }
            ];
            return GetPlans("TableConfig", list);
        }

        //获得计划资料
        function GetPlan(name, json) {
            return plan(name, json, "GetPlan");
        }

        //获得计划资料
        function GetPlans(name, json) {
            return plan(name, json, "GetPlans");
        }

        //获得单实体资料
        function GetEntity(name, json) {
            return entity(name, json, "GetEntity");
        }  

        //获得表资料
        function GetEntities(name, json) {
            return entity(name, json, "GetEntities");
        }

        //获得单实体资料
        function GetTbView(name, json) {
            var g = $q.defer();
            return GetTbViewList(name, json).then(
                function (data) { g.resolve(data[0]); },
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
            return TbAjax(d, url, en, "GetTbViewList");
        }

        //获得表资料
        function EditBack(name, json) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strProc = name;
            en.strJson = JSON.stringify(json) || '{}';

            return TbAjax(d, url, en, "EditBack");
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
            var en = { "type": type }
            httpFun(q, 'Data/Handler/FileData.ashx', en);
            return q.promise;
        }

        function GetConnect() {
            var d = $q.defer(), url = serviceUrl + generic;
            return Ajax(d, url, {}, "GetConnectList");
        }

        function GetDbeObject(con, type, ser) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strCon = con;
            en.strType = type;
            en.strSearch = ser;
            return Ajax(d, url, en, "GetDbeObject");
        }

        function GetColumns(con) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.entityName = con;
            Ajax(d, url, en, "GetTbViewColumns").then(
                function (data) { g.resolve(data.data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        function GetTbColumns(schema, table, con) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.Schema = schema;
            en.TableName = table;
            en.ConnectName = con;
            Ajax(d, url, en, "GetTbColumns").then(
                function (data) { g.resolve(data.data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        function entity(name, json, funName) {
            var d = $q.defer(),
                url = serviceUrl + generic;
            var en = {};
            en.strName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';
            return Ajax(d, url, en, funName);
        }

        function plan(name, json, funName) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';
            return Ajax(d, url, en, funName)
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type) {
            var en = { method: Method, Json: JSON.stringify(parameter) };
            return httpFun(q, url, en, type);
        }

        function TbAjax(q, url, parameter, Method, type) {
            var en = { method: Method, Json: JSON.stringify(parameter) };
            return httpTbFun(q, url, en, type);
        }

        function httpTbFun(q, url, postData, type) {
            var g = $q.defer();
            httpFun(g, url, postData, type).then(
                function (data) { q.resolve(data.data); },
                function () { q.reject(); }
            );
            return q.promise;
        }

        function httpFun (q, url, postData, type) {
            $http({
                method: type || 'POST',
                url: url,
                dataType: 'json',
                data: postData
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