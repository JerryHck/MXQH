'use strict';

angular.module('app')
.controller('RegistrationAuditCtrl', ['$scope', 'Dialog', '$window', 'AjaxService', 'FileService', 'toastr',
function ($scope, Dialog, $window, AjaxService, FileService, toastr) {

    var vm = this;
    
    vm.State = { Table: "SDK_RegUsers", Column: "State" };
    //vm.Ser = { State: "2" };
    vm.Ser = { };
    vm.page = { index: 1, size: 12 };

    vm.Open = Open;
    vm.Search = Search;

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    AjaxService.GetEntities("SDKUserSign").then(function (data) {
        vm.ListSign = data;
        PageChange();
    })

    function PageChange() {
        var list = [];
        if (vm.Ser.State) {
            list.push({ name: "State", value: vm.Ser.State });
        }
        if (vm.Ser.Account) {
            list.push({ name: "Account", value: vm.Ser.Account });
        }
        if (vm.Ser.SNCode) {
            list.push({ name: "CompanyName", value: vm.Ser.CompanyName });
        }
        vm.promise = AjaxService.GetPlansPage("SDKRegUserList", list, vm.page.index, vm.page.size).then(function (data) {
            var DataList = data.List;
            for (var a = 0, len3 = DataList.length; a < len3; a++) {
                init(DataList[a])
            }
            vm.List = DataList;
            vm.page.total = data.Count;
        });
    }

    function init(item)
    {
        //审核
        for (var j = 0, len2 = vm.ListSign.length; j < len2; j++) {
            if (item.Account == vm.ListSign[j].Account) {
                item.AbleSign = true;
            }
        }
        //流程
        item.opts = {};
        item.opts.steps = [];
        var proList = item.Process, ReList = item.SignResult;
        for (var i = 0, len = proList.length; i < len; i++) {
            var en = {};
            en.title = proList[i].NodeName;
            en.content = i == 0 ? item.Contact : "";
            if (ReList) {
                for (var j = 0, len2 = ReList.length; j < len2; j++) {
                    if (item.Process[i].NodeNo == item.SignResult[j].NodeNo) {
                        en.content = "";
                        if (item.SignResult[j].IsAgree == 1) {
                            en.content = item.Process[i].SortNo > 0 ? (item.SignResult[j].UserName + ' 核准 备注：' + item.SignResult[j].Remark) : "";
                            item.opts.now = i + 1;
                        }
                        else if (item.SignResult[j].IsAgree == 2) {
                            en.content = item.Process[i].SortNo > 0 ? (item.SignResult[j].UserName + ' 驳回 备注：' + item.SignResult[j].Remark) : "";
                            item.opts.reject = i + 1;
                        }
                    }
                }
            }
            item.opts.steps.push(en);
        }
    }

    function Open(item, type)
    {
        var resolve = {
            ItemData: function () {
                return {
                    Account: item.Account, Type: type,
                    opts: angular.copy(item.opts)
                };
            }
        };
        Dialog.open("RegUserSignDialog", resolve).then(function (data) {
            PageChange();
        }).catch(function (reason) {
        });
    }
}
]);