(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr', 'MyPop', '$cookieStore', '$window', 'FileUrl'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr, MyPop, $cookieStore, $window, FileUrl) {
        var generic = 'Common.asmx/Do';
        var tableConfigList = [];

        var obj = {
            //登录前服务
            DoBefore: DoBefore,
            //自定义服务方法
            Custom: Custom,
            //
            BasicCustom:BasicCustom,

            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //分页获取实体资料
            GetPlansPage: GetPlansPage,
            //实体计划excel导出
            GetPlanExcel: GetPlanExcel,
            GetPlanOwnExcel:GetPlanOwnExcel,
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

            //获取本地默认打印机
            GetDefaultPrinter: GetDefaultPrinter,
            //获取本地打印机列表
            GetLocalPrinters: GetLocalPrinters,
            //
            Print: Print,
            //
            PrintMulti: PrintMulti,
            //播放声音
            PlayVoice: PlayVoice
        };

        return obj;

        function PlayVoice(name) {
            var auto = $("#autoVoice");
            auto.attr("src", FileUrl + '/Voice/' + name);
        }

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

        function GetPlanOwnExcel(name, json)
        {
            var d = $q.defer(), url = serviceUrl + generic;
            json = json || [];
            var en = getEn(name, "--", json);
            return Ajax(d, url, en, "GetPlanOwnExcel")
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
            return httpFun(d, url, json);
        }

        function LoginAction(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method, undefined, 'Authorization');
        }

        //基础呼叫方法
        function BasicCustom(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method);
        }

        function Custom(method, en) {
            var d = $q.defer(), url = serviceUrl + generic;
            en = en || {};
            return Ajax(d, url, en, method, undefined, 'Custom');
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
                        if ($window.location.href != appUrl + 'Access.html#!/login') {
                            $window.location.href = appUrl + 'Access.html#!/login';
                        }
                    } else {
                        console.log(data);
                        var m = data.data ? data.data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误');
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
                return enNew;
            }
        }

        //socket 编程
        //---------------------------------------------------------------------------------------------------
        function GetDefaultPrinter(hostIp) {
            return SocketSend("GetDefaultPrinter", undefined, undefined, undefined, undefined, hostIp);
        }
        //获取打印机列表
        function GetLocalPrinters(hostIp) {
            var d = $q.defer();
            SocketSend("GetLocalPrinters", undefined, undefined, undefined, undefined, hostIp).then(function (data) {
                d.resolve(JSON.parse(data));
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        //单笔打印
        function Print(templateId, TS, postData, printerName, hostIp) {
            var d = $q.defer();
            //var postData = {};
            //postData.ParaData = JSON.stringify(paraData || {});
            //postData.OutList = JSON.stringify(outList||[]);
            SocketSend("Print", templateId, TS, postData, printerName, hostIp).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        //多笔打印
        function PrintMulti(templateId, TS, postData, printerName, hostIp) {
            var d = $q.defer();
            SocketSend("PrintMulti", templateId, TS, postData, printerName, hostIp).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        function SocketSend(method, Id, TS, postData, printerName, hostIp) {
            var g = $q.defer();
            try {
                var strAddress = "ws://" + (hostIp || "127.0.0.1") + ":2018";
                var socket = new WebSocket(strAddress);
                socket.onerror = function (evt) {
                    console.log(evt.currentTarget);
                    if (evt.currentTarget.readyState == 3) {
                        var en = {};
                        $window.location.href = "MxqhPrinter:" + serviceUrl;
                        en.text = "打印服务正在启动，重新发送数据？";
                        MyPop.Confirm(en, function () {
                            SocketSend(method, Id, TS, postData, printerName, hostIp);
                        });
                    }
                };
                socket.onopen = function () {
                    var en = {};
                    en.Method = method;
                    en.TemplateId = Id;
                    en.TS = TS;
                    en.Data = JSON.stringify(postData);
                    en.ServiceUrl = serviceUrl;
                    en.PrinterName = printerName;
                    socket.send(JSON.stringify(en));
                };
                socket.onclose = function (e) {
                    //toastr.error("打印服务已经停止", '服务错误');
                    //g.reject("打印服务已经停止", '服务错误');
                };
                socket.onmessage = function (evt) {
                    var reData = JSON.parse(evt.data);
                    if (reData.MesType == "Success") {
                        g.resolve(reData.Data);
                    }
                    else if (reData.MesType == "Error") {
                        toastr.error(reData.Data, '服务错误');
                        g.reject(reData.Data);
                    }
                    else if (reData.MesType == "Update") {
                        toastr.warning('服务器已有新版本的打印插件，请下载更新');
                        $window.location.href = reData.Data;
                    }
                };
            }
            catch (e) {
                toastr.error(e, '服务错误');
            }
            return g.promise;
        }
    }
})();