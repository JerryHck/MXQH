'use strict';

angular.module('app')
.controller('FunFileContentDialogCtrl', ['$scope', '$uibModalInstance', 'ItemData', 'toastr', 'AjaxService', '$rootScope',
function ($scope, $uibModalInstance, ItemData, toastr, AjaxService, $rootScope) {
    var vm = this;
    vm.NewItem = ItemData;
    vm.Index = 2;
    vm.ThisFun = {
        FunNo: ItemData.FunNo,
        FunName:"新自定义功能",
        FunType: "R",
        DataType: "E",
        Controller: vm.NewItem.Controller,
        ControllerAs: vm.NewItem.ControllerAs,
        SerList: [],
        ColList:[],
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

    //中间文件夹
    var dir = ItemData.FunNo == '-1' ? (new Date()).Format("yyyyMM") : new Date(ItemData.CreateDate).Format("yyyyMM");

    InitSer();
    //获取数据设定
    AjaxService.GetPlan("FunCodeSet", [{ name: "FunNo", value: ItemData.FunNo }]).then(function (data) {
        if (data.FunNo) {
            //console.log(data);
            vm.ThisFun = data;
            vm.ThisFun.FunNo = ItemData.FunNo;
            vm.ThisFun.Controller = vm.NewItem.Controller;
            vm.ThisFun.ControllerAs = vm.NewItem.ControllerAs;
            GetColList(true);
            GetEnProcList();
        }
    });

    AjaxService.GetPlans("SysUISelect").then(function (data) {
        vm.SelectList = data;
    });

    //取消
    vm.cancel = cancel;
    vm.Ok = Ok;

    if (!vm.NewItem.Content) {
        //获取js， html文件
        AjaxService.AjaxHandle("GetFileText", dir + "\\" + ItemData.FunNo).then(function (data) {
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
                if(isLoad){
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
        if (!vm.EnColList) { return;}
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
        //var en = {};
        //en.strJson = JSON.stringify(vm.ThisFun);
        //AjaxService.Custom("GenFuntionCode", en).then(function (data) {
        //    vm.NewItem.Content = data;
        //    toastr.success('生成成功');
        //    vm.Index = 0;
        //})
        if (!vm.ThisFun.ColList || vm.ThisFun.ColList.length == 0) {
            toastr.error("还未配置栏目， 不允许生成");
            return;
        }
        vm.NewItem.Content = GenFuntionCode(vm.ThisFun);
        toastr.success('生成成功');
    }

    //关闭
    function Ok() {
        vm.NewItem.FunSetting = angular.copy(vm.ThisFun);
        
        var SerList = vm.ThisFun.SerList || [];
        for (var i = 0, len1 = SerList.length; i < len1; i++) {
            SerList[i].SerValue = SerList[i].SerValue || '';
            SerList[i].SerTName = SerList[i].SerTName || '';
            SerList[i].SerAss = SerList[i].SerAss || '=';
            SerList[i].SerType = SerList[i].SerType || 'Text';
            SerList[i].IsHide = SerList[i].IsHide || false;
            SerList[i].SortNo = i + 1;
        }
        vm.NewItem.FunSetting.SerList = JSON.stringify(SerList);

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
        vm.NewItem.FunSetting.ColList = JSON.stringify(ColList);
        vm.NewItem.FunSetting.TempColumns = "ColList,SerList";
        $uibModalInstance.close(vm.NewItem);
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
            IsHide:false
        };
    }

    //关闭
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };


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

    //报表类HTML代码生成
    function genHtmlForReport(fun) {
        var sbHtml = "";
        sbHtml += "<uib-tabset active=\"active\" type=\"tabs\" class=\"h-100\" cg-busy=\"" + fun.ControllerAs + ".promise\">\n";
        sbHtml += "    <uib-tab index=\"0\">\n";
        sbHtml += "        <uib-tab-heading class=\"h5\">" + fun.FunName + "</uib-tab-heading>\n";
        sbHtml += "        <div class=\"wrapper-xs\">\n";
        sbHtml += "            <div class=\"form-inline\">\n";
        //生成查询条件
        sbHtml = genHtmlSer(fun, sbHtml);
        sbHtml += "                <button class= \"btn btn-sm btn-info \" ng-click= \"" + fun.ControllerAs + ".Search() \"><i class= \"glyphicon glyphicon-search \"></i>查询</button>\n";
        sbHtml += "                <button class= \"btn btn-sm btn-success \" ng-click= \"" + fun.ControllerAs + ".ExportExcel() \"><i class= \"glyphicon glyphicon-export \"></i> 导出</button>\n";
        sbHtml += "            </div>\n";
        sbHtml += "        </div>\n";


        sbHtml += "        <div class= \"padder-xs \">\n";
        sbHtml += "            <div class=\"col-md-12 scroll-x no-padder\">\n";
        sbHtml += "                <table class= \"table \" >\n";
        sbHtml += "                    <thead>\n";
        sbHtml += "                        <tr>\n";
        fun.ColList.forEach(function (row) {
            sbHtml += "                            <td title=\"" + row.ColumnText + "\" style= \"width:" + (row.Width ? "100px" : row.Width) + " \">" + row.ColumnText + "</td>\n";
        });
        sbHtml += "                        </tr>\n";
        sbHtml += "                    </thead>\n";
        sbHtml += "                    <tr ng-repeat= \"item in " + fun.ControllerAs + ".List \">\n";
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
        sbHtml += "            </div>\n";
        sbHtml += "            <div class= \"col-md-12 text-center \" ng-if= \"" + fun.ControllerAs + ".page.total>" + fun.ControllerAs + ".page.size \">\n";
        sbHtml += "                <div uib-pagination total-items= \"" + fun.ControllerAs + ".page.total \" ng-model= \"" + fun.ControllerAs + ".page.index \" items-per-page= \"" + fun.ControllerAs + ".page.size \" max-size= \"10 \" first-text= \"第一页 \" previous-text= \"上一页 \"\n";
        sbHtml += "                     ng-change= \"" + fun.ControllerAs + ".PageChange() \" next-text= \"下一页 \" last-text= \"最后页 \" boundary-links= \"true \" boundary-link-numbers= \"true \"></div>\n";
        sbHtml += "            </div>\n";
        sbHtml += "        </div>\n";
        sbHtml += "    </uib-tab>\n";
        sbHtml += "</uib-tabset>\n";

        return sbHtml;
    }

    function genJsForReport(fun) {
        var sbJs = "";

        sbJs += "'use strict';\n";
        sbJs += "\n";
        sbJs += "angular.module('AppSet')\n";
        sbJs += ".controller('" + fun.Controller + "', ['$scope', '$http', 'AjaxService', 'toastr', '$window',\n";
        sbJs += "function ($scope, $http, AjaxService, toastr, $window) {\n";
        sbJs += "\n";
        sbJs += "    var vm = this;\n";
        sbJs += "    vm.page = { index: 1, size: 12 };\n";
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
        sbJs += "    vm.ExportExcel = ExportExcel;\n";
        sbJs += "\n";
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
            sbJs += "    function ExportExcel() {\n";
            sbJs += "        vm.promise = AjaxService.GetPlanOwnExcel(\"" + fun.EntityName + "\", GetContition()).then(function (data) {\n";
            sbJs += "            $window.location.href = data.File;\n";
            sbJs += "        });\n";
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
            sbJs += "    function ExportExcel() {\n";
            sbJs += "        vm.promise = AjaxService.GetPlanExcel(\"" + fun.EntityName + "\", \"" + fun.ShortName + "\", vm.Ser).then(function (data) {\n";
            sbJs += "            $window.location.href = data.File;\n";
            sbJs += "        });\n";
            sbJs += "    }\n";
        }


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

    //基本功能类HTML代码生成
    function genHtmlForBasicFun(fun) {
        var sbHtml = "";
        sbHtml += "<uib-tabset active=\"active\" type=\"tabs\" class=\"h-100\" cg-busy=\"" + fun.ControllerAs + ".promise\">\n";
        sbHtml += "    <uib-tab index=\"0\">\n";
        sbHtml += "        <uib-tab-heading class=\"h5\">" + fun.FunName + "</uib-tab-heading>\n";
        sbHtml += "        <div class=\"wrapper-md\">\n";
        sbHtml += "            <div class=\"form-inline\">\n";
        sbHtml += "                <button class= \"btn btn-sm btn-success \" ng-click= \"" + fun.ControllerAs + ".Insert() \"><i class= \"glyphicon glyphicon-plus \"></i>新增</button>\n";
        //生成查询条件
        sbHtml = genHtmlSer(fun, sbHtml);
        sbHtml += "                <button class= \"btn btn-sm btn-info \" ng-click= \"" + fun.ControllerAs + ".Search() \"><i class= \"glyphicon glyphicon-search \"></i>查询</button>\n";
        sbHtml += "                <button class= \"btn btn-sm btn-success \" ng-click= \"" + fun.ControllerAs + ".ExportExcel() \"><i class= \"glyphicon glyphicon-export \"></i> 导出</button>\n";
        sbHtml += "            </div>\n";
        sbHtml += "        </div>\n";


        sbHtml += "        <div class= \"padder-md \">\n";
        //是否有下拉选择框
        var have = 0;
        fun.ColList.forEach(function (p) {
            if (p.ColType == "Select") {
                have += 1;
            }
        });
        sbHtml += "            <div class=\"col-md-12 scroll-x no-padder\" " + (have > 0 ? "style=\"min-height:300px\" >\n" : ">\n");
        sbHtml += "                <table class= \"table pad-xs\" >\n";
        sbHtml += "                    <thead>\n";
        sbHtml += "                        <tr>\n";
        sbHtml += "                            <td style= \"width:60px\">操作</td>\n";
        fun.ColList.forEach(function (row) {
            if (row.ABleNull != "4") {
                sbHtml += "                            <td style= \"width:" + (row.Width ? "100px" : row.Width) + " \">" + row.ColumnText + "</td>\n";
            }
        })
        sbHtml += "                        </tr>\n";
        sbHtml += "                    </thead>\n";

        //新增处理
        sbHtml += "                    <tr ng-if=\"" + fun.ControllerAs + ".IsInsert\" ng-form=\"" + fun.ControllerAs + ".InsertForm\">\n";
        sbHtml += "                        <td>\n";
        sbHtml += "                            <button class=\"btn btn-xs btn-success\" ng-disabled=\"" + fun.ControllerAs + ".InsertForm.$invalid\" ng-click=\"" + fun.ControllerAs + ".SaveInsert()\"><i class=\"glyphicon glyphicon-save\"></i></button>\n";
        sbHtml += "                            <button class=\"btn btn-xs btn-warning\" ng-click=\"" + fun.ControllerAs + ".IsInsert=false\" ><i class=\"fa fa-undo\"></i></button>\n";
        sbHtml += "                        </td>\n";
        fun.ColList.forEach(function (row) {
            if (row.ABleNull != "4") {
                sbHtml = getHtmlInsert(fun, sbHtml, row);
            }
        })
        sbHtml += "                    </tr>\n";

        //列表处理
        sbHtml += "                    <tr ng-repeat= \"item in " + fun.ControllerAs + ".List \" ng-form=\"item.ItemForm\">\n";
        sbHtml += "                        <td>\n";
        sbHtml += "                            <span ng-if=\"!item.IsEdit\">\n";
        sbHtml += "                                <button class=\"btn btn-xs btn-primary\" ng-click=\"" + fun.ControllerAs + ".Edit(item)\"><i class=\"glyphicon glyphicon-edit\"></i></button>\n";
        sbHtml += "                                <button class=\"btn btn-xs btn-danger\" ng-confirm=\"{text:'确定要删除吗'}\" ng-click=\"" + fun.ControllerAs + ".Delete(item)\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n";
        sbHtml += "                            </span>\n";
        sbHtml += "                            <span ng-if=\"item.IsEdit\">\n";
        sbHtml += "                                <button class=\"btn btn-xs btn-success\" ng-disabled=\"item.ItemForm.$invalid\" ng-click=\"" + fun.ControllerAs + ".SaveEdit($index)\"><i class=\"glyphicon glyphicon-save\"></i></button>\n";
        sbHtml += "                                <button class=\"btn btn-xs btn-warning\" ng-click=\"item.IsEdit=false\"><i class=\"fa fa-undo\"></i></button>\n";
        sbHtml += "                            </span>\n";
        sbHtml += "                        </td>\n";
        fun.ColList.forEach(function (row) {
            switch (row.ABleNull) {
                //非编辑
                case "0":
                    //只读
                case "1":
                    sbHtml += "                        <td title=\"{{ item." + row.EditColDiv + subColName(row.ColumnName) + " }}\">{{ item." + row.EditColDiv + subColName(row.ColumnName) + " }}</td>\n";
                    break;
                    //非空
                case "2":
                    //可空
                case "3":
                    sbHtml += "                        <td>\n";
                    sbHtml = genHtmlEdit(row, fun, sbHtml);
                    sbHtml += "                        </td>\n";
                    break;
                    //隐藏
                case "4": break;
            }
        });
        sbHtml += "                    </tr>\n";
        sbHtml += "                </table>\n";
        sbHtml += "            </div>\n";
        sbHtml += "            <div class= \"col-md-12 text-center \" ng-if= \"" + fun.ControllerAs + ".page.total>" + fun.ControllerAs + ".page.size \">\n";
        sbHtml += "                <div uib-pagination total-items= \"" + fun.ControllerAs + ".page.total \" ng-model= \"" + fun.ControllerAs + ".page.index \" items-per-page= \"" + fun.ControllerAs + ".page.size \" max-size= \"10 \" first-text= \"第一页 \" previous-text= \"上一页 \"\n";
        sbHtml += "                     ng-change= \"" + fun.ControllerAs + ".PageChange() \" next-text= \"下一页 \" last-text= \"最后页 \" boundary-links= \"true \" boundary-link-numbers= \"true \"></div>\n";
        sbHtml += "            </div>\n";
        sbHtml += "        </div>\n";
        sbHtml += "    </uib-tab>\n";
        sbHtml += "</uib-tabset>\n";

        return sbHtml;
    }

    function getHtmlInsert(fun, sbHtml, row) {
        //不是非编辑
        if (row.ABleNull != "0") {
            var colName = subColName(row.EditCol);

            var strCheckExcist = row.CheckExists ? " ng-blur=\"" + fun.ControllerAs + ".IsAdd" + colName + "Exists()\" " : "";
            sbHtml += "                        <td>\n";
            sbHtml += "                            <div " + (row.ABleNull != "3" ? "ng-class=\"{ 'has-error': " + fun.ControllerAs + ".InsertForm." + colName + ".$invalid }\">\n" : ">\n");
            var str = "                                ";
            switch (row.ColType) {
                case "Text": str += "<input type=\"text\" name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" {3} {4}/>"; break;
                case "Num": str += "<input type=\"number\" name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" {3} />"; break;
                case "Email": str += "<input type=\"email\" name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" {3} />"; break;
                case "Date": str += "<input type=\"text\" date-picker  name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" option=\"{2}.DateOption\"  {3} />"; break;
                case "DateTime": str += "<input type=\"text\" date-time-picker  name=\"{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" option=\"{2}.DateOption\"  {3} />"; break;
                case "Select": str += "<div basic-select=\"" + row.ColValue + "\" ng-name=\"{0}\" placeholder=\"{1}\" ng-model=\"{2}.NewItem.{0}\" " + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
                case "Config": str += "<div config-select ng-model=\"{2}.NewItem.{0}\" ng-name=\"{0}\" placeholder=\"{1}\" tb=\"" + row.ColValue.split(',')[0] + "\" col=\"" + row.ColValue.split(',')[1] + "\"" + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
                case "Switch":
                    str += "<div toggle-switch ng-model=\"{2}.NewItem.{0}\" class=\"w-xxs switch-success\" on-label=\"是\" off-label=\"否\" on-value = \"1\" off-value =\"0\"></div>";
                    break;
                case "CheckBox":
                    str += "<label class=\"i-checks i-checks\"><input type =\"checkbox\" ng-model = \"{2}.NewItem.{0}\"><i></i>{2}</label>";
                    break;
            }
            sbHtml += str.Format(colName, row.ColumnText, fun.ControllerAs, (row.ABleNull == "3" ? "" : "required"), strCheckExcist) + "\n";
            if (row.CheckExists) {
                str = "                                ";
                sbHtml += str + "<div ng-messages=\"" + fun.ControllerAs + ".InsertForm." + colName + ".$error\" class=\"help-block\" role=\"alert\">\n";
                sbHtml += str + "    <div ng-message=\"unique\">" + row.ColumnText + "重复</div>\n";
                sbHtml += str + "</div>\n";
            }
            sbHtml += "                            </div>\n";
            sbHtml += "                        </td>\n";
        }
        else {
            sbHtml += "                        <td></td>\n";
        }
        return sbHtml;
    }

    function genHtmlEdit(row, fun, sbHtml) {
        var str = "", str2 = "";
        var strEmpty = "                            ";
        console.log(subColName(row.EditCol))
        var ColName = subColName(row.EditCol);
        var strCheckExcist = row.CheckExists ? (" ng-blur=\"{0}.IsEdit{1}Exists()\" ").Format(fun.ControllerAs, ColName) : "";
        var boolEnable = false;
        switch (row.ColType) {
            case "Text": str = "<input type=\"text\" name=\"item_{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" {3} {4}/>"; break;
            case "Num": str = "<input type=\"number\" name=\"item_{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" {3} />"; break;
            case "Email": str = "<input type=\"email\" name=\"item_{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" {3} />"; break;
            case "Date": str = "<input type=\"text\" date-picker  name=\"item_{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" option=\"{2}.DateOption\"  {3} />"; break;
            case "DateTime": str = "<input type=\"text\" date-time-picker  name=\"item_{0}\" class=\"form-control\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" option=\"{2}.DateOption\"  {3} />"; break;
            case "Select": str = "<div basic-select=\"" + row.ColValue + "\" ng-name=\"item_{0}\" placeholder=\"{1}\" ng-model=\"{2}.EditItem.{0}\" " + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
            case "Config": str = "<div config-select ng-model=\"{2}.EditItem.{0}\" ng-name=\"item_{0}\" placeholder=\"{1}\" config-option=\"{2}.{0}Config\"" + (row.ABleNull != "3" ? " ng-required =\"true\"" : "") + "></div>"; break;
            case "Switch":
                str = "<div toggle-switch ng-model=\"{2}.EditItem.{0}\" class=\"w-xxs switch-success\" on-label=\"是\" off-label=\"否\" on-value = \"1\" off-value =\"0\" is-disabled=\"!item.IsEdit\"></div>";
                str2 = "<div toggle-switch ng-model=\"item." + row.EditColDiv + ColName + "\" class=\"w-xxs switch-success\" on-label=\"是\" off-label=\"否\" on-value = \"1\" off-value =\"0\" is-disabled=\"true\"></div>";
                boolEnable = true;
                break;
            case "CheckBox":
                str = "<label class=\"i-checks i-checks\"><input type =\"checkbox\" ng-model = \"{2}.EditItem.{0}\" ng-disabled=\"!item.IsEdit\"><i></i>{2}</label>";
                str2 = "<label class=\"i-checks i-checks\"><input type =\"checkbox\" ng-model = \"item." + row.EditColDiv + ColName + "\" disabled><i></i>{2}</label>";
                boolEnable = true;
                break;
        }
        //查看时
        sbHtml = genHtmlEditCol(sbHtml, str.Format(ColName, row.ColumnText, fun.ControllerAs, (row.ABleNull != "3" ? "required" : ""), strCheckExcist), str2, boolEnable, row, strEmpty) + "\n";
        return sbHtml
    }

    function genHtmlEditCol(sbHtml, str, str2, boolEnable, row, strEmpty) {
        if (!boolEnable) {
            sbHtml += strEmpty + "<span ng-if=\"!item.IsEdit\">{{ item." + row.EditColDiv + subColName(row.ColumnName) + " }}</span>\n";
        }
        else {
            sbHtml += strEmpty + "<div ng-if=\"!item.IsEdit\">\n";
            sbHtml += strEmpty + "     " + str2 + "\n";
            sbHtml += strEmpty + "</div>\n";
        }
        sbHtml += strEmpty + "<div ng-if=\"item.IsEdit\"  ng-class=\"{ 'has-error' : item.ItemForm.item_" + subColName(row.ColumnName) + ".$invalid }\">\n";
        sbHtml += strEmpty + "     " + str + "\n";
        //是否验证重复
        if (row.CheckExists) {
            sbHtml += strEmpty + "     <div ng-messages=\"item.ItemForm.item_" + subColName(row.ColumnName) + ".$error\" class=\"help-block\" role=\"alert\">\n";
            sbHtml += strEmpty + "          <div ng-message=\"unique\">" + row.ColumnText + "重复</div>\n";
            sbHtml += strEmpty + "     </div>\n";
        }

        sbHtml += strEmpty + "</div>\n";
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
                sbHtml += "                <div class=\"form-group\">\n";
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
                sbHtml += "                    " + str.Format(fun.ControllerAs, name, ser.SerName, ser.SerTName, ser.ColumnName) + "\n";
                sbHtml += "                </div>\n";
                listHave.push(ser.ColumnName);
            }
        });
        return sbHtml;
    }


    function genJsForBasicFun(fun) {
        var sbJS = "";
        fun.SerList = fun.SerList || [];
        sbJS += "'use strict';\n";
        sbJS += "\n";
        sbJS += "angular.module('AppSet')\n";
        sbJS += ".controller('" + fun.Controller + "', ['$scope', '$http', 'AjaxService', 'toastr', '$window',\n";
        sbJS += "function ($scope, $http, AjaxService, toastr, $window) {\n";
        sbJS += "\n";
        sbJS += "    var vm = this;\n";
        sbJS += "    vm.page = { index: 1, size: 12 };\n";
        sbJS += "    vm.Ser = {};\n";
        //隐藏条件 -- 默认值
        for (var i = 0, len = fun.SerList.length; i < len; i++) {
            var ser = fun.SerList[i];
            if (ser.IsHide || !ser.SerValue) {
                var s = ser.SerType == "Num" ? ser.SerValue + ";" : "'" + ser.SerValue + "';";
                sbJS += "    vm.Ser." + ser.ColumnName + " = " + s + "\n";
            }
        }

        sbJS += "\n";
        sbJS += "    vm.Insert = Insert;\n";
        sbJS += "    vm.SaveInsert = SaveInsert;\n";
        sbJS += "    vm.Edit = Edit;\n";
        sbJS += "    vm.Delete = Delete;\n";
        sbJS += "    vm.SaveEdit = SaveEdit;\n";
        sbJS += "    vm.PageChange = PageChange;\n";
        sbJS += "    vm.Search = Search;\n";
        sbJS += "    vm.ExportExcel = ExportExcel;\n";
        for (var j = 0, len1 = fun.ColList.length; j < len1; j++) {
            var col = fun.ColList[j];
            if (col.CheckExists) {
                var colName = subColName(col.ColumnName);
                sbJS += "    vm.IsAdd" + colName + "Exists = IsAdd" + colName + "Exists;\n";
                if (col.ABleNull == "2" || col.ABleNull == "3") {
                    sbJS += "    vm.IsEdit" + colName + "Exists=IsEdit" + colName + "Exists;\n";
                }
            }
        }
        sbJS += "\n";
        sbJS += "    function Search() {\n";
        sbJS += "        vm.page.index = 1;\n";
        sbJS += "        PageChange();\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function Insert() {\n";
        sbJS += "        vm.NewItem = {};\n";
        sbJS += "        vm.IsInsert = true;\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function SaveInsert() {\n";
        sbJS += "        vm.promise = AjaxService.PlanInsert(\"" + fun.EntityName + "\", vm.NewItem).then(function (data) {\n";
        sbJS += "            PageChange();\n";
        sbJS += "            toastr.success('新增成功');\n";
        sbJS += "            vm.IsInsert = false;\n";
        sbJS += "        });\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function Edit(item) {\n";
        sbJS += "        for (var i = 0, len = vm.List.length; i < len; i++) {\n";
        sbJS += "            vm.List[i].IsEdit = false;\n";
        sbJS += "        }\n";
        sbJS += "        vm.EditItem = angular.copy(item);\n";
        sbJS += "        vm.NowItem = item;\n";
        sbJS += "        item.IsEdit = true;\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function Delete(item) {\n";
        sbJS += "        var en = angular.copy(item);\n";
        sbJS += "        en.ItemForm = undefined;\n";
        sbJS += "        vm.promise = AjaxService.PlanDelete(\"" + fun.EntityName + "\", en).then(function (data) {\n";
        sbJS += "            PageChange();\n";
        sbJS += "            toastr.success('删除成功');\n";
        sbJS += "        });\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function SaveEdit(index) {\n";
        sbJS += "        var en = {};\n";
        for (var h = 0, len2 = fun.ColList.length; h < len2; h++) {
            var row = fun.ColList[h];
            if (row.ABleNull != "0") {
                sbJS += "        en." + subColName(row.EditCol) + " = vm.EditItem." + subColName(row.EditCol) + ";\n";
            }
        }
        sbJS += "        vm.promise = AjaxService.PlanUpdate(\"" + fun.EntityName + "\", en).then(function (data) {\n";
        sbJS += "            PageChange();\n";
        sbJS += "            toastr.success('更新成功');\n";
        sbJS += "        });\n";
        sbJS += "    }\n";
        sbJS += "\n";
        sbJS += "    function PageChange() {\n";

        sbJS += "        vm.promise = AjaxService.GetPlansPage(\"" + fun.EntityName + "\", GetContition(), vm.page.index, vm.page.size).then(function (data) {\n";
        sbJS += "            vm.List = data.List;\n";
        sbJS += "            vm.page.total = data.Count;\n";
        sbJS += "        });\n";
        sbJS += "\n";
        sbJS += "    }\n";
        sbJS += "    function ExportExcel() {\n";
        sbJS += "        vm.promise = AjaxService.GetPlanOwnExcel(\"" + fun.EntityName + "\", GetContition()).then(function (data) {\n";
        sbJS += "            $window.location.href = data.File;\n";
        sbJS += "        });\n";
        sbJS += "    }\n";

        for (var k = 0, len3 = fun.ColList.length; k < len3; k++) {
            var col = fun.ColList[k];
            if (col.CheckExists) {
                var colName = subColName(col.EditCol);
                sbJS += "    function IsAdd" + colName + "Exists() {\n";
                sbJS += "        var list = [];\n";
                sbJS += "        list.push({ name: \"" + colName + "\", value: vm.NewItem." + colName + " });\n";
                sbJS += "        AjaxService.GetPlan(\"" + fun.EntityName + "\", list).then(function (data) {\n";
                sbJS += "            vm.InsertForm." + colName + ".$setValidity('unique', !data." + colName + ");\n";
                sbJS += "        });\n";
                sbJS += "    }\n";

                if (col.ABleNull == "2" || col.ABleNull == "3") {
                    sbJS += "    function IsEdit" + colName + "Exists() {\n";
                    sbJS += "        if(vm.NowItem." + colName + " != vm.EditItem." + colName + "){\n";
                    sbJS += "            var list = [];\n";
                    sbJS += "            list.push({ name: \"" + colName + "\", value: vm.EditItem." + colName + " });\n";
                    sbJS += "            vm.promise = AjaxService.GetPlan(\"" + fun.EntityName + "\", list).then(function (data) {\n";
                    sbJS += "                vm.NowItem.ItemForm.item_" + colName + ".$setValidity('unique', !data." + colName + ");\n";
                    sbJS += "            });\n";
                    sbJS += "        }\n";
                    sbJS += "    }\n";
                }
            }
        }


        sbJS += "    function GetContition() {\n";
        sbJS = getEnJsSer(fun, sbJS);
        sbJS += "        return list;\n";
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