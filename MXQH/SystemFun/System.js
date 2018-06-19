'use strict';
angular.module('app')
.controller('SystemCtrl', ['$scope', '$http', 'Dialog', 'AjaxService',
    function ($scope, $http, Dialog, AjaxService) {

        var vm = this;
        //編輯
        vm.Edit = Edit;
        //删除
        vm.Delete = Delete;
        //分頁
        vm.page = { index: 1, size: 14 };
        //Dailog
        vm.Insert = Insert;

        GetList();

        //編輯
        function Insert() {
            var resolve = {
                ItemData: function () {
                    return {};
                }
            };
            Open("U", resolve);
        }

        //編輯
        function Edit(item) {
            var resolve = {
                ItemData: function () {
                    return item;
                }
            };
            Open("U", resolve);
        }


        //删除
        function Delete(item) {
            if (confirm("确认删除？")) {
                var en = {};
                en.SysNo = item.SysNo;
                en.CompanyNo = item.Company.CompanyNo;
                AjaxService.Action('Sys_System', en, "Delete").then(function (data) {
                    GetList();
                    toastr.success('删除');
                });
            }
        }

        function GetList() {
            AjaxService.GetEntities("SystemList").then(function (data) {
                vm.List = data;
                console.log(data);
            }).catch(function (mes) { console.log(mes); });
        }

        function Open (type, resolve) {
            Dialog.open("SystemDailog", resolve).then(function (data) {
                GetList();
                //console.log(data);
            }).catch(function (reason) {
                //console.log(reason);
            });
        }
    }
]);