'use strict';

angular.module('app')
.controller('CreateEntityCtrl', ['$scope', '$window', 'Dialog', 'AjaxService', 'toastr', '$rootScope', 'FileLoad', 'serviceUrl',
function ($scope, $window, Dialog, AjaxService, toastr, $rootScope, FileLoad, serviceUrl) {

    var vm = this;
    vm.EnAdd = EnAdd;
    vm.Edit = Edit;
    //保存实体
    vm.SaveEntity = SaveEntity;
    vm.SelectEn = SelectEn;
    vm.Cancel = Cancel;
    vm.DeleteEn = DeleteEn;
    vm.AddPro = AddPro;
    vm.DeletePro = DeletePro;

    vm.TbChecked = TbChecked;
    vm.CheckChange = CheckChange;
    vm.setClass = setClass;

    vm.SaveProClass = SaveProClass;
    vm.SaveProBasic = SaveProBasic;
    vm.EditProClass = EditProClass;
    vm.AddProRelCon = AddProRelCon;
    vm.DeleteProCon = DeleteProCon;
    vm.CancelProCon = CancelProCon;

    vm.AddProc = AddProc;
    vm.DeleteProc = DeleteProc;

    vm.isExists = isExists;
    vm.isProExists = isProExists;
    vm.isProcExists = isProcExists;

    vm.conChange = conChange;
    vm.ImportPlan = ImportPlan;
    vm.DownLoadPlan = DownLoadPlan;
    vm.planBak = planBak;
    vm.OpenProc = OpenProc;
    vm.OpenEntityExcel = OpenEntityExcel;
    
    vm.ConfigOrderWay = { Table: "EntityProperty", Column: "OrderWay" };
    vm.ConfigColumnType = { Table: "EntityProperty", Column: "ColumnType" };
    vm.ConfigRelationType = { Table: "EntityProperty", Column: "RelationType" };
    vm.EntityRelationType = { Table: "EntityRelation", Column: "ColumnType" };
    vm.EntityRelationExp = { Table: "EntityRelation", Column: "Expression" };
    vm.EntityRelationAss = { Table: "EntityRelation", Column: "Associate" };
    vm.ActionType = { Table: "BasicData", Column: "ActionType" };
    vm.UserEmp = { Table: "BasicData", Column: "UserEmp" };
    vm.ProItem = { };
    vm.newRelCon = { ParenType: '0', ChildType: '0', Associate: "" };

    $scope.$watch(function () { return vm.EnTable; }, getTableList);
    $scope.$watch(function () { return vm.ProItem.RelateEntity; }, getChildTableList);
    $scope.$watch(function () { return vm.ConnectName; }, GetList);

    GetRoleList();
    Cancel();

    function conChange() {
        vm.EnTable = undefined;
        vm.ProcList = [];
    }

    function SelectEn(item) {
        vm.SelectedEn = angular.copy(item);
        vm.SelectedEn.ActionType = "U";
        vm.EnTable = { Name: vm.SelectedEn.TableName, DbSchema: vm.SelectedEn.TableSchema };
        getEntityProList();
        vm.isEditing = false;
    }

    //保存实体
    function SaveEntity() {
        var en = angular.copy(vm.SelectedEn), haveRel = false, haveProc = false;
        en.ConnectName = vm.ConnectName;
        en.CreateBy = $rootScope.User.UserNo;
        var ProList = [], RelList = [], ProcList = [];
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            var pro = {};
            pro.ColumnName = vm.PropertyList[i].ColumnName;
            pro.ColumnType = vm.PropertyList[i].ColumnType;
            pro.RelationType = vm.PropertyList[i].RelationType || '';
            pro.IsKey = vm.PropertyList[i].IsKey == '1' ? 1 : 0;
            pro.OrderWay = vm.PropertyList[i].OrderWay;
            pro.OrderNum = vm.PropertyList[i].OrderNum;
            pro.BasicName = vm.PropertyList[i].BasicName || '';
            pro.BasicNamePro = vm.PropertyList[i].BasicNamePro || '';
            ProList.push(pro);
            if (pro.ColumnType == '1' || pro.ColumnType == '2') {
                var relList = vm.PropertyList[i].RelateList;
                for (var j = 0, len2 = relList.length; j < len2; j++) {
                    var enRel = {};
                    haveRel = true;
                    enRel.ColumnName = pro.ColumnName;
                    enRel.EntityName = relList[j].EntityName;
                    enRel.ParentKey = relList[j].ParentKey;
                    enRel.ChildKey = relList[j].ChildKey;
                    enRel.ChildType = relList[j].ChildType;
                    enRel.ParenType = relList[j].ParenType;
                    enRel.Expression = relList[j].Expression;
                    enRel.Associate = relList[j].Associate;
                    RelList.push(enRel);
                }
            }
        }
        if (vm.ProcList) {
            for (var h = 0, len3 = vm.ProcList.length; h < len3; h++) {
                var proc = {};
                haveProc = true;
                proc.ShortName = vm.ProcList[h].ShortName;
                proc.ProcSchema = vm.ProcList[h].EnProcedure.DbSchema;
                proc.ProcName = vm.ProcList[h].EnProcedure.Name;
                proc.ActionType = vm.ProcList[h].ActionType;
                proc.RoleSn = vm.ProcList[h].RoleSn;
                ProcList.push(proc);
            }
        }
        en.ProList = JSON.stringify(ProList);
        en.RelList = JSON.stringify(RelList);
        en.ProcList = JSON.stringify(ProcList);

        var a = 'ProList' + (haveRel ? '' : ',RelList');
        a = a + (haveProc ? '' : ',ProcList');
        en.TempColumns = "ProList,RelList,ProcList";
        vm.promise = AjaxService.SavePlan(en.EntityName, en).then(function (data) {
            toastr.success('储存成功');
            GetList();
            Cancel();
        });
        
    }

    //初始化数据
    function Cancel() {
        vm.SelectedEn = {};
        vm.SelectedEn.Level = 3;
        vm.isAddOpen = false;
        vm.TbColunms = undefined;
        vm.PropertyList = [];
        vm.isEditing = false;
        vm.isAdd = false;
        vm.isProAdd = false;
    }

    //删除
    function DeleteEn(item) {
        var en = {};
        en.EntityName = item.EntityName;
        AjaxService.DeletePlan(item.EntityName, en).then(function (data) {
            toastr.success('删除成功');
            GetList();
            Cancel();
        });
    }


    function EnAdd() {
        Cancel();
        vm.SelectedEn.ActionType = "I";
        vm.SelectedEn.AutoDelLog = false;
        vm.isAddOpen = true;
        vm.isEditing = true;
        vm.isAdd = true;
    }

    function Edit() {
        vm.isAddOpen = true;
        vm.isEditing = true;
        vm.isAdd = false;
    }

    function GetList() {
        var en = { name: "ConnectName", value: vm.ConnectName };
        vm.promise = AjaxService.GetPlans("PlanEntity", en).then(function (data) {
            vm.List = data;
        });
    }
    function getTableList() {
        if (vm.isEditing) {
            vm.PropertyList = [];
            isProEmpty();
        }
        if (vm.EnTable) {
            vm.SelectedEn.TableSchema = vm.EnTable.DbSchema;
            vm.SelectedEn.TableName = vm.EnTable.Name;

            var en = {};
            en.Schema = vm.EnTable.DbSchema;
            en.TableName = vm.EnTable.Name;
            en.ConnectName = vm.ConnectName;

            AjaxService.BasicCustom("GetTbColumns", en).then(function (data) {
                vm.TbColunms = data.data;
                if (vm.newRelCon) {
                    vm.newRelCon.ParentKey = undefined;
                }
            });
        }
    }

    function getChildTableList() {
        vm.ProItem.RelateList = [];
        vm.TbChildColunms = [];
        if (vm.ProItem.RelateEntity) {

            var en = {};
            en.planName = vm.ProItem.RelateEntity;
            AjaxService.BasicCustom("GetTbViewColumns", en).then(function (data) {
                vm.TbChildColunms = data.data;
                if (vm.newRelCon) {
                    vm.newRelCon.ChildKey = undefined;
                }
            });
        }
        if (vm.RelateList && vm.RelateList.length > 0) {
            vm.ProItem.RelateList = vm.RelateList;
        }
        vm.RelateList = [];
    }

    function AddPro() {
        var en = {};
        vm.ProItem = en;
        vm.isProAdd = !vm.isProAdd;
    }

    function AddProRelCon() {
        vm.ProItem.RelateList = vm.ProItem.RelateList || [];
        var pro = angular.copy(vm.newRelCon);
        pro.EntityName = vm.ProItem.RelateEntity;
        vm.ProItem.RelateList.push(pro);
        vm.ClassForm.Pro.$setValidity('neetList', true);
        vm.newRelCon.ParentKey = undefined;
        vm.newRelCon.ChildKey = undefined
    }

    function DeleteProCon(index) {
        vm.ProItem.RelateList.splice(index, 1);
        if (vm.ProItem.RelateList.length == 0) {
            vm.newRelCon.Associate = "";
        }
        else if (vm.ProItem.RelateList.length == 1) {
            vm.ProItem.RelateList[0].Associate = "";
        }
        vm.ClassForm.Pro.$setValidity('neetList', vm.ProItem.RelateList.length > 0);
    }


    function getEntityProList() {
        if (vm.SelectedEn.EntityName) {
            var en = {};
            en.name = "EntityName";
            en.value = vm.SelectedEn.EntityName;
            vm.promise = AjaxService.GetPlans("PlanProperty", en).then(function (data) {
                vm.PropertyList = data;
                isProEmpty();
            });

            AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
                vm.ProcList = data;
                for (var i = 0, len = vm.ProcList.length; i < len; i++) {
                    vm.ProcList[i].EnProcedure = { "DbSchema": vm.ProcList[i].ProcSchema, "Name": vm.ProcList[i].ProcName };
                }
            });
        }
    }
    function TbChecked(item) {
        var check = false;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                check = true; break;
            }
        }
        return item.isCheck = check;
    }
    function CheckChange(item) {
        var check = false, index=-1;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                check = true; index = i; break;
            }
        }
        if (item.isCheck) {
            var check = false;
            for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
                if (item.ColumnName == vm.PropertyList[i].ColumnName) {
                    check = true; break;
                }
            }
            if (!check) {
                var en = {};
                en.EntityName = vm.SelectedEn.EntityName;
                en.ColumnName = item.ColumnName;
                en.ColumnType = "0";
                en.RelationType = "";
                en.OrderWay = "NON";
                en.OrderNum = 0;
                en.IsKey = item.IsKey ? 1 : 0;
                vm.PropertyList.push(en);
            }
        } else {
            vm.PropertyList.splice(index, 1)
        }
        isProEmpty();
    }

    //添加类 列表
    function SaveProClass() {
        if (vm.IsProEdit) {}
        else {
            var en = {};
            en.ColumnName = vm.ProItem.ColumnName;
            en.EntityName = vm.SelectedEn.EntityName;
            en.ColumnType = vm.ProItem.ColumnType;
            en.RelationType = vm.ProItem.RelationType;
            en.OrderWay = "NON";
            en.OrderNum = 0;
            en.IsKey = 0;
            en.RelateList = vm.ProItem.RelateList;
            vm.PropertyList.push(en);
        }
        vm.IsProEdit = false;
        vm.isProAdd = !vm.isProAdd
    }

    //添加公共件
    function SaveProBasic() {
        if (vm.IsProEdit) { }
        else {
            var en = {};
            en.ColumnName = vm.ProItem.ColumnName;
            en.EntityName = vm.SelectedEn.EntityName;
            en.ColumnType = vm.ProItem.ColumnType;
            en.RelationType = vm.ProItem.RelationType;
            en.OrderWay = "NON";
            en.OrderNum = 0;
            en.IsKey = 0;
            en.BasicName = vm.ProItem.BasicName;
            en.BasicNamePro = vm.ProItem.BasicNamePro;
            vm.PropertyList.push(en);
        }
        vm.IsProEdit = false;
        vm.isProAdd = !vm.isProAdd
    }

    function EditProClass(pro) {
        vm.ProItem = pro;
        vm.ProItem.RelateEntity = pro.RelateList && pro.RelateList[0] ? pro.RelateList[0].EntityName : '';
        vm.RelateList = pro.RelateList ? angular.copy(pro.RelateList) : [];
        vm.isProAdd = true;
        vm.IsProEdit = true;
    }

    //删除属性
    function DeletePro(pro) {
        var index = -1;
        for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
            if (pro.ColumnName == vm.PropertyList[i].ColumnName) {
                index = i; break;
            }
        }
        vm.PropertyList.splice(index, 1);
        isProEmpty();
    }

    function CancelProCon() {
        vm.isProAdd = !vm.isProAdd;
        vm.IsProEdit = false;
    }

    //验证实体是否存在
    function isExists(name) {
        if (name) {
            var en = { name: "EntityName", value: name };
            AjaxService.GetPlan('PlanEntity', en).then(function (data) {
                var v = !data.EntityName;
                vm.EntityForm.entityName.$setValidity('unique', v);
                if (!v) {
                    toastr.warning('实体名称已被使用了！');
                } else {
                    isProEmpty();
                }
            });
        }
    }

    function AddProc() {
        vm.NewProc.ProcSchema = vm.NewProc.EnProcedure.DbSchema;
        vm.NewProc.ProcName = vm.NewProc.EnProcedure.Name;
        vm.ProcList.push(vm.NewProc);
        vm.NewProc = {};
    }

    function DeleteProc(index) {
        vm.ProcList.splice(index, 1);
    }

    function isProcExists(name) {
        if (name) {
            var have = false;
            vm.ProcList = vm.ProcList || [];
            for (var i = 0, len = vm.ProcList.length; i < len; i++) {
                if (name == vm.ProcList[i].ShortName) {
                    have = true;
                    break;
                }
            }
           vm.ProcedureForm.ShortName.$setValidity('unique', !have);
        }
    }

    function isProExists(name) {
        if (name) {
            var have = false;
            for (var i = 0, len = vm.PropertyList.length; i < len; i++) {
                if (name == vm.PropertyList[i].ColumnName) {
                    have = true;
                    break;
                }
            }
            vm.ClassForm.Pro.$setValidity('unique', !have);
            if (!have) {
                var en = [{ name: "EntityName", value: vm.SelectedEn.EntityName },
                    { name: "ColumnName", value: name }];
                AjaxService.GetPlan('PlanProperty', en).then(function (data) {
                    var v = !data.ColumnName;
                    vm.ClassForm.Pro.$setValidity('unique', v);
                    vm.ClassForm.Pro.$setValidity('neetList', vm.ProItem.ColumnType == '3' || (vm.ProItem.RelateList && vm.ProItem.RelateList.length > 0));
                });
            }
        }
    }

    function GetRoleList() {
        AjaxService.GetPlans('Role').then(function (data) {
            vm.ListRole = data;
            vm.ListRole.splice(0, 0, { RoleSn: "ALL", RoleName: "全部" });
        });
    }

    function isProEmpty() {
        if (vm.PropertyList) {
            var v = vm.PropertyList.length > 0;
            vm.EntityForm.entityName.$setValidity('neetPro', v);
            if (!v && vm.SelectedEn.EntityName) {
                toastr.warning('实体属性还没有，需要重新添加哦！');
            }
        }
    }

    function setClass(type)
    {
        var c = "";
        switch (type) {
            case '0': c = "panel-default"; break;
            case '1': c = "panel-primary"; break;
            case '2': c = "panel-danger"; break;
            case '3': c = "panel-info"; break;
        }
        return c;
    }

    function planBak() {
        AjaxService.PlanBak("B").then(function (data2) {
            toastr.success('备份成功');
        })
    }

    function DownLoadPlan() {
        $window.open(serviceUrl + 'Data/PlanData.json');
    }

    function ImportPlan(e) {
        $("#importPlan").click();
        $("#importPlan").on('change', function (changeEvent) {
            if (!changeEvent.target.files || changeEvent.target.files.length == 0) {
                return;
            }
            var file = changeEvent.target.files[0];
            var exec = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name.toLowerCase()) : '';
            if (exec[0] != 'json') {
                toastr.error("文件格式不对，请选择 Json 文件!");
                return;
            }
            var option = {};
            option.file = file;
            option.type = 'text';
            option.encode = 'gb2312';
            option.onComplete = function (data) {
                AjaxService.PlanBak("I", data).then(function (data2) {
                    toastr.success('导入成功');
                    GetList();
                })
            };
            FileLoad.Load(option);
        })
    }

    function OpenEntityExcel(EntityName) {
        var item = {};
        item.EntityName = EntityName;
        item.ShortName = "--";
        item.ProcName = "--";
        item.ProcSchema = "--";
        item.ConnectName = vm.ConnectName;
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("EnProcSetDialog", resolve).then(function (data) {

        }).catch(function (reason) {
        });
    }

    function OpenProc(proc) {
        var item = angular.copy(proc);
        item.ConnectName = vm.ConnectName;
        var resolve = {
            ItemData: function () {
                return item;
            }
        };
        Dialog.open("EnProcSetDialog", resolve).then(function (data) {

        }).catch(function (reason) {
        });
    }
}
]);