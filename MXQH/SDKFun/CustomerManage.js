'use strict';

angular.module('app')
.controller('CustomerCtrl', ['$rootScope', '$scope', 'Form', '$http', 'Dialog', 'toastr', 'AjaxService', 'MyPop',
function ($rootScope, $scope, Form, $http, Dialog, toastr, AjaxService, MyPop) {
    var customer = this;
    customer.form = Form[0];
    customer.S = {};
    customer.S2 = {};
    customer.S3 = {};
    customer.PreItem = {};
    customer.PageChange = PageChange;
    customer.isNewRight = true;
    customer.Search = Search;
    customer.CustomerRights = {};
    customer.SelectCustomer = SelectCustomer;
    customer.selectedCustomer = {};
    customer.EditCustomer = EditCustomer;
    customer.CancelCustomer = CancelCustomer;
    customer.SelectProduct = SelectProduct;
    customer.SaveCustomer = SaveCustomer;
    customer.InsertCustomerRight = InsertCustomerRight;
    customer.DeleteCustomerRight = DeleteCustomerRight;
    customer.fileData = [];
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
        customer.isEdit = false;
        customer.isNewRight = true;
        customer.isAddUserRole = false;
        var en = { name: "Account", value: item.Account };

        customer.promise = AjaxService.GetPlan("SDKRegUser", en).then(function (data) {
            customer.selectedCustomer = data;
            if (data.NDA) {
                //customer.fileData = angular.copy(data.NDA);
                for (var i = 0; i < data.NDA.length; i++) {
                    customer.fileData.push(data.NDA[i].File);
                }                
            }            
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
        var c = {};
        c.Account = customer.selectedCustomer.Account;
        c.Address = customer.selectedCustomer.Address;
        c.Bank = customer.selectedCustomer.Bank;
        c.Code = customer.selectedCustomer.Code;
        c.CompanyName = customer.selectedCustomer.CompanyName;
        c.Contact = customer.selectedCustomer.Contact;
        c.Email = customer.selectedCustomer.Email;
        c.LegalPerson = customer.selectedCustomer.LegalPerson;
        c.Mobile = customer.selectedCustomer.Mobile;
        c.Phone = customer.selectedCustomer.Phone;
        c.Position = customer.selectedCustomer.Position;
        c.ReceiveAccount = customer.selectedCustomer.ReceiveAccount;
        c.ShareHolder = customer.selectedCustomer.ShareHolder;

        var files = [];
        if (customer.selectedCustomer.CardFile) {
            if (customer.selectedCustomer.CardFile.File.IsNew) {
            var file = {};
            file = angular.copy(customer.selectedCustomer.CardFile.File);
            file.FileType2 = 'Card';
            file.FormalDir = 'SDKRegister';
            files.push(file);
            }
        }
        if (customer.selectedCustomer.CardReverseFile) {
            if (customer.selectedCustomer.CardReverseFile.File.IsNew) {
                var file = {};
                file = angular.copy(customer.selectedCustomer.CardReverseFile.File);
                file.FileType2 = 'CardReverse';
                file.FormalDir = 'SDKRegister';
                files.push(file);
            }
        }
       
        console.log(customer.fileData);
        if (customer.fileData) {
            for (var i = 0; i < customer.fileData.length; i++) {
                if (customer.fileData[i].IsNew) {
                    var file = angular.copy(customer.fileData[i]);
                    file.FileType2 = 'NDA';
                    file.FormalDir = 'SDKRegister';
                    files.push(file);
                }                
            }
        }
     
        console.log(files);
        c.List = JSON.stringify(files);
        c.TempColumns = "List";
        var en = {};
        en = c;
        en.customer = JSON.stringify(c);
        en.Files = JSON.stringify(files);
        en.TempColumns = "Files";
        customer.promise = AjaxService.ExecPlanUpload("SDKRegUser", "Update", en,files,"SDKRegister").then(function (data) {
            toastr.success('储存成功');
        });

    }
    //取消编辑
    function CancelCustomer() {
        console.log(customer.selectedCustomer.CardFile);
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
            if ((customer.CustomerRights[i].ProNo + customer.CustomerRights[i].Version) == obj) {
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
        customer.isNewRight = false;
        var en = {};
        en.CreateBy = $rootScope.User.UserNo;
        en.ModifyBy = $rootScope.User.UserNo;
        en.UserNo = customer.selectedCustomer.Account;
        en.ProNo = customer.newProduct.ProNo;
        en.Version = customer.newProduct.Version;
        customer.promise = AjaxService.PlanInsert("SDKUserRight", en).then(function (data) {
            //customer.isNewRight = !customer.isNewRight;
            GetCustomerRights();
            toastr.success('储存成功');
        });
    }

    function DeleteCustomerRight(item) {
        customer.promise = AjaxService.PlanDelete("SDKUserRight", item).then(function (data) {
            toastr.success('移除成功');
            GetCustomerRights();
        });
    }
}
]);