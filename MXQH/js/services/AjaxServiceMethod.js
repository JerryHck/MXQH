(function () {
    angular.module('AjaxServiceModule').factory('AjaxService', AjaxService);

    AjaxService.$inject = ['$rootScope', '$http', '$q', 'serviceUrl', 'appUrl', 'toastr', 'MyPop', '$cookieStore', '$window', 'FileUrl', 'SocketServiceUrl', '$state'];

    function AjaxService($rootScope, $http, $q, serviceUrl, appUrl, toastr, MyPop, $cookieStore, $window, FileUrl, SocketServiceUrl, $state) {
        var generic = 'Common.asmx/Do';
        var tableConfigList = new Array();
        //重复呼叫socket服务
        var interval = undefined;
        var obj = {

            //呼叫外部dll方法
            CallDll:CallDll,
            //登录前服务
            DoBefore: DoBefore,
            //同步执行方法
            DoBeforeWait:DoBeforeWait,
            //自定义服务方法
            Custom: Custom,
            //
            BasicCustom:BasicCustom,

            //检验用户角色
            CheckRole:CheckRole,
            //获得实体资料-单个
            GetPlan: GetPlan,
            //获得实体资料-列表
            GetPlans: GetPlans,
            //从缓存中读取数据
            GetCachePlans:GetCachePlans,
            //无事务读取存储过程——存储过程内只允许读
            GetProc:GetProc,
            //同步获取数据
            GetPlansWait:GetPlansWait,
            GetPlansTop:GetPlansTop,
            //分页获取实体资料
            GetPlansPage: GetPlansPage,
            //分页读取缓存 数据
            GetCachePlansPage:GetCachePlansPage,
            //实体计划excel导出
            GetPlanExcel: GetPlanExcel,
            GetPlanOwnExcel: GetPlanOwnExcel,
            GetCachePlanOwnExcel:GetCachePlanOwnExcel,
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
            //执行计划实体-同步方式
            ExecPlanWait: ExecPlanWait,
            //执行存储过程， 获取分页数据
            ExecPlanPage:ExecPlanPage,
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
            //AjaxHandle
            AjaxHandle:AjaxHandle,
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
            GetComPortList: GetComPortList,
            GetComWeight: GetComWeight,
            LightPrint: LightPrint,
            //打印PDF
            PrintPdf:PrintPdf,
            //播放声音
            PlayVoice: PlayVoice,

            //Server Socket
            GetServerTime: GetServerTime,
            GetServerSocket: GetServerSocket,
            doAysc:doAysc,

            //休眠
            sleep: sleep,
            convertArray: convertArray,
            //Ajax 方法
            httpFun: httpFun,
            uuid: uuid

        };
        var conect = 0;
        return obj;

        function PlayVoice(name) {
            var auto = $("#autoVoice");
            auto.attr("src", FileUrl + '/Voice/' + name);
        }

        function CheckRole(role) {
            var en = {};
            en.RoleSn = role;
            var url = serviceUrl + generic;
            var d = $q.defer();
            return Ajax(d, url, en, "CheckUserRole");
        }

        //JSON Data取得
        function GetJson(data) {
            var d = $q.defer(),
                url = appUrl + 'Data/' + data + "?v=" + (new Date()).toString();
            return Ajax(d, url, undefined, undefined, "GET");
        }

        //执行外部方法
        function CallDll(dll, space, method, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.dllName = dll;
            en.spaceName = space;
            en.methodName = method;
            en.strJson = JSON.stringify(json) || '{}';
            return Ajax(d, url, en, "CallDll");
        }

        //获得计划资料
        function GetPlan(name, json, limitCol) {
            return plan(name, json, "GetPlan", undefined, undefined, limitCol);
        }

        //获得计划资料-列表
        function GetPlans(name, json, limitCol) {
            return plan(name, json, "GetPlans", undefined, undefined, limitCol);
        }

        //获得Cache计划资料-列表
        function GetCachePlans(name, json, limitCol) {
            return plan(name, json, "GetCachePlans", undefined, undefined, limitCol);
        }

        //获得计划资料-同步
        function GetPlansWait(name, json, limitCol) {
            var url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            en.strJson = JSON.stringify(convertArray(json)) || '[]';
            en.limitUserCol = limitCol;
            return AjaxWait(url, en, "GetPlans")
        }

        function GetPlansTop(name, json, top, limitCol) {
            return plan(name, json, "GetPlansTop", undefined, undefined, limitCol, top);
        }

        //获得计划资料-分页
        function GetPlansPage(name, json, index, size, limitCol) {
            var s = index <= 1 ? 1 : (index - 1) * size + 1;
            return plan(name, json, "GetPlansPage", s, s + size - 1, limitCol);
        }

        //获得计划资料-分页
        function GetCachePlansPage(name, json, index, size, limitCol) {
            var s = index <= 1 ? 1 : (index - 1) * size + 1;
            return plan(name, json, "GetCachePlansPage", s, s + size - 1, limitCol);
        }

        //执行存储过程， 获取分页数据
        function ExecPlanPage(name, shortName, json, index, size) {
            var d = $q.defer(), url = serviceUrl + generic;
            var s = index <= 1 ? 1 : (index - 1) * size + 1;
            var en = getEn(name, shortName, json);
            en.start = s;
            en.end = s + size;
            return Ajax(d, url, en, "ExecPlanPage");
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
            return AjaxHandle("GetFileList", type);
        }

        function AddDialog(data) {
            return AjaxHandle("AddDialog", data);
        }

        //HTTP AJAX
        function AjaxHandle(method, data) {
            var q = $q.defer();
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

        function plan(name, json, funName, start, end, limitCol, top) {
            var enJson = JSON.stringify(convertArray(json)) || '[]';
            return planAjax(name, enJson, funName, start, end, limitCol, top);
        }

        function planAjax(name, json, funName, start, end, limitCol, top) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.planName = name;
            en.strJson = json;
            en.start = start;
            en.end = end;
            en.top = top;
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

        //无事务读取存储过程——只读的情况下使用
        function GetProc(conn, procName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = {};
            en.conn = conn;
            en.procName = procName;
            en.strJson = JSON.stringify(json);
            return Ajax(d, url, en, "GetProc");
        }

        function ExecPlan(name, shortName, json, isTrans) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            var isTrans = isTrans == undefined ? true : isTrans;
            var method = isTrans == false ? "GetPlanProc" : "ExecPlan";//默认启用事务
            return Ajax(d, url, en, method);
        }

        //执行计划资料-同步
        function ExecPlanWait(name, shortName, json, isTrans) {
            var url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            var isTrans = isTrans == undefined ? true : isTrans;
            var method = isTrans == false ? "GetPlanProc" : "ExecPlan";//默认启用事务
            return AjaxWait(url, en, method)
        }


        function ExecPlanMail(name, shortName, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            var en = getEn(name, shortName, json);
            return Ajax(d, url, en, "ExecPlanMail");
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

        function GetCachePlanOwnExcel(name, json) {
            var d = $q.defer(), url = serviceUrl + generic;
            json = json || [];
            var en = getEn(name, "--", json);
            return Ajax(d, url, en, "GetCachePlanOwnExcel")
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

        function DoBeforeWait(method, en) {
            var url = serviceUrl + "Common.asmx/DoBefore";
            var json = { method: method, Json: JSON.stringify(en) };
            return HTTPWait(url, json);
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
            var name = tbName + '-' + clName;
            if (tableConfigList[tbName + '-' + clName] && tableConfigList[tbName + '-' + clName].length > 0) {
                d.resolve(tableConfigList[tbName + '-' + clName]);
                //console.log('have')
            }
            else {
                var list = [
                    { name: "TbName", value: tbName },
                    { name: "ClName", value: clName }
                ];
                GetPlans("TableConfig", list).then(function (data) {
                    tableConfigList[tbName + '-' + clName] = data;
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

        //同步 AJAX
        function AjaxWait(url, parameter, Method, type, service) {
            var en = { method: Method, Json: JSON.stringify(parameter), service: service || '' };
            return HTTPWait(url, en, type);
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

        function doAysc() {
            var d = $q.defer();
            d.resolve(123);
            return d.promise;
        }

        function httpFun(q, url, postData, type) {
            //if (postData.method == 'GetPlansPage') { console.log(postData) }
            $http({
                method: type || 'POST',
                url: url + '?v=' + Math.random(),
                dataType: 'json',
                data: postData
            })
            .then(
                function (data) {
                    q.resolve(data.data);
                },
                function (data) {
                    q.reject();
                    if (data.status == 401) {
                        $cookieStore.remove('user-token');
                        if ($window.location.href != appUrl + 'Access.html#!/login') {
                            $window.location.href = appUrl + 'Access.html#!/login';
                        }
                    } else {
                        //console.log(data);
                        var m = data.data ? data.data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误');
                    }
                });
            return q.promise;
        }

        function HTTPWait(url, postData, type) {
            var TbData;
            $.ajax({
                type: type || 'post',
                url: url + '?v=' + Math.random(),
                async: false,  //使用同步的方式,true为异步方式
                data: postData,
                dataType: "json",
                beforeSend: function (request) {
                    if ($cookieStore.get('user-token')) {
                        request.setRequestHeader('x-session-token', $cookieStore.get('user-token'));
                    }
                    request.setRequestHeader('x-function', $cookieStore.get('active-function') || '');
                },
                success: function (data) {
                    //console.info(data);
                    TbData = data;
                },
                error: function (data) {
                    if (data.status == 401) {
                        $cookieStore.remove('user-token');
                        if ($window.location.href != appUrl + 'Access.html#!/login') {
                            $window.location.href = appUrl + 'Access.html#!/login';
                        }
                    } else {
                        //console.log(data);
                        var m = data.data ? data.data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误');
                    }
                }
            });
            return TbData;
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

        //休眠方法
        function sleep(d) {
            for (var t = Date.now() ; Date.now() - t <= d;);
        }

        //多笔打印
        function PrintMulti(templateId, TS, postData, printerName, hostIp) {
            var d = $q.defer();
            var list = [];
            var MainList = convertArray(postData) || [];
            var key = uuid();
            var index = 0;
            //执行
            SocketDo(hostIp, function (socket) {
                var en = {};
                en.Method = "PrintMulti";
                en.TemplateId = templateId;
                en.TS = TS;
                en.ServiceUrl = serviceUrl;
                en.PrinterName = printerName;
                //console.log(data);
                for (var i = 0, len = MainList.length; i < len; i++) {
                    var dat = MainList[i];
                    dat.MultiKey = key;
                    dat.Index = i;
                    dat.Total = len;
                    dat.IsEnd = i == len - 1;
                    en.Data = JSON.stringify(dat);
                    socket.send(JSON.stringify(en));
                    index = i;
                }
            }, function (reData) {
                if (reData.MesType == "Success") {
                    d.resolve(reData.Data);
                }
                else if (reData.MesType == "Error") {
                    //toastr.error(reData.Data, '服务错误');
                    d.reject(reData.Data);
                }
            }).then(function (s) {
                if (index == MainList.length - 1) {
                    d.resolve(s);
                }
            }, function (err) {
                d.reject(err);
            })
            return d.promise;
        }

        //打印PDF
        function PrintPdf(path, printerName, hostIp) {
            var d = $q.defer();
            SocketSend("PrintPdf", undefined, path, undefined, printerName, hostIp).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        function LightPrint(templateId, TS, postData, printerName, hostIp) {
            var d = $q.defer();
            SocketSend("LightPrint", templateId, TS, postData, printerName, hostIp).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        //获取com口列表
        function GetComPortList(hostIp) {
            var d = $q.defer();
            SocketSend("GetComPortList", undefined, undefined, undefined, undefined, hostIp).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }

        //获取com口重量数据
        function GetComWeight(com, Do) {
            var d = $q.defer();
            SocketSend("GetComWeigth", undefined, undefined, undefined, com, undefined, Do).then(function (data) {
                d.resolve(data);
            }, function (mes) { d.reject(mes); });
            return d.promise;
        }
        function SocketSend(method, Id, TS, postData, printerName, hostIp, Do) {
            return SocketDo(hostIp, function(socket){
                var en = {};
                en.Method = method;
                en.TemplateId = Id;
                en.TS = TS;
                en.Data = JSON.stringify(postData);
                en.ServiceUrl = serviceUrl;
                en.PrinterName = printerName;
                socket.send(JSON.stringify(en));
            }, Do)
        }

        function SocketDo(hostIp, openDo, Do) {
            var g = $q.defer();
            try {
                var strAddress = "ws://" + (hostIp || "127.0.0.1") + ":2018";
                var socket = new WebSocket(strAddress);
                socket.onerror = function (evt) {
                    if (evt.currentTarget.readyState == 3) {
                        var en = {};
                        $window.location.href = "MxqhPrinter:" + serviceUrl;
                        en.text = "打印服务还未启动或未安装，是否启动并重新发送数据？";
                        MyPop.Confirm(en, function () {
                            SocketDo(hostIp, openDo, Do);
                        });
                    }
                };
                socket.onopen = function () {
                    if (openDo) {
                        openDo(socket);
                    }
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
                        var m = reData.Data ? reData.Data.split("。")[0].replace(/System.Exception:/, '') : "错误";
                        toastr.error(m, '服务错误');
                        g.reject(m);
                    }
                    else if (reData.MesType == "Update") {
                        toastr.warning('服务器已有新版本的打印插件，请下载更新');
                        $window.location.href = reData.Data;
                    }

                    if (Do) {
                        Do(reData);
                    }

                };
            }
            catch (e) {
                toastr.error(e, '服务错误');
            }
            return g.promise;
        }

        function GetServerTime(Do) {
            var socket = undefined;
            return CallServerSocket("Time", undefined, undefined,Do);
        }

        function GetServerSocket(json, fun, Do) {
            var socket = undefined;
            return CallServerSocket("Request", JSON.stringify(json), fun, Do, socket);
        }

        function CallServerSocket(MsgType, json, fun, Do, socket) {
            var g = $q.defer();
            try {
                var en = {};
                en.Header = "MXQHServer";
                en.MsgType = MsgType;
                en.LoginKey = $cookieStore.get('user-token');
                en.RouteName = $state.current.name;
                en.GUID = $cookieStore.get('GUID');
                en.FunName = fun;
                en.Data = json;
                var Option = { Do: Do, data: en };
                CallSocket(g, en, socket, Do);
            }
            catch (e) {
                toastr.error(e, '服务错误');
            }
            return g.promise;
        }

        function CallSocket(g, en, socket, Do) {
            socket = new WebSocket(SocketServiceUrl);
            socket.onerror = function (evt) {
                //console.log(evt);
                //toastr.error(evt, '服务错误');
            };
            socket.onopen = function () {
                socket.send(JSON.stringify(en));
            };
            socket.onclose = function (e) {
            };
            socket.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                if (data.MsgType == "Heartbeat") {
                    if (data.RouteName == $state.current.name || en.MsgType == "Time") {
                        socket.send(evt.data);
                    }
                    else {
                        //console.log(evt.data);
                    }

                }
                else {
                    if (data.Response == "Success") {
                        g.resolve(data.Data);
                    }
                    else if (data.Response == "Error") {
                        toastr.error(data.Data, '服务错误');
                        g.reject(data.Data);
                    }
                    if (Do) {
                        Do(data.Data, socket);
                    }
                }
            };
        }

        //唯一标识信息 登陆时生成与保存
        function uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010  
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01  
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        }
    }
})();