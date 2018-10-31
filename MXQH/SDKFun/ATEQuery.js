'use strict';

angular.module('app')
.controller('ATEQueryCtrl', ['$rootScope', '$scope', 'Form', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, Form, $http, Dialog, toastr, AjaxService, MyPop) {
    var ate = this;
    ate.page = {size:1,index:1,maxSize:10}
    ate.BindData = BindData;
    ate.Search = Search;
    BindData();

    function Search() {
        ate.page.index = 1;
        BindData();
    }

    //绑定数据（带分页）
    function BindData() {
        var list2 = [];
        if (ate.S) {
            if (ate.S.CustomerCode) {
                list2.push({ name: "CustomerCode", value: "%" + ate.S.CustomerCode + "%" });
            }
            if (ate.S.Wafer) {
                list2.push({ name: "Wafer", value: "%" + ate.S.Wafer + "%" });
            }
        }
        ate.promise = AjaxService.GetPlansPage("ProductRight", list2, ate.page.index, ate.page.size).then(function (data) {
            console.log(data);
            ate.List = data.List;
            ate.page.total = data.Count;
        });
    }
}
]);