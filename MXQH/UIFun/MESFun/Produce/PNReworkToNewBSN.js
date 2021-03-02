'use strict';

angular.module('app')
.controller('PNReworkToNewBSNCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.DeleteItem = { };
    vm.MesList = [];
    vm.Focus = 0;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.IsAuto = true;

    vm.KeyDonwInCode = KeyDonwInCode;
    vm.DeleteCode = DeleteCode;
    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;
    vm.SelectTab = SelectTab;

    //PageChange();

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    //获取模版信息
    AjaxService.GetPlan("MESBarCodeTemplate", [{ name: "TemplateId", value: 1 }]).then(function (data) {
        vm.Template = data;
    })

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("opPNReworkNewBSN", getContition(), vm.page.index, vm.page.size).then(function (data) {
            console.log(data)
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }


    //内部码验证
    function KeyDonwInCode(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && vm.DeleteItem.BSN) {
            DeleteCode();
        }
    }

    function SelectTab(index) {
        vm.Focus = index;
    }

    function DeleteCode() {
        var en = {};
        if (vm.IsAuto) {
            DeleteCode2();
        }
    }

    function DeleteCode2() {
        vm.promise = AjaxService.ExecPlan("opPNReworkNewBSN", 'check', vm.DeleteItem).then(function (data) {
            if (data.data[0].MsgType == "Error") {
                showMsg(data.data[0].MsgText, false);
                vm.DeleteItem.BSN = undefined;
                vm.Focus = 0;
            }
            else if (data.data[0].MsgType == "Success") {
                vm.DeleteItem.BSN = undefined;
                vm.Focus = 0;
                var en = data.data1[0];
                en.InternalCode = "";
                en.Remark = vm.DeleteItem.Remark;
                var SNList = [{ name: "MesSnCode", col: "SnToBsn", parm: "InternalCode", charName: "" }];
                en.SNColumns = JSON.stringify(SNList);
                vm.promise = AjaxService.ExecPlan("opPNReworkNewBSN", 'save', en).then(function (data2) {
                    console.log(1234)
                    if (data2.data[0].MsgType == "Error") {
                        showMsg(data2.data[0].MsgText, false);
                    }
                    else if (data2.data[0].MsgType == "Success") {
                        showMsg(data2.data[0].MsgText, true);
                        print(data2.data1[0].InternalCode);
                    }
                });
            }
            
        });
    }

    function print(bsn) {
        var postData = {}, list = [];
        list.push(bsn);
        postData.ParaData = JSON.stringify({});
        postData.OutList = list;
        AjaxService.Print(vm.Template.TemplateId, vm.Template.TS, postData).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        })
    }

    function showMsg(msg, b) {
        var Msg = { Id: vm.MesList.length + 1, IsOk: b, Msg: msg };
        vm.MesList.splice(0, 0, Msg);
        if (!b) {
            toastr.error(msg);
            AjaxService.PlayVoice('error.mp3');
        }
        else {
            AjaxService.PlayVoice('success.mp3');
        }
    }

    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("opPNReworkNewBSN", getContition()).then(function (data) {
            //console.log(data);
            $window.location.href = data.File;
        });
    }

    function getContition() {
        var list = [];
        if (vm.Ser.InternalCode) {
            list.push({ name: "InternalCode", value: vm.Ser.InternalCode });
        }
        if (vm.Ser.OriSNCode) {
            list.push({ name: "OriSNCode", value: vm.Ser.OriSNCode });
        }
        if (vm.Ser.OriInternalCode) {
            list.push({ name: "OriInternalCode", value: vm.Ser.OriInternalCode });
        }
        if (vm.Ser.StartDate) {
            list.push({ name: "TS", value: vm.Ser.StartDate, type: ">=" });
        }
        if (vm.Ser.EndDate) {
            list.push({ name: "TS", value: vm.Ser.EndDate, type: "<=" });
        }
        return list;
    }

}
]);