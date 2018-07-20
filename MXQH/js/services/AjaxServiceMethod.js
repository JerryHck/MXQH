(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr) {
        var generic = 'Common.asmx/Do';
        var tableConfigList = [];

        var obj = {
            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //分页获取实体资料
            GetPlansPage:GetPlansPage,
            //保存计划实体
            SavePlan: SavePlan,
            //删除计划实体
            DeletePlan:DeletePlan,
            //执行计划实体
            ExecPlan: ExecPlan,
            //获得实体资料-单个
            GetEntity, GetEntity,
            //获得实体资料-列表
            GetEntities: GetEntities,
            //获取Json数据
            GetJson: GetJson,
            //简单单表新增
            Action: Action,
            //存储过程执行
            EditBack: EditBack,
            //文件
            HandleFile: HandleFile,
            //
            AddDailog:AddDailog,
            //链接对象列表
            GetConnect: GetConnect,
            //数据对象
            GetDbeObject: GetDbeObject,
            //获取表栏位
            GetColumns: GetColumns,
            GetTbColumns: GetTbColumns,
            GetTableConfig: GetTableConfig,
            //User
            AddUser: AddUser,
            Login: Login
        };

        return obj;

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data;
            return Ajax(d, url, undefined, undefined, "GET");
        }

        //获得计划资料
        function GetPlan(name, json) {
            return plan(name, json, "GetPlan");
        }

        //获得计划资料
        function GetPlans(name, json) {
            return plan(name, json, "GetPlans");
        }

        //获得计划资料
        function GetPlansPage(name, json, start, end) {
            return plan(name, json, "GetPlansPage", start, end);
        }

        //获得单实体资料
        function GetEntity(name, json) {
            return entity(name, json, "GetEntity");
        }  

        //获得表资料
        function GetEntities(name, json) {
            return entity(name, json, "GetEntities");
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
            return AjaxHandle(d, "GetFileList", type);
        }

        function AddDailog(data) {
            var d = $q.defer();
            return AjaxHandle(d, "AddDialog", data);
        }

        //HTTP AJAX
        function AjaxHandle(q, method, data) {
           
            var en = { "method": method, "data": data };
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

        function plan(name, json, funName, start, end) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';
            en.start = start;
            en.end = end;
            return Ajax(d, url, en, funName)
        }


        function SavePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "SavePlan");
        }

        function DeletePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "DeletePlan");
        }

        function ExecPlan(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.entityName = name;
            en.shortName = shortName;
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "ExecPlan")
        }

        function AddUser(json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "AddUser", undefined, 'Authorization')
        }

        function Login(user, psw, kicking) {
            var d = $q.defer(), url = serviceUrl + "Common.asmx/Login";
            var en = {};
            en.User = user;
            en.Psw = psw;
            en.Kicking = kicking;
            return httpFun(d, url, en)
        }

        function GetTableConfig(tbName, clName) {
            var d = $q.defer(), listHave = [];
            //从缓存中获取数据
            for (var j = 0, len = tableConfigList.length; j < len; j++) {
                if (tableConfigList[j].TbName == tbName && tableConfigList[j].ClName == clName) {
                    listHave.push(tableConfigList[j])
                }
            }
            if (listHave.length > 0) {
                d.resolve(listHave);
            }
            else {
                var list = [
                    { name: "TbName", value: tbName },
                    { name: "ClName", value: clName }
                ];
                GetPlans("TableConfig", list).then(function (data) {
                    for (var j = 0, len = data.length; j < len; j++) {
                        var have = false;
                        for (var h = 0, len = tableConfigList.length; h < len; h++) {
                            if (tableConfigList[h].TbName == data[j].TbName && tableConfigList[h].ClName == data[j].ClName &&
                                tableConfigList[h].ClInf == data[j].ClInf) {
                                have = true;
                            }
                        }
                        if (have) {
                            tableConfigList.push(data[j]);
                        }
                    }
                    d.resolve(data);
                });
            }
            return d.promise;
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
            return httpFun(q, url, en, type);
        }

        function TbAjax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service||'' };
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