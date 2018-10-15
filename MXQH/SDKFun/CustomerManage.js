'use strict';

angular.module('app')
.controller('CustomerCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop) {
    var customer = this;
    customer.form = Form[0];
    customer.S = {};
    customer.S2 = {};
    customer.S3 = {};
    customer.PreItem = {};
    customer.PageChange = PageChange;
    customer.isNewRight = true;
    customer.Search = Search;
    customer.SelectCustomer = SelectCustomer;
    customer.EditCustomer = EditCustomer;
    customer.CancelCustomer = CancelCustomer;
    customer.SelectProduct = SelectProduct;
    customer.SaveCustomer = SaveCustomer;
    customer.InsertCustomerRight = InsertCustomerRight;
    customer.DeleteCustomerRight = DeleteCustomerRight;
    //customer.page = { index: 1, size: 15, maxSize: 10 };
    Init();

    function Init() {
        PageChange();
        GetProduct();
    }

    //获取产品列表
    function GetProduct() {
        customer.promise = AjaxService.ExecPlan("SDKPro", "Select", customer.S2).then(function (data) {
            customer.Products = data.data;
        });
    }

    //查询产品
    function SearchPro() {
        GetProduct();
    }
    //获取客户数据列表（带分页）
    function PageChange() {
        //var list2 = [];
        //if (customer.S.QueryString) {
        //    list2.push({ name: "DocLineNo", value: customer.S.DocLineNo });
        //}
        customer.promise = AjaxService.ExecPlan("SDKRegUser", "Select", customer.S).then(function (data) {
            customer.List = data.data;
            //customer.page.total = data.Count;
        });
    }

    //客户查询
    function Search() {
        //customer.page.index = 1;
        PageChange();
    }

    //选择用户
    function SelectCustomer(item) {
        var en = { name: "Account", value: item.Account };
        customer.promise = AjaxService.GetPlan("SDKRegUser", en).then(function (data) {
            customer.selectedCustomer = data;
            GetCustomerRights();
        });
    }



    //编辑选中用户信息
    function EditCustomer() {
        customer.PreItem = angular.copy(customer.selectedCustomer);
        customer.isEdit = !customer.isEdit
    }
    //保存用户信息
    function SaveCustomer() {

    }
    //取消编辑
    function CancelCustomer() {
        customer.isEdit = !customer.isEdit;
        customer.selectedCustomer = angular.copy(customer.PreItem);
    }

    //获取客户已有产品权限列表
    function GetCustomerRights() {
        customer.S3.UserNo = customer.selectedCustomer.Account;
        customer.promise = AjaxService.ExecPlan("SDKUserRight", "Select", customer.S3).then(function (data) {
            customer.CustomerRights = data.data;
        });
    }
    //选择产品
    function SelectProduct(obj) {
        for (var i = 0; i < customer.CustomerRights.length; i++) {
            if ((customer.CustomerRights[i].ProNo + customer.CustomerRights[i].Version) == obj)
            {
                customer.isNewRight = false;
                break;
            }
            else {
                customer.isNewRight = true;
            }
        }
    }
    //添加产品权限
    function InsertCustomerRight() {
        var en = {};
        en.CreateBy = $rootScope.User.UserNo;
        en.ModifyBy = $rootScope.User.UserNo;
        en.UserNo = customer.selectedCustomer.Account;
        en.ProNo = customer.newProduct.ProNo;
        en.Version = customer.newProduct.Version;
        customer.promise = AjaxService.PlanInsert("SDKUserRight", en).then(function (data) {
            toastr.success('储存成功');
            GetCustomerRights();
        });
    }

    function DeleteCustomerRight(item) {
        console.log(item);
        customer.promise = AjaxService.PlanDelete("SDKUserRight", item).then(function (data) {
            toastr.success('移除成功');
            GetCustomerRights();
        });
    }
}
]);