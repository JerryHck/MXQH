'use strict';

angular.module('app')
.controller('DSInfoCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope,$scope, $http, Dialog, toastr, AjaxService, Form, MyPop) {

    var dsinfo = this;    
    dsinfo.page = { pageIndex: 1, pageSize: 20, maxSize: 10, Code: '', PlanCode: '', UserNo: $rootScope.User.UserNo };
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
        var json = {};
        json.List = JSON.stringify(li);
        json.TempColumns = "List"
        dsinfo.promise = AjaxService.ExecPlan("MRPDSInfoResult", "BatchUpdate", json).then(function (data) {
            toastr.success('储存成功');
            //更新功能基本信息
            //AjaxService.LoginAction("ReflashRoot");
        })
    }

    //绑定数据（带分页）
    function DataBind() {
        var list2 = [];
        if (!dsinfo.page.Code) {
            dsinfo.page.Code = '';
        }
        if (!dsinfo.page.PlanCode) {
            dsinfo.page.PlanCode = '';
        }
        dsinfo.promise = AjaxService.ExecPlan("MRPDSInfoResult", "Select", dsinfo.page).then(function (data) {
            dsinfo.List = data.data;
            dsinfo.page.total=data.data1[0].TotalCount
        });
    }

    //查询
    function Search() {
        dsinfo.page.pageIndex = 1;
        DataBind()
    }

    //编辑弹出框
    function Edit(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
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