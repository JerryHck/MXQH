(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr', '$cookieStore', '$window'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr, $cookieStore, $window) {
        var generic = 'Common.asmx/Do';
        var tableConfigList = [];

        var obj = {
            //登录前服务
            DoBefore: DoBefore,

            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //分页获取实体资料
            GetPlansPage: GetPlansPage,
            //实体计划excel导出
            GetPlanExcel: GetPlanExcel,
            //保存计划实体
            SavePlan: SavePlan,
            //刷新计划实体
            ReflashPlan: ReflashPlan,
            //删除计划实体
            DeletePlan: DeletePlan,
            //计划对应表新增
            PlanInsert: PlanInsert,
            //计划对应表更新
            PlanUpdate: PlanUpdate,
            //计划对应表删除
            PlanDelete: PlanDelete,
            //计划备份
            PlanBak: PlanBak,
            //执行计划实体
            ExecPlan: ExecPlan,
            //执行实体关联的存储过程,获取Excel文件
            ExecPlanToExcel: ExecPlanToExcel,
            //获得实体资料-单个
            GetEntity: GetEntity,
            //获得实体资料-列表
            GetEntities: GetEntities,
            //获取Json数据
            GetJson: GetJson,
            //简单单表新增
            Action: Action,
            //文件
            HandleFile: HandleFile,
            //
            AddDialog: AddDialog,
            //链接对象列表
            GetConnect: GetConnect,
            //数据对象
            GetDbObject: GetDbObject,
            //获取表栏位
            GetColumns: GetColumns,
            GetTbColumns: GetTbColumns,
            GetProcColumns: GetProcColumns,
            GetTableConfig: GetTableConfig,
            //User
            AddUser: AddUser,
            LoginAction: LoginAction,
            //file
            FileImport: FileImport,
            //文件上传保存
            ExecPlanUpload: ExecPlanUpload,
            //发送邮件
            ExecPlanMail: ExecPlanMail,


        };

        return obj;

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data + "?v=" + (new Date()).toString();
            return Ajax(d, url, undefined, undefined, "GET");
        }

        //获得计划资料
        function GetPlan(name, json, limitCol) {
            return plan(name, json, "GetPlan", undefined, undefined, limitCol);
        }

        //获得计划资料-列表
        function GetPlans(name, json, limitCol) {
            return plan(name, json, "GetPlans", undefined, undefined, limitCol);
        }

        //获得计划资料-分页
        function GetPlansPage(name, json, index, size, limitCol) {
            var s = index <= 1 ? 1 : (index - 1) * size + 1;
            return plan(name, json, "GetPlansPage", s, s + size, limitCol);
        }

        //获得计划资料-新增
        function PlanInsert(name, json) {
            return planAjax(name, JSON.stringify(json), "Insert");
        }

        //获得计划资料-更新
        function PlanUpdate(name, json) {
            return planAjax(name, JSON.stringify(json), "Update");
        }

        //获得计划资料-删除
        function PlanDelete(name, json) {
            return planAjax(name, JSON.stringify(json), "Delete");
        }
        //计划备份已导入
        function PlanBak(action, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.action = action;
            en.strJson = json;
            return Ajax(d, url, en, "PlanBak")
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

        function AddDialog(data) {
            var d = $q.defer();
            return AjaxHandle(d, "AddDialog", data);
        }

        //HTTP AJAX
        function AjaxHandle(q, method, data) {

            var en = { "method": method, "data": data };
            httpFun(q, appUrl + 'Data/Handler/FileData.ashx', en);
            return q.promise;
        }

        function GetConnect() {
            var d = $q.defer(), url = serviceUrl + generic;
            return Ajax(d, url, {}, "GetConnectList");
        }

        function GetDbObject(con, type, ser) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.strCon = con;
            en.strType = type;
            en.strSearch = ser;
            return Ajax(d, url, en, "GetDbObject");
        }

        function GetColumns(con) {
            var d = $q.defer(), g = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.planName = con;
            Ajax(d, url, en, "GetTbViewColumns").then(
                function (data) { g.resolve(data.data); },
                function () { g.reject(); }
            );
            return g.promise;
        }

        function GetProcColumns(conn, proc) {
            var d = $q.defer(),
                 url = serviceUrl + generic;
            var en = {};
            en.connName = conn;
            en.strProc = proc;
            return Ajax(d, url, en, "GetProcColumns");
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

        function plan(name, json, funName, start, end, limitCol) {
            var enJson = JSON.stringify(convertArray(json)) || '[]';
            return planAjax(name, enJson, funName, start, end, limitCol);
        }

        function planAjax(name, json, funName, start, end, limitCol) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            en.strJson = json;
            en.start = start;
            en.end = end;
            en.limitUserCol = limitCol;
            return Ajax(d, url, en, funName)
        }

        function SavePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, undefined, json);
            return Ajax(d, url, en, "SavePlan");
        }

        function ReflashPlan(name) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            return Ajax(d, url, en, "ReflashPlan");
        }
        function DeletePlan(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, undefined, json);
            return Ajax(d, url, en, "DeletePlan");
        }

        function ExecPlan(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "ExecPlan")
        }

        function ExecPlanMail(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "ExecPlanMail")
        }

        function ExecPlanUpload(name, shortName, json, fileJson, dir) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.fileJson = JSON.stringify(fileJson);
            en.dir = dir;
            return Ajax(d, url, en, "ExecPlanUpload")
        }

        function ExecPlanToExcel(name, shortName, json, sheetTable) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.sheetTable = JSON.stringify(convertArray(sheetTable));
            return Ajax(d, url, en, "ExecPlanToExcel")
        }

        function GetPlanExcel(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "GetPlanExcel")
        }

        function AddUser(json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "AddUser", undefined, 'Authorization')
        }

        function DoBefore(method, en) {
            var d = $q.defer(), url = serviceUrl + "Common.asmx/DoBefore";
            var json = { method: method, Json: JSON.stringify(en) };
            return httpFun(d, url, json)
        }

        function LoginAction(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method, undefined, 'Authorization');
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

        function FileImport(name, shortName, json, file, inData, sheetTable) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            en.filaName = file;
            en.bt = inData;
            en.sheetTable = JSON.stringify(convertArray(sheetTable));
            return Ajax(d, url, en, 'FileImport');
        }

        //HTTP AJAX
        function Ajax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
            return httpFun(q, url, en, type);
        }

        function TbAjax(q, url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
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

        function httpFun(q, url, postData, type) {
            $http({
                method: type || 'POST',
                url: url,
                dataType: 'json',
                data: postData
            })
            .then(
                function (data) { q.resolve(data.data); },
                function (data) {
                    q.reject();
                    if (data.status == 401) {
                        $cookieStore.remove('user-token');
                        if ($window.location.href != appUrl + 'Acess.html#!/login') {
                            $window.location.href = appUrl + 'Acess.html#!/login';
                        }
                    } else {
                        console.log(data);
                        var m = data.data ? data.data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误')
                    }
                });
            return q.promise;
        }

        function getEn(name, shortName, json)
        {
            var en = {};
            en.planName = name;
            en.shortName = shortName;
            en.strJson = JSON.stringify(json);
            return en;
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