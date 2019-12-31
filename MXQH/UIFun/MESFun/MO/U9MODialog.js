'use strict';
angular.module('app')
.controller('U9MODialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.page = { pageSize: 8, pageIndex: 1, maxSize: 10 }
    vm.Item = ItemData;
    vm.DataBind = DataBind; //数据绑定
    vm.Search = Search;//查询工单
    vm.Cancel = Cancel;//关闭弹窗
    vm.Select = Select;//选择工单
    init();
    function init() {
        if (vm.Item.DocNo) {
            vm.page.DocNo = vm.Item.DocNo;
        }
        DataBind();
    }
    //查询工单
    function Search() {
        vm.pageIndex = 1;
        DataBind();
    }
    //数据绑定
    function DataBind() {
        GetCondition();
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "GetU9MO", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        })
    }
    //获取查询条件
    function GetCondition() {

    }
    //选择工单
    function Select(item) {
        var en = {SendPlace:item.SendPlace,SendPlaceCode:item.SendPlaceCode,Line:item.Department};
        //var en = { SendPlace: 'TTT3', SendPlaceCode: 'TTT3', Line: '3线' };
        vm.promise = AjaxService.ExecPlan("MesPlanDetail", "CheckData", en).then(function (data) {
            item.SendPlaceID = data.data[0].SendPlaceID;
            if (data.data1[0].MsgType == '1') {
                item.AssemblyLineID = data.data2[0].AssemblyLineID;
            }
            $uibModalInstance.close(item);
        })
    }
    //关闭弹窗
    function Cancel() {
        $uibModalInstance.close("0");
    }


}
])