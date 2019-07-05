'use strict';

angular.module('app')
.controller('FunctionCtrl', ['$rootScope', '$scope', '$window', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, $window, Dialog, toastr, AjaxService, MyPop) {

    var vm = this;
    //查询所有功能
    vm.SelectAllFun = SelectAllFun;
    //选择跟目录
    vm.SelectRoot = SelectRoot;
    //添加根目录
    vm.AddRoot = AddRoot;
    //编辑根目录
    vm.EditRoot = EditRoot;
    //图标窗口
    vm.OpenIcon = OpenIcon;
    //编辑根目录
    vm.DoneRootEdit = DoneRootEdit;
    vm.DoneRootSysEdit = DoneRootSysEdit;
    //rootDrop
    vm.RootDrop = RootDrop;
    //调整根目录顺序
    vm.RootDrag = RootDrag;
    //保存根目录
    vm.SaveRoot = SaveRoot;
    //删除
    vm.Delete = Delete;
    //功能
    vm.SelectFun = SelectFun;
    vm.AddFun = AddFun;
    vm.SaveFun = SaveFun;
    vm.FunDrop = FunDrop;
    vm.FunDrag = FunDrag;

    //
    vm.OpenFunIcon = OpenFunIcon;
    vm.FunLoadDrop = FunLoadDrop;
    vm.FunLoadDrag = FunLoadDrag;
    vm.FunLoadDelete = FunLoadDelete;
    vm.FunLoadAdd = FunLoadAdd;
    vm.SaveFunInfo = SaveFunInfo;

    vm.FunctionFile = FunctionFile;
    vm.OpenHtmlJs = OpenHtmlJs;

    //选择系统
    vm.ChangeSys = ChangeSys;

    vm.Cancel = Cancel;
    vm.SelectedRoot = { FunNo: '' };
    vm.editFun = false;


    vm.promise = AjaxService.GetPlans("System").then(function (data) {
        vm.SystemList = data;
        vm.SystemItem = data[0];
        ChangeSys();
    })

    function ChangeSys() {
        var en = [{ name: 'FunType', value: 1 }, { name: 'SysNo', value: vm.SystemItem ? vm.SystemItem.SysNo : undefined }];
        AjaxService.GetEntities("FunRoot", en).then(function (data) {
            vm.List = data;
        });
    }

    vm.AllSys = function () {
        vm.SystemItem = undefined;
        ChangeSys();
    }

    //查询所有功能
    function SelectAllFun() {
        if (!showPop(vm.editFun)) {
            vm.SelectedRoot = { FunNo: '' };
            var en = [{ name: 'FunType', value: 2 }];
            console.log(en)
            vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
                vm.FunList = data;
            });
        }
    }

    //选择根目录
    function SelectRoot(root) {
        if (!showPop(vm.editFun)) {
            if (vm.editFun) return;
            vm.SelectedRoot = root;
            vm.FunList = root.FunList || [];
            angular.forEach(vm.List, function (r) {
                r.selected = false;
            });
            root.selected = true;
        }
    }

    //root drop
    function RootDrop(root, index) {
        if (!showPop(vm.editFun)) {
            var en = angular.copy(root);
            vm.List.splice(vm.RootIndex, 1);
            vm.List.splice(index, 0, en);
        }
    }

    //
    function RootDrag(root, index) {
        if (!showPop(vm.editFun)) {
            vm.RootIndex = index;
        }
    }

    //添加根目录
    function AddRoot() {
        if (!showPop(vm.editFun)) {
            var root = {};
            root.FunNo = "-1";
            root.FunName = "新根目录";
            root.OrderBy = vm.List ? vm.List.Length : 0;
            root.FunType = 1;
            root.SysNo = vm.SystemItem.SysNo;
            root.FunImge = 'glyphicon glyphicon-chevron-right';
            root.editing = true;
            angular.forEach(vm.List, function (r) {
                r.selected = false;
            });
            vm.SelectedRoot = root;
            vm.IsEditing = true;
            vm.editRootItem = root;
            vm.List.push(root);
        }
    }

    function EditRoot(root, t) {
        if (!showPop(vm.editFun)) {
            if (vm.IsEditing = true) {
                DoneRootEdit();
            }
            root.selected = true;
            root.editing = true;
            root.editName = t == 'name';
            root.editSys = t == 'sys';
            vm.editRootItem = root;
            vm.IsEditing = true;
        }
    };

    function OpenIcon() {
        if (!showPop(vm.editFun)) {
            var resolve = {
                Data: function () {
                    return vm.editRootItem.FunImge;
                }
            };
            Dialog.open("IconDialog", resolve).then(function (data) {
                vm.editRootItem.FunImge = data;
            }).catch(function (reason) {
            });
        }
    }

    function DoneRootEdit() {
        if (!showPop(vm.editFun)) {
            if (vm.editRootItem) {
                vm.editRootItem.editing = false;
                vm.editRootItem.selected = false;
                vm.IsEditing = false;
            }
        }
    }

    function DoneRootSysEdit() {
        if (!showPop(vm.editFun)) {
            if (vm.editRootItem) {
                vm.editRootItem.editing = false;
                vm.editRootItem.selected = false;
                vm.IsEditing = false;

                var en = {};
                en.FunNo = vm.editRootItem.FunNo;
                en.SysNo = vm.editRootItem.SysNo;
                //保存到数据库
                AjaxService.PlanUpdate('Function', en).then(function (data) {
                    toastr.success('保存成功');
                    ChangeSys();
                })
            }
        }
    }

    function SaveRoot() {
        save(vm.List, "1");
    }

    //root drop
    function FunDrop(f, index) {
        if (!MyPop.Show((vm.SelectedRoot.FunNo == ''), '没有选择目录，不能排序功能！') && !showPop(vm.editFun)) {
            var en = angular.copy(f);
            vm.FunList.splice(vm.FunIndex, 1);
            vm.FunList.splice(index, 0, en);
        }
    }

    //
    function FunDrag(f, index) {
        if (!MyPop.Show((vm.SelectedRoot.FunNo == ''), '没有选择目录，不能排序功能！') && !showPop(vm.editFun)) {
            vm.FunIndex = index;
        }
    }

    function Delete(funNo) {
        if (!showPop(vm.editFun)) {
            var json = {};
            json.FunNo = funNo;
            vm.promise = AjaxService.ExecPlan('FunRoot', "delete", json).then(function (data) {
                toastr.success('删除成功');
                reflashData();
                //更新功能基本信息
                AjaxService.LoginAction("ReInit")
            })
        }
    }

    function SelectFun(fun) {
        if (!showPop(vm.editFun)) {
            angular.forEach(vm.FunList, function (f) {
                f.selected = false;
            });

            fun.selected = true;
            vm.editFun = false;
            var en = {};
            en.name = "FunNo";
            en.value = fun.FunNo;
            AjaxService.GetEntity("Function", en).then(function (data) {
                vm.SelectedFun = data;
            });
        }
    }

    function AddFun()
    {
        if (!showPop(vm.editFun)) {
            angular.forEach(vm.FunList, function (f) {
                f.selected = false;
            });
            vm.editFun = true;
            vm.SelectedFun = {};
            vm.SelectedFun.selected = true;
            vm.SelectedFun.FunNo = '-1';
            vm.SelectedFun.FunName = '新功能';
            vm.SelectedFun.FunImge = 'glyphicon glyphicon-chevron-right';
            vm.SelectedFun.SysNo = vm.SelectedRoot.SysNo;
            vm.SelectedFun.ParFunNo = vm.SelectedRoot.FunNo;
            vm.SelectedFun.IsSystem = false;
            vm.SelectedFun.FunLoad = [];
            vm.FunList.push(vm.SelectedFun);
            FunctionFile();
        }
    }

    function OpenFunIcon() {
        var resolve = {
            Data: function () {
                return vm.SelectedFun.FunImge;
            }
        };
        Dialog.open("IconDialog", resolve).then(function (data) {
            vm.SelectedFun.FunImge = data;
        }).catch(function (reason) {
        });
    }

    function SaveFun()
    {
        save(vm.FunList, "2");
    }

    //FunLoad drop
    function FunLoadDrop(load, index) {
        var en = angular.copy(load);
        vm.SelectedFun.FunLoad.splice(vm.LoadIndex, 1);
        vm.SelectedFun.FunLoad.splice(index, 0, en);
    }

    //
    function FunLoadDrag(load, index) {
        vm.LoadIndex = index;
    }

    function FunLoadDelete(index) {
        vm.SelectedFun.FunLoad.splice(index, 1);
    }

    function FunLoadAdd() {
        if (!vm.editFun) return;
        if (vm.loadFile) {
            var have = false;
            angular.forEach(vm.SelectedFun.FunLoad, function (f) {
                if (f.LoadName == vm.loadFile) {
                    have = true; return;
                }
            });
            if (!have) {
                var en = {};
                en.FunNo = vm.SelectedFun.FunNo;
                en.LoadName = vm.loadFile;
                vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
                vm.SelectedFun.FunLoad.push(en);
            }
        }
    }

    function Cancel() {
        //vm.SelectedFun = undefined;
        vm.editFun = false;
    }

    function SaveFunInfo() {

        vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
        angular.forEach(vm.SelectedFun.FunLoad, function (l, i) {
            l.Id = l.Id || -1;
            l.SortNo = i;
        });
        var en = angular.copy(vm.SelectedFun);
        en.Content = undefined;
        en.FunLoad = undefined;
        en.ListLoad = JSON.stringify(vm.SelectedFun.FunLoad);
        en.FunHtml = vm.SelectedFun.FunHtml || '';
        en.Controller = vm.SelectedFun.Controller || '';
        en.ControllerAs = vm.SelectedFun.ControllerAs || '';
        en.FunDesc = vm.SelectedFun.FunDesc || '';
        en.IsUsed = vm.SelectedFun.IsUsed;
        en.OrderBy = vm.FunList.Length || 1;
        en.IsSystem = vm.SelectedFun.IsSystem || 0;
        en.CreateBy = $rootScope.User.UserNo;
        en.TempColumns = 'ListLoad';
        vm.promise = AjaxService.ExecPlan('FunRoot', "save", en).then(function (data) {
            var Content = vm.SelectedFun.Content;
            //更新数据
            reflashData();
            //更新功能基本信息
            AjaxService.LoginAction("ReInit");

            console.log(!en.IsSystem && data.data[0] && data.data[0].FunNo && Content);
            console.log(data);
            //保存文件
            if (!en.IsSystem && data.data[0] && data.data[0].SN && Content) {
                vm.FunCodeSetting.FunNo = data.data[0].SN;
                var htmlEn = {};
                htmlEn.FileName = data.data[0].SN + ".html";
                htmlEn.Text = $window.btoa($window.encodeURIComponent(Content.Html));
                //保存html
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(htmlEn));

                var JsEn = {};
                JsEn.FileName = data.data[0].SN + ".js";
                JsEn.Text = $window.btoa($window.encodeURIComponent(Content.Js));
                //保存html
                AjaxService.AjaxHandle("WriteFile", JSON.stringify(JsEn));

                //保存代码设定
                AjaxService.ExecPlan('FunCodeSet', "save", vm.FunCodeSetting);

            }
            toastr.success('储存成功');
        })
    }

    function reflashData() {
        var en = [{ name: 'FunType', value: 1 }, { name: 'SysNo', value: vm.SystemItem ? vm.SystemItem.SysNo : undefined }];
        vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
            vm.List = data;
            angular.forEach(data, function (r) {
                if (r.FunNo == vm.SelectedRoot.FunNo) {
                    vm.FunList = r.FunList || [];
                    r.selected = true;
                    vm.SelectedFun = undefined;
                    vm.editFun = false;
                    return;
                }
            });
        }); 
    }

    function showPop(show)
    {
        return MyPop.Show(show, '功能信息还在编辑，请先保存！')
    }

    function save(list, type) {
        if (!showPop(vm.editFun)) {
            var List = [];
            angular.forEach(list, function (r, i) {
                var en = {};
                en.FunNo = r.FunNo;
                en.FunName = r.FunName;
                en.OrderBy = i;
                en.FunImge = r.FunImge;
                List.push(en);
            });
            var json = {};
            json.FunType = type;
            json.SysNo = vm.SystemItem ? vm.SystemItem.SysNo : "";
            json.RootList = JSON.stringify(List);
            json.TempColumns = 'RootList';
            vm.promise = AjaxService.ExecPlan("FunRoot", "saveRoot", json).then(function (data) {
                toastr.success('储存成功');
                //更新功能基本信息
                AjaxService.LoginAction("ReInit");
            })
        }
    }

    //切换文件方式
    function FunctionFile(f) {
        //添加文件
        if (vm.SelectedFun.IsSystem) {
            var have = false, index = -1;
            vm.SelectedFun.FunHtml = vm.OriHtml;
            var js = "CustomFun\\" + vm.SelectedFun.FunNo + '.js';
            angular.forEach(vm.SelectedFun.FunLoad, function (f, i) {
                if (f.LoadName == js) {
                    have = true;
                    index = i; return;
                }
            });
            if (have) {
                vm.SelectedFun.FunLoad.splice(index, 1);
            }
        }
        else {
            var have = false;
            vm.OriHtml = vm.SelectedFun.FunHtml;
            vm.SelectedFun.FunHtml = "CustomFun\\" + vm.SelectedFun.FunNo + '.html';
            var js = "CustomFun\\" + vm.SelectedFun.FunNo + '.js';
            angular.forEach(vm.SelectedFun.FunLoad, function (f) {
                if (f.LoadName == js) {
                    have = true; return;
                }
            });
            if (!have) {
                var en = {};
                en.FunNo = vm.SelectedFun.FunNo;
                en.LoadName = js;
                vm.SelectedFun.FunLoad = vm.SelectedFun.FunLoad || [];
                vm.SelectedFun.FunLoad.push(en);
            }
        }
    }

    //打开html 编辑窗口
    function OpenHtmlJs() {
        //if (!vm.SelectedFun.Content) {
        //    //获取js， html文件
        //    AjaxService.AjaxHandle("GetFileText", vm.SelectedFun.FunNo).then(function (data) {
        //        vm.SelectedFun.Content = {};
        //        vm.SelectedFun.Content.Html = (data.Html || "").replace(/ControlNew/g, vm.SelectedFun.ControllerAs);
        //        vm.SelectedFun.Content.Js = (data.Js || "").replace(/NewJsCtrl/g, vm.SelectedFun.Controller);
        //        OpenConten();
        //    })
        //}
        //else {
        //    OpenConten();
        //}

        OpenConten();
    }
    
    function OpenConten() {
        var resolve = {
            ItemData: function () {
                return vm.SelectedFun;
            }
        };
        Dialog.open("FunFileContenDialog", resolve).then(function (data) {
            vm.SelectedFun.Content = data.Content;
            vm.FunCodeSetting = data.FunSetting;
        }).catch(function (reason) {
        });
    }

    function GetNewJs() {
        var js = ""
    }
}
]);