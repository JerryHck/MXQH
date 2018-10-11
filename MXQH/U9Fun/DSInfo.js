'use strict';

angular.module('app')
.controller('DSInfoCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope,$scope, $http, Dialog, toastr, AjaxService, Form, MyPop) {

    var dsinfo = this;
    dsinfo.page = { index: 1, size: 15, maxSize: 10 };
    dsinfo.S = {};
    dsinfo.DataBind = DataBind;
    dsinfo.Search = Search;
    dsinfo.BatchSave = BatchSave;
    dsinfo.Edit = Edit;
    dsinfo.List = {};
    DataBind();
    
    function BatchSave() {
        var li = [];
        angular.forEach(dsinfo.List, function (r, i) {
            var en = {};
            en.ID = r.ID;
            en.ModifyBy = $rootScope.User.UserNo
            en.Remark = r.Remark;
            li.push(en);
        });
        console.log(li);
        var json = {};
        json.List = JSON.stringify(li);
        json.TempColumns = "List"
        console.log(json);
        dsinfo.promise = AjaxService.ExecPlan("MRPDSInfoResult", "BatchUpdate", json).then(function (data) {
            toastr.success('储存成功');
            //更新功能基本信息
            //AjaxService.LoginAction("ReflashRoot");
        })
    }

    //绑定数据（带分页）
    function DataBind() {
        var list2 = [];
        if (dsinfo.S.Code) {
            list2.push({ name: "Code", value: '%'+dsinfo.S.Code+'%' });
        }
        if (dsinfo.S.PlanCode) {
            list2.push({ name: "PlanCode", value:'%'+dsinfo.S.PlanCode+'%' });
        }
        dsinfo.promise = AjaxService.GetPlansPage("MRPDSInfoResult", list2, dsinfo.page.index, dsinfo.page.size).then(function (data) {
            dsinfo.List = data.List;
            dsinfo.page.total = data.Count;
        });
    }

    //查询
    function Search() {
        dsinfo.page.index = 1;
        DataBind()
    }

    //编辑弹出框
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        console.log('123');
        Open('U', resolve);
    }
    //打开弹出框 I/U->新增/编辑
    function Open(type, resolve) {
        Dialog.open("DSInfoResult", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {
        });
    }

}
])