'use strict';

angular.module('AppSet')
.controller('OQCReportCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.BetchNo ? 1 : 0]; vm.Item = angular.copy(ItemData);
    vm.ItemList = [];
    //vm.form.index = 2;

    vm.Save = Save;
    vm.Cancel = Cancel;
    
    //获取报告信息
    AjaxService.ExecPlan("OQCReport", "get", { ID: ItemData.ID }).then(function (data) {
        vm.MainData = data.data[0];
        vm.OQCData = data.data1[0];
        vm.CheckData = data.data2 || [];
        vm.PerValList = data.data3 || [];
        vm.ColNum = 0;
        for (var i = 0, len = vm.CheckData.length; i < len; i++) {
            var list = [];
            for (var j = 0, len1 = vm.PerValList.length; j < len1; j++) {
                if (vm.CheckData[i].PropertyID == vm.PerValList[j].PID) {
                    list.push(vm.PerValList[j]);
                    switch (vm.CheckData[i].PropertyCode) {
                        case "OQCBJJC": break;
                        case "OQCPJJC": break;
                        case "OQCPZJC": break;
                        case "OQCZXJC": break;
                        default: vm.ItemList.push(vm.PerValList[j]); break;
                    }
                }
            }
            vm.CheckData[i].List = list;
            switch (vm.CheckData[i].PropertyCode) {
                case "OQCBJJC": vm.OQCBJJC = vm.CheckData[i]; vm.ColNum = list.length > vm.ColNum ? list.length : 0; break;
                case "OQCPJJC": vm.OQCPJJC = vm.CheckData[i]; vm.ColNum = list.length > vm.ColNum ? list.length : 0; break;
                case "OQCPZJC": vm.OQCPZJC = vm.CheckData[i]; vm.ColNum = list.length > vm.ColNum ? list.length : 0; break;
                case "OQCZXJC": vm.OQCZXJC = vm.CheckData[i]; vm.ColNum = list.length > vm.ColNum ? list.length : 0; break;
                //case "OQCWGJC": vm.OQCWGJC = vm.CheckData[i]; break;
                //case "OQCGNJC": vm.OQCGNJC = vm.CheckData[i]; break;
            }
        }
        //最大列数
        vm.ColList = [];
        for (var i = 0; i < vm.ColNum; i++) {
            vm.ColList.push(i);
        }
    })

    function Save(b) {
        var en = { ID: ItemData.ID };
        var List1 = [];
        List1.push(vm.OQCData)
        en.OQC = JSON.stringify(List1);
        en.PerList = JSON.stringify(vm.PerValList);
        en.TempColumns = "OQC,PerList";
        AjaxService.ExecPlan("OQCReport", "save", en).then(function (data) {
            toastr.success('储存成功');
            if (b) {
                $uibModalInstance.close(en);
            }
        });
    };

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
