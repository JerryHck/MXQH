'use strict';

angular.module('app')
.controller('DialogCtrl', ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'Dialog', 'AjaxService', '$window',
function ($scope, $uibModalInstance, Form, ItemData, toastr, Dialog, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.name ? 1 : 0];
    vm.NewItem = ItemData.name ? ItemData : {DialogNo : "-1", IsSystem: false, LoadFiles: [] };
    //是新增功能的时候--计算中间文件夹
    var dir = vm.NewItem.DialogNo== '-1' ? (new Date()).Format("yyyy") : new Date(vm.NewItem.CreateDate).Format("yyyy");
    vm.NewItem.Action = ItemData.name ? "U" : "I";
    vm.isExists = isExists;
    vm.LoadAdd = LoadAdd;

    vm.Save = Save;
    vm.DeleteLoad = DeleteLoad;
    vm.LoadDrop = LoadDrop;
    vm.LoadDrag = LoadDrag;
    vm.SaveAndPre = SaveAndPre;
    vm.Pre = Pre;
    //取消
    vm.cancel = cancel;

    vm.ToggleFile = ToggleFile;

    function LoadAdd() {
        if (vm.loadFile) {
            var have = false;
            angular.forEach(vm.NewItem.LoadFiles, function (f) {
                if (f == vm.loadFile) {
                    have = true; return;
                }
            });
            if (!have) {
                vm.NewItem.LoadFiles.push({ LoadName: vm.loadFile });
                vm.loadFile = undefined;
            }
        }
    }

    function Pre() {
        Dialog.OpenDialog(vm.NewItem.name, {}).then(function () { });
    }

    function SaveAndPre() {
        //保存设定
        Ok();

        for (var i = 0, len = vm.NewItem.LoadFiles.length; i < len; i++) {
            vm.NewItem.LoadFiles[i].SortNo = i;
        }
        vm.NewItem.ReturnCol = vm.NewItem.ReturnColumn;
        //编码生成
        if (vm.NewItem.DialogNo == '' || vm.NewItem.DialogNo == '-1') {
            vm.NewItem.DialogNo = '';
            var SNList = [{ name: "System", col: "Dialog", parm: "DialogNo", charName: "" }];
            vm.NewItem.SNColumns = JSON.stringify(SNList);
        }
        vm.NewItem.Temp = JSON.stringify(vm.NewItem.LoadFiles);
        vm.NewItem.TempColumns = "Temp";

        var Content = vm.NewItem.Content;
        var FunSet = vm.SaveItem.FunSetting;
        vm.NewItem.Content = undefined;
        AjaxService.ExecPlan("Dialog", 'save', vm.NewItem).then(function (data) {

            var Dia = data.data[0];

            //保存文件
            if (Dia && !Dia.IsSystem && Dia.DialogNo && Content) {
                FunSet.FunNo = Dia.DialogNo;
                var htmlEn = {};
                htmlEn.Dir = dir;
                htmlEn.FileName = FunSet.FunNo + ".html";
                htmlEn.Text = $window.btoa($window.encodeURIComponent(Content.Html));
                //保存html
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(htmlEn));

                var JsEn = {};
                JsEn.Dir = dir;
                JsEn.FileName = FunSet.FunNo + ".js";
                JsEn.Text = $window.btoa($window.encodeURIComponent(Content.Js));
                //保存JS
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(JsEn));

                //保存代码设定
                AjaxService.ExecPlan('FunCodeSet', "save", FunSet);
            }
            toastr.success('储存成功');
            setTimeout(function () {
                Pre();
            }, 1500);
        });
    }

    function Save() {
        //保存设定
        Ok();

        for (var i = 0, len = vm.NewItem.LoadFiles.length; i < len; i++) {
            vm.NewItem.LoadFiles[i].SortNo = i;
        }
        vm.NewItem.ReturnCol = vm.NewItem.ReturnColumn;
        //编码生成
        if (vm.NewItem.DialogNo == '' || vm.NewItem.DialogNo == '-1') {
            vm.NewItem.DialogNo = '';
            var SNList = [{ name: "System", col: "Dialog", parm: "DialogNo", charName: "" }];
            vm.NewItem.SNColumns = JSON.stringify(SNList);
        }
        vm.NewItem.Temp = JSON.stringify(vm.NewItem.LoadFiles);
        vm.NewItem.TempColumns = "Temp";

        var Content = vm.NewItem.Content;
        var FunSet = vm.SaveItem.FunSetting;
        vm.NewItem.Content = undefined;
        AjaxService.ExecPlan("Dialog", 'save', vm.NewItem).then(function (data) {

            var Dia = data.data[0];

            //保存文件
            if (Dia && !Dia.IsSystem && Dia.DialogNo && Content) {
                FunSet.FunNo = Dia.DialogNo;
                var htmlEn = {};
                htmlEn.Dir = dir;
                htmlEn.FileName = FunSet.FunNo + ".html";
                htmlEn.Text = $window.btoa($window.encodeURIComponent(Content.Html));
                //保存html
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(htmlEn));

                var JsEn = {};
                JsEn.Dir = dir;
                JsEn.FileName = FunSet.FunNo + ".js";
                JsEn.Text = $window.btoa($window.encodeURIComponent(Content.Js));
                //保存JS
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(JsEn));

                //保存代码设定
                AjaxService.ExecPlan('FunCodeSet', "save", FunSet);
            }
            toastr.success('储存成功');
            $uibModalInstance.close(vm.NewItem);
        });
    }

    function DeleteLoad(index) {
        vm.NewItem.LoadFiles.splice(index, 1);
    }

    function isExists(name) {
        var en = {};
        en.name = "name";
        en.value = name
        AjaxService.GetPlan("Dialog", en).then(function (data) {
            vm.DialogForm.name.$setValidity('unique', !data.name);
        });
    }

    // drop
    function LoadDrop(load, index) {
        var en = angular.copy(load);
        vm.NewItem.LoadFiles.splice(vm.LoadIndex, 1);
        vm.NewItem.LoadFiles.splice(index, 0, en);
    }

    //
    function LoadDrag(load, index) {
        vm.LoadIndex = index;
    }

    //取消
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };


    //切换文件方式
    function ToggleFile() {

        //添加文件
        if (vm.NewItem.IsSystem) {
            var have = false, index = -1;
            vm.NewItem.templateUrl = vm.OriHtml;
            vm.NewItem.LoadFiles = vm.OriJsList;
        }
        else {
            var have = false;
            vm.Index = 1;
            vm.OriHtml = vm.NewItem.templateUrl;
            vm.OriJsList = vm.NewItem.LoadFiles;
            vm.NewItem.DialogNo = vm.NewItem.DialogNo || -1;
            vm.NewItem.templateUrl = "CustomFun\\" + dir + "\\" + vm.NewItem.DialogNo + '.html';
            var js = "CustomFun\\" + dir + "\\" + vm.NewItem.DialogNo + '.js';
            angular.forEach(vm.NewItem.LoadFiles, function (f) {
                if (f.LoadName == js) {
                    have = true; return;
                }
            });
            if (!have) {
                var en = {};
                en.FunNo = vm.NewItem.DialogNo;
                en.LoadName = js;
                vm.NewItem.LoadFiles = vm.NewItem.FunLoad || [];
                vm.NewItem.LoadFiles.push(en);
            }
        }
    }


    //=========文档JS
    vm.ThisFun = {
        FunNo: ItemData.FunNo,
        FunName: "新弹窗设定",
        FunType: "R",
        DataType: "E",
        Controller: vm.NewItem.Controller,
        ControllerAs: vm.NewItem.ControllerAs,
        SerList: [],
        ColList: [],
    };
    vm.SerTypeConfig = { Table: "BasicData", Column: "SerType" };
    vm.SerAssConfig = { Table: "BasicData", Column: "SerAss" };
    vm.ColTypeConfig = { Table: "FunCodeColSet", Column: "ColType" };
    vm.AbleNullConfig = { Table: "FunCodeColSet", Column: "ABleNull" };

    vm.ChangeEntity = ChangeEntity;
    vm.ChangeProc = ChangeProc;
    vm.Drop = Drop;
    vm.Drag = Drag;
    vm.IsColChange = IsColChange;
    vm.FunType = FunType;
    vm.DeleteFunCol = DeleteFunCol;
    vm.AddSer = AddSer;
    vm.DeleteSer = DeleteSer;
    vm.IsColAll = IsColAll;
    vm.GenCode = GenCode;

    InitSer();
    //获取数据设定
    AjaxService.GetPlan("FunCodeSet", [{ name: "FunNo", value: ItemData.DialogNo }]).then(function (data) {
        if (data.FunNo) {
            //console.log(data);
            vm.ThisFun = data;
            vm.ThisFun.DialogNo = data.FunNo;
            vm.ThisFun.Controller = vm.NewItem.Controller;
            vm.ThisFun.ControllerAs = vm.NewItem.ControllerAs;
            GetColList(true);
            GetEnProcList();
        }
    });

    AjaxService.GetPlans("SysUISelect").then(function (data) {
        vm.SelectList = data;
    });

    if (!vm.NewItem.IsSystem) {
        //获取js， html文件
        AjaxService.AjaxHandle("GetFileText", dir + "\\" + ItemData.DialogNo).then(function (data) {
            vm.NewItem.Content = {};
            vm.NewItem.Content.Html = (data.Html || "").replace(/ControlNew/g, vm.NewItem.ControllerAs);
            vm.NewItem.Content.Js = (data.Js || "").replace(/NewJsCtrl/g, vm.NewItem.Controller);
        })
    }

    function FunType() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        GetColList();
    }

    function ChangeEntity() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        if (vm.ThisFun.DataType == 'P') {
            vm.ThisFun.ShortName = undefined;
            GetEnProcList();
        }
        if (vm.ThisFun.DataType == 'E') {
            GetColList();
        }
    }

    function GetEnProcList() {
        var en = {};
        en.name = "EntityName";
        en.value = vm.ThisFun.EntityName;
        AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
            vm.ProcList = data;
        });
    }

    function MergeEnColList() {
        vm.ThisFun.ColList = vm.ThisFun.ColList || [];
        var count = 0;
        for (var i = 0, len = vm.EnColList.length; i < len; i++) {
            if (!vm.EnColList[i]) continue;
            for (var j = 0, len2 = vm.ThisFun.ColList.length; j < len2; j++) {
                if (vm.EnColList[i].ColumnName == vm.ThisFun.ColList[j].ColumnName) {
                    vm.EnColList[i].IsShow = true;
                    vm.ThisFun.ColList[j].ColumnType = vm.EnColList[i].ColumnType;
                    vm.ThisFun.ColList[j].TableAs = vm.ThisFun.ColList[j].ColumnName.substr(0, 1);
                    count++;
                }
            }
        }
        if (count == vm.EnColList.length) {
            vm.IsAll = true;
        }
    }

    function ChangeProc() {
        vm.ThisFun.ColList = [];
        vm.EnColList = [];
        GetColList();

        var en = {};
        en.planName = vm.ThisFun.EntityName;
        en.shortName = vm.ThisFun.ShortName;

        //获取存储过程查询条件
        AjaxService.Custom("GetProcPara", en).then(function (data) {
            vm.ThisFun.SerList = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var Ser = {};
                Ser.ColumnName = data[i].ColumnName;
                Ser.SerName = data[i].SerName;
                Ser.SerType = data[i].SerType;
                vm.ThisFun.SerList.push(Ser);
            }
        });
    }

    function GetColList(isLoad) {
        var en = {};
        en.planName = vm.ThisFun.EntityName;
        //实体自身的栏位取值
        if (vm.ThisFun.DataType == 'E' && vm.ThisFun.EntityName) {
            en.shortName = '--';
        }
        else if (vm.ThisFun.DataType == 'P' && vm.ThisFun.ShortName) {
            en.shortName = vm.ThisFun.ShortName;
        }
        else {
            return;
        }
        vm.promise = AjaxService.BasicCustom("GetPlanColumnsCon", en).then(function (data) {
            vm.List = data;
            var enList = [];
            //获取数据库记录
            enList.push({ name: "EntityName", value: ItemData.EntityName });
            enList.push({ name: "ShortName", value: ItemData.ShortName });
            enList.push({ name: "ProcSchema", value: ItemData.ProcSchema });
            enList.push({ name: "ProcName", value: ItemData.ProcName });
            AjaxService.GetPlans("EnProcExcel", enList).then(function (data2) {
                vm.DataList = data2;
                for (var i = 0, len = vm.List.length; i < len; i++) {
                    var ex = vm.List[i];
                    //初始化
                    for (var a = 0, l = ex.Columns.length; a < l; a++) {
                        var col = ex.Columns[a];
                        col.ColumnText = col.ColumnText || col.ColumnName;
                        col.ReadIndex = ex.ReadIndex;

                        //双方数据匹配
                        for (var j = 0, len2 = data2.length; j < len2; j++) {
                            if (ex.ReadIndex == data2[j].ReadIndex) {
                                if (data2[j].Columns) {
                                    for (var k = 0, len3 = data2[j].Columns.length; k < len3; k++) {
                                        var colDb = data2[j].Columns[k];
                                        if (col.ReadIndex == colDb.ReadIndex && col.ColumnName == colDb.ColumnName) {
                                            col.IsConvert = colDb.IsConvert;
                                            col.ConvertType = colDb.ConvertType;
                                            col.ColumnText = colDb.ColumnText;
                                            col.IsAutoMerge = colDb.IsAutoMerge;
                                            col.IsExcel = colDb.IsExcel;
                                            col.ExcelRowNum = colDb.ExcelRowNum;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                vm.EnColList = vm.List[0].Columns;
                if (isLoad) {
                    MergeEnColList();
                }
            })
        })
    }

    //添加条件
    function AddSer() {
        var have = false;
        vm.ThisFun.SerList = vm.ThisFun.SerList || [];
        //if (!checkHaveCol(vm.ThisFun.SerList, vm.newSer.ColumnName)) {
        //    vm.ThisFun.SerList.push(vm.newSer);
        //}
        vm.ThisFun.SerList.push(vm.newSer);
        InitSer();
    }

    function DeleteSer(index) {
        vm.ThisFun.SerList.splice(index, 1);
    }

    //显示栏位改变
    function IsColChange(col) {
        vm.ThisFun.ColList = vm.ThisFun.ColList || []
        if (col.IsShow) {
            if (!checkHaveCol(vm.ThisFun.ColList, col.ColumnName)) {
                vm.ThisFun.ColList.push(Convert(col));
            }
        }
        else {
            var index = -1;
            for (var i = 0, len = vm.ThisFun.ColList.length; i < len; i++) {
                if (vm.ThisFun.ColList[i].ColumnName == col.ColumnName) {
                    index = i; break;
                }
            }
            vm.IsAll = false;
            vm.ThisFun.ColList.splice(index, 1);
        }
    }

    function IsColAll() {
        if (!vm.EnColList) { return; }
        if (vm.IsAll) {
            for (var i = 0, len = vm.EnColList.length; i < len; i++) {
                if (!checkHaveCol(vm.ThisFun.ColList, vm.EnColList[i].ColumnName)) {
                    vm.ThisFun.ColList.push(Convert(vm.EnColList[i]));
                }
            }
        }
        else {
            vm.ThisFun.ColList = [];
            for (var i = 0, len = vm.EnColList.length; i < len; i++) {
                vm.EnColList[i].IsShow = false;
            }
        }
    }

    // drop
    function Drop(rol, index) {
        var en = angular.copy(rol);
        vm.ThisFun.ColList.splice(vm.DragIndex, 1);
        vm.ThisFun.ColList.splice(index, 0, en);
    }

    //检查是否已经存在
    function checkHaveCol(List, colName) {
        var have = false;
        for (var j = 0, len2 = List.length; j < len2; j++) {
            if (List[j].ColumnName == colName) {
                have = true; break;
            }
        }
        return have;
    }

    //
    function Drag(rol, index) {
        vm.DragIndex = index;
    }

    function DeleteFunCol(col, index) {
        col.IsShow = false;
        vm.IsAll = false;
        vm.ThisFun.ColList.splice(index, 1);
    }
    
    //生成代码
    function GenCode() {
        if (!vm.ThisFun.ColList || vm.ThisFun.ColList.length == 0) {
            toastr.error("还未配置栏目， 不允许生成");
            return;
        }
        vm.NewItem.Content = GenFuntionCode(vm.ThisFun);
        toastr.success('生成成功');
    }

    //查询列表出差
    function Ok() {
        vm.SaveItem = {};
        vm.SaveItem.FunSetting = angular.copy(vm.ThisFun);
        vm.SaveItem.FunSetting.Controller = vm.NewItem.controller;
        vm.SaveItem.FunSetting.ControllerAs = vm.NewItem.controllerAs;
        var SerList = vm.ThisFun.SerList || [];
        for (var i = 0, len1 = SerList.length; i < len1; i++) {
            SerList[i].SerValue = SerList[i].SerValue || '';
            SerList[i].SerTName = SerList[i].SerTName || '';
            SerList[i].SerAss = SerList[i].SerAss || '=';
            SerList[i].SerType = SerList[i].SerType || 'Text';
            SerList[i].IsHide = SerList[i].IsHide || false;
            SerList[i].SortNo = i + 1;
        }
        vm.SaveItem.FunSetting.SerList = JSON.stringify(SerList);

        var ColList = [];
        for (var j = 0, len2 = vm.ThisFun.ColList.length; j < len2; j++) {
            var col = {};
            col.ColumnName = vm.ThisFun.ColList[j].ColumnName;
            col.ColumnText = vm.ThisFun.ColList[j].ColumnText;
            col.Width = vm.ThisFun.ColList[j].Width;
            col.EnNameDiv = vm.ThisFun.ColList[j].EnNameDiv || '';
            col.EditCol = vm.ThisFun.ColList[j].EditCol || '';
            col.EditColDiv = vm.ThisFun.ColList[j].EditColDiv || '';
            col.ColType = vm.ThisFun.ColList[j].ColType || '';
            col.ColValue = vm.ThisFun.ColList[j].ColValue || '';
            col.ABleNull = vm.ThisFun.ColList[j].ABleNull || '1';
            col.CheckExists = vm.ThisFun.ColList[j].CheckExists || false;
            col.SortNo = j + 1;
            ColList.push(col);
        }
        vm.SaveItem.FunSetting.ColList = JSON.stringify(ColList);
        vm.SaveItem.FunSetting.TempColumns = "ColList,SerList";
        //$uibModalInstance.close(vm.NewItem);
    };

    function Convert(item) {
        var en = item;
        en.ColumnText = en.ColumnText || en.ColumnName;
        en.Width = "100px";
        en.EnNameDiv = en.EnNameDiv || '';
        en.EditCol = en.ColumnName;
        en.EditColDiv = en.EnNameDiv;
        en.ColType = 'Text';
        en.TableAs = en.ColumnName.substr(0, 1);
        en.ABleNull = en.TableAs != 'a' || en.ColumnType == "3" ? "0" : "1";
        en.CheckExists = false;
        return en;
    }

    function InitSer() {
        vm.newSer = {
            SerType: "Text",
            SerAss: "=",
            IsHide: false
        };
    }



    //=======================================
    //=================================代码生成
    function GenFuntionCode(fun) {
        var en = {};
        //基本功能
        if (fun.FunType == "B") {
            en.Html = genHtmlForBasicFun(fun);
            en.Js = genJsForBasicFun(fun);
        }
            //报表
        else if (fun.FunType == "R") {
            en.Html = genHtmlForReport(fun);
            en.Js = genJsForReport(fun);
        }
        return en;
    }

    //查询HTML代码生成
    function genHtmlForReport(fun) {
        var maxSize = vm.NewItem.size == 'sm' || !vm.NewItem.size || vm.NewItem.size == "" ? "5" : "10";
        var sbHtml = "";
        sbHtml += "<div class=\"modal-header text-center\">\n";
        sbHtml += '    <button class="btn btn-sm btn-warning pull-left" type="button" ng-click="' + vm.NewItem.controllerAs + '.Cancel()">取消</button>\n';
        sbHtml += '    <h3 class="modal-title">' + fun.FunName + '</h3>\n';
        sbHtml += "</div>\n";
        sbHtml += '<div class="modal-body wrapper-xs h6" ng-form="DialogForm">\n';
        sbHtml += '    <div class="panel panel-default">\n';
        sbHtml += '        <div class="panel-body padder-xs padder-v-xxs">\n';
        sbHtml += '            <div class="wrapper-sm">\n';
        sbHtml += '                <div class="form-inline">\n';
        //生成查询条件
        sbHtml = genHtmlSer(fun, sbHtml);
        sbHtml += "                    <button class= \"btn btn-sm btn-info \" ng-click= \"" + vm.NewItem.controllerAs + ".Search() \"><i class= \"glyphicon glyphicon-search \"></i>查询</button>\n";

        sbHtml += '                </div>\n';
        sbHtml += '            </div>\n';
        sbHtml += '            <div class="padder-sm table-responsive">\n';
        sbHtml += '                <table class="table one-line">\n';
        sbHtml += '                    <thead>\n';
        sbHtml += '                        <tr>\n';
        fun.ColList.forEach(function (row) {
            sbHtml += "                            <td title=\"" + row.ColumnText + "\" style= \"width:" + (row.Width ? "100px" : row.Width) + " \">" + row.ColumnText + "</td>\n";
        });
        //标题添加
        sbHtml += '                        </tr>\n';
        sbHtml += '                    </thead>\n';
        sbHtml += '                    <tr ng-repeat="item in ' + vm.NewItem.controllerAs + '.List " ng-click="' + vm.NewItem.controllerAs + '.OK(item)">\n';
       
        fun.ColList.forEach(function (row) {
            if (fun.DataType == "E") {
                sbHtml += "                        <td title=\"{{ item." + row.EditColDiv + subColName(row.ColumnName) + " }}\">{{ item." + row.EditColDiv + subColName(row.ColumnName) + " }}</td>\n";
            }
            else if (fun.DataType == "P") {
                sbHtml += "                        <td title=\"{{ item." + row.ColumnName + " }}\">{{ item." + row.ColumnName + " }}</td>\n";
            }
        });

        sbHtml += "                    </tr>\n";
        sbHtml += "                </table>\n";
        sbHtml += "                <div class= \"col-md-12 text-center \" ng-if= \"" + vm.NewItem.controllerAs + ".page.total>" + vm.NewItem.controllerAs + ".page.size \">\n";
        sbHtml += "                    <div uib-pagination total-items= \"" + vm.NewItem.controllerAs + ".page.total \" ng-model= \"" + vm.NewItem.controllerAs + ".page.index \" items-per-page= \"" + vm.NewItem.controllerAs + ".page.size \" max-size= \"" + maxSize + " \" first-text= \"<< \" previous-text= \"< \"\n";
        sbHtml += "                     ng-change= \"" + vm.NewItem.controllerAs + ".PageChange() \" next-text= \"> \" last-text= \">> \" boundary-links= \"true \" boundary-link-numbers= \"true \"></div>\n";
        sbHtml += '                </div>\n';
        sbHtml += '            </div>\n';
        sbHtml += '        </div>\n';
        sbHtml += '    </div>\n';
        sbHtml += '</div>\n';
        return sbHtml;
    }

    function genJsForReport(fun) {
        var sbJs = "";
        fun.SerList = fun.SerList || [];
        sbJs += "'use strict';\n";
        sbJs += "\n";
        sbJs += "angular.module('AppSet')\n";
        sbJs += ".controller('" + vm.NewItem.controller + "', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',\n";
        sbJs += "function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {\n";
        sbJs += "\n";
        sbJs += "    var vm = this;\n";
        sbJs += "    vm.page = { index: 1, size: 10 };\n";
        sbJs += "    vm.Ser = {};\n";
        //隐藏条件 -- 默认值
        fun.SerList.forEach(function (ser) {
            if (ser.IsHide && !ser.SerValue) {
                var s = ser.SerType == "Num" ? ser.SerValue + ";" : "\"" + ser.SerValue + "\";";
                sbJs += "    vm.Ser." + ser.ColumnName + " = " + s + "\n";
            }
        });

        sbJs += "\n";
        sbJs += "    vm.PageChange = PageChange;\n";
        sbJs += "    vm.Search = Search;\n";
        sbJs += "    vm.OK = OK;\n";
        sbJs += "    vm.Cancel = Cancel;\n";
        sbJs += "\n";
        sbJs += "    Search();\n";
        sbJs += "    function Search() {\n";
        sbJs += "        vm.page.index = 1;\n";
        sbJs += "        PageChange();\n";
        sbJs += "    }\n";
        sbJs += "\n";
        sbJs += "    function PageChange() {\n";

        //实体方式
        if (fun.DataType == "E") {
            sbJs += "        vm.promise = AjaxService.GetPlansPage(\"" + fun.EntityName + "\", GetContition(), vm.page.index, vm.page.size).then(function (data) {\n";
            sbJs += "            vm.List = data.List;\n";
            sbJs += "            vm.page.total = data.Count;\n";
            sbJs += "        });\n";
            sbJs += "\n";
            sbJs += "    }\n";

            sbJs += "    function GetContition() {\n";
            sbJs = getEnJsSer(fun, sbJs);
            sbJs += "        return list;\n";
            sbJs += "    }\n";

        }
        else if (fun.DataType == "P") {
            sbJs += "        vm.promise = AjaxService.ExecPlanPage(\"" + fun.EntityName + "\", \"" + fun.ShortName + "\", vm.Ser, vm.page.index, vm.page.size).then(function (data) {\n";
            sbJs += "            vm.List = data.List;\n";
            sbJs += "            vm.page.total = data.Count;\n";
            sbJs += "        });\n";
            sbJs += "\n";
            sbJs += "    }\n";
            sbJs += "\n";
        }

        sbJs += "    function OK(item) {\n";
        if (vm.Item && vm.Item.ReturnColumn) {
            sbJs += "        $uibModalInstance.close(item." + subColName(vm.Item.ReturnColumn) + ");\n";
        }
        else {
            sbJs += "        $uibModalInstance.close(item);\n";
        }
        sbJs += "    }\n";

        sbJs += "    function Cancel() {\n";
        sbJs += "        $uibModalInstance.dismiss('cancel');\n";
        sbJs += "    }\n";

        sbJs += "\n";
        sbJs += "}]);\n";

        return sbJs;
    }

    function getEnJsSer(fun, sbJs) {
        sbJs += "        var list = [];\n";
        if (fun.SerList.length == 0) return sbJs;
        var listHave = [];
        //条件加入
        fun.SerList.forEach(function (ser) {
            var have = 0;
            listHave.forEach(function (h) {
                if (h == ser.ColumnName) {
                    have += 1;
                }
            });
            var name = have == 0 ? ser.ColumnName : ser.ColumnName + have;
            name = name.ToPinYin();
            sbJs += "        if (vm.Ser." + name + ") {\n";
            sbJs += "            list.push({ name: \"" + subColName(ser.ColumnName) + "\", value: vm.Ser." + name +
                ", tableAs:\"" + ser.ColumnName.substring(0, 1) + "\"" + (ser.SerAss == "=" ? "" : ", type:\"" + ser.SerAss + "\"") + " });\n";
            sbJs += "        }\n";
            listHave.push(ser.ColumnName);
        });
        return sbJs;
    }

    //弹出窗类HTML代码生成
    function genHtmlForBasicFun(fun) {
        var sbHtml = "";

        sbHtml += '<div class="modal-header text-center">\n';
        sbHtml += '    <span class="modal-title h3">' + fun.FunName + '{{ ' + vm.NewItem.controllerAs + '.form.title }}</span>\n';
        sbHtml += '</div>\n';
        sbHtml += '<div class="modal-body wrapper-xs">\n';
        sbHtml += '    <div class="panel panel-default scroll-y" ng-form=\"' + vm.NewItem.controllerAs + '.DialogForm\">\n';
        sbHtml += '        <div class="panel-body  padder-xs padder-v-xxs">\n';
        sbHtml += '            <div class="form-horizontal no-padder">\n';

        //是否有下拉选择框
        var have = 0;
        fun.ColList.forEach(function (p) {
            if (p.ColType == "Select") {
                have += 1;
            }
        });
        var colwidth = vm.NewItem.size == 'sm' || !vm.NewItem.size || vm.NewItem.size == "" ? "col-xs-12 " : "col-xs-6 ";
        var formwidth = fun.ColList.length >= 12 ? "form-group-xs " : "form-group ";
        //栏位添加
        fun.ColList.forEach(function (row) {
            if (row.ABleNull != "4") {
                
                sbHtml += '                <div class="' + formwidth + ' ' + colwidth + 'no-padder">\n';
                sbHtml += '                    <label class="col-xs-4 control-label">' + row.ColumnText + '</label>\n';
                sbHtml = getHtmlRowEdit(fun, sbHtml, row);

                sbHtml += '                </div>\n';
            }
        })
        sbHtml += '            </div>\n';
        sbHtml += '        </div>\n';
        sbHtml += '    </div>\n';
        sbHtml += '</div>\n';
        sbHtml += '<div class="modal-footer">\n';
        sbHtml += '    <div class="col-md-12 text-center">\n';
        sbHtml += '        <button class="btn btn-success pull-none" type="button" ng-disabled="' + vm.NewItem.controllerAs + '.DialogForm.$invalid" ng-click="' + vm.NewItem.controllerAs + '.Save()">储存</button>\n';
        sbHtml += '        <button class="btn btn-warning pull-none" type="button" ng-click="' + vm.NewItem.controllerAs + '.Cancel()">取消</button>\n';
        sbHtml += '    </div>\n';
        sbHtml += '</div>\n';
        return sbHtml;
    }

    function getHtmlRowEdit(fun, sbHtml, row) {
        var colName = subColName(row.EditCol);
        sbHtml += '                    <div class="col-xs-8 no-padder" ng-class="{ \'has-error\' : ' + vm.NewItem.controllerAs + '.DialogForm.' + colName + '.$invalid }">\n';

        //是否可以编辑是修改
        var ableEdit = row.ABleNull == '0' || row.ABleNull == '1' ? "" + vm.NewItem.controllerAs + ".form.index == 1\" || " + vm.NewItem.controllerAs + ".form.index == 2" : vm.NewItem.controllerAs + ".form.index == 2";
        var strCheckExcist = row.CheckExists ? " ng-blur=\"" + vm.NewItem.controllerAs + ".Is" + colName + "Exists()\" " : "";
        var str = "                        ";
        switch (row.ColType) {
            case "Text": str += "<input type=\"text\" name=\"{0}\" ng-disabled=\"" + ableEdit + "\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.Item.{0}\" {3} {4}/>"; break;
            case "Num": str += "<input type=\"number\" name=\"{0}\" ng-disabled=\"" + ableEdit + "\"  class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.Item.{0}\" {3} />"; break;
            case "Email": str += "<input type=\"email\" name=\"{0}\" ng-disabled=\"" + ableEdit + "\"  class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.Item.{0}\" {3} />"; break;
            case "Date": str += "<input type=\"text\" date-picker  ng-disabled=\"" + ableEdit + "\"  name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.Item.{0}\" option=\"{2}.DateOption\"  {3} />"; break;
            case "DateTime": str += "<input type=\"text\" date-time-picker ng-disabled=\"" + ableEdit + "\"  name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.Item .{0}\" option=\"{2}.DateOption\"  {3} />"; break;
            case "Select": str += "<div basic-select=\"" + row.ColValue + "\"  ng-disabled=\"" + ableEdit + "\"  ng-name=\"{0}\" placeholder=\"{1}\" ng-model=\"{2}.Item.{0}\" " + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
            case "Config": str += "<div config-select ng-model=\"{2}.Item.{0}\"  ng-disabled=\"" + ableEdit + "\"  ng-name=\"{0}\" placeholder=\"{1}\" tb=\"" + row.ColValue.split(',')[0] + "\" col=\"" + row.ColValue.split(',')[1] + "\"" + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
            case "Switch":
                str += "<div toggle-switch ng-model=\"{2}.NewItem.{0}\"  is-disabled=\"" + ableEdit + "\"  class=\"w-xxs switch-success\" on-label=\"是\" off-label=\"否\" on-value = \"1\" off-value =\"0\"></div>";
                break;
            case "CheckBox":
                str += "<label class=\"i-checks i-checks\"><input type =\"checkbox\" ng-disabled=\"" + ableEdit + "\" ng-model = \"{2}.Item.{0}\"><i></i>{2}</label>";
                break;
        }
        sbHtml += str.Format(colName, row.ColumnText, vm.NewItem.controllerAs, (row.ABleNull == "3" ? "" : "required"), strCheckExcist) + "\n";
        if (row.CheckExists) {
            str = "                        ";
            sbHtml += str + "<div ng-messages=\"" + vm.NewItem.controllerAs + ".DialogForm." + colName + ".$error\" class=\"help-block\" role=\"alert\">\n";
            sbHtml += str + "    <div ng-message=\"unique\">" + row.ColumnText + "重复</div>\n";
            sbHtml += str + "</div>\n";
        }

        sbHtml += '                    </div>\n';
        return sbHtml;
    }

    function genHtmlSer(fun, sbHtml) {
        if (!fun.SerList || fun.SerList.length == 0) { return sbHtml; }
        var listHave = [];
        //条件加入
        fun.SerList.forEach(function (ser) {
            if (!ser.IsHide) {
                var have = 0;
                listHave.forEach(function (h) {
                    if (h == ser.ColumnName) {
                        have += 1;
                    }
                });
                var name = have == 0 ? ser.ColumnName : ser.ColumnName + have;
                name = name.ToPinYin();
                sbHtml += "                    <div class=\"form-group\">\n";
                var str = "";
                switch (ser.SerType) {
                    case "Text": str += "<input type=\"text\" class=\"form-control\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\">"; break;
                    case "Num": str += "<input type=\"number\" class=\"form-control\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\">"; break;
                    case "Email": str += "<input type=\"Email\" class=\"form-control\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\">"; break;
                    case "Date": str += "<input type=\"text\" date-picker class=\"form-control\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\" option=\"{0}.DateOption\">"; break;
                    case "DateTime": str += "<input type=\"text\" date-time-picker class=\"form-control\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\" option=\"{0}.DateTimeOption\">"; break;
                    case "Select": str += "<div basic-select=\"{3}\"  ng-model=\"{0}.Ser.{1}\" placeholder=\"{2}\" ></div>"; break;
                    case "Config": str += "<div config-select ng-model=\"{0}.Ser.{1}\" tb=\"" + ser.SerTName.Split(',')[0] + "\" col=\"" + ser.SerTName.Split(',')[1] + "\" placeholder=\"{2}\"></div>"; break;
                    case "Switch": str += "<div toggle-switch ng-model=\"{0}.Ser.{1}\" class=\"w-xxs switch-success\" on-label=\"是\" off-label=\"否\" on-value = \"1\" off-value =\"0\"></div >"; break;
                    case "CheckBox": str += "<label class=\"i-checks i-checks\"><input type =\"checkbox\" ng-model = \"{0}.Ser.{1}\" ><i></i>{2}</label>"; break;
                }
                sbHtml += "                        " + str.Format(vm.NewItem.controllerAs, name, ser.SerName, ser.SerTName, ser.ColumnName) + "\n";
                sbHtml += "                    </div>\n";
                listHave.push(ser.ColumnName);
            }
        });
        return sbHtml;
    }


    function genJsForBasicFun(fun) {

        var sbJS = "";
        sbJS += "'use strict';\n";
        sbJS += "\n";
        sbJS += "angular.module('AppSet')\n";
        sbJS += ".controller('" + vm.NewItem.controller + "', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',\n";
        sbJS += "function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {\n";
        sbJS += "\n";
        sbJS += "    var vm = this;\n";
        //判断是否是编辑状态
        var KeyCol = fun.ColList[0].EditCol;
        var have = 0;
        //以非空栏目判断值
        for (var i = 0, len = fun.ColList.length; i < len; i++) {
            var row = fun.ColList[i];
            if (row.ABleNull == "2" || row.ABleNull == "4") {
                KeyCol = fun.ColList[0].EditCol;
                break;
            }
        }
        sbJS += "    vm.form = Form[ItemData." + subColName(KeyCol) + " ? 1 : 0];";
        sbJS += "    vm.Item = angular.copy(ItemData);;";


        sbJS += "\n";
        sbJS += "    vm.Save = Save;\n";
        sbJS += "    vm.Cancel = Cancel;\n";

        for (var j = 0, len1 = fun.ColList.length; j < len1; j++) {
            var col = fun.ColList[j];
            if (col.CheckExists) {
                var colName = subColName(col.ColumnName);
                sbJS += "    vm.Is" + colName + "Exists = Is" + colName + "Exists;\n";
            }
        }

        sbJS += "    function Save() {\n";
        sbJS += "        if (vm.form.index==0) {\n";
        sbJS += "            vm.promise = AjaxService.PlanInsert(\"" + fun.EntityName + "\", vm.Item).then(function (data) {\n";
        sbJS += "                toastr.success('储存成功');\n";
        sbJS += "                $uibModalInstance.close(vm.Item);\n";
        sbJS += "            });\n";
        sbJS += "        }\n";
        sbJS += "        else {";
        sbJS += "            var en = {};\n";
        for (var h = 0, len2 = fun.ColList.length; h < len2; h++) {
            var row = fun.ColList[h];
            if (row.ABleNull != "0") {
                sbJS += "            en." + subColName(row.EditCol) + " = vm.Item." + subColName(row.EditCol) + ";\n";
            }
        }
        sbJS += "            vm.promise = AjaxService.PlanUpdate(\"" + fun.EntityName + "\", en).then(function (data) {\n";
        sbJS += "                toastr.success('储存成功');\n";
        sbJS += "                $uibModalInstance.close(en);\n";
        sbJS += "            });\n";
        sbJS += "        }\n";
        sbJS += "    };\n";
        sbJS += "\n";

        for (var k = 0, len3 = fun.ColList.length; k < len3; k++) {
            var col = fun.ColList[k];
            if (col.CheckExists) {
                var colName = subColName(col.EditCol);
                sbJS += "    function Is" + colName + "Exists() {\n";
                sbJS += "        var list = [];\n";
                sbJS += "        list.push({ name: \"" + colName + "\", value: vm.Item." + colName + " });\n";
                sbJS += "        AjaxService.GetPlan(\"" + fun.EntityName + "\", list).then(function (data) {\n";
                sbJS += "            vm.DialogForm." + colName + ".$setValidity('unique', !data." + colName + ");\n";
                sbJS += "        });\n";
                sbJS += "    }\n";
            }
        }


        sbJS += "    function Cancel() {\n";
        sbJS += "        $uibModalInstance.dismiss('cancel');\n";
        sbJS += "    }\n";

        sbJS += "\n";
        sbJS += "}]);\n";

        return sbJS;
    }

    function subColName(colName) {
        return colName.substr(2, colName.length - 2);
    }

}
]);