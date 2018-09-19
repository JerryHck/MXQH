'use strict';

angular.module('app')
.controller('DSInfoCtrl', ['$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($scope, $http, Dialog, toastr, AjaxService, Form, MyPop) {

    var dsinfo = this;
    dsinfo.page = { index: 1, size: 15, maxSize: 10 };
    dsinfo.S = {};
    dsinfo.DataBind = DataBind;
    dsinfo.Search = Search;
    dsinfo.Edit = Edit;
    DataBind();
    
    //绑定数据（带分页）
    function DataBind() {
        var list2 = [];
        if (dsinfo.S.Code) {
            list2.push({ name: "Code", value: dsinfo.S.Code });
        }
        if (dsinfo.S.DocNo) {
            list2.push({ name: "DocNo", value: dsinfo.S.DocNo });
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