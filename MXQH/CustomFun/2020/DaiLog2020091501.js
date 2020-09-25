'use strict';

angular.module('AppSet')
.controller('WorkOrderPlanImportCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.Import = Import;

    vm.Op = [
        {
            //标题列
            header: ['RowNo', 'CustomOrder', 'DemandCode', 'MRPType', 'FormType', 'WorkOrder', 'MaterialCode', 'MaterialName', 'WorkShop', 'Line', 'State', 'Quantity', 'FinishQty', 'NotFinishQty', 'ThisPlanQty', 'PlanStDate', 'PlanEdDate', 'NeedDate', 'ProduceDate', 'Remark'],
            sheet: 0, //excel 的第几张sheet 以0开始
        },
    ];

    function Import(data) {
        var list = [];
        vm.List = [];
        vm.ErrList = [];
        var ImList = data[0];

        for (var i = 3, len = ImList.length; i < len; i++) {
            var en = angular.copy(ImList[i]);
            //判断行号是否正确
            if (isNaN(en.RowNo)) {
                vm.ErrList.push('Excel表中的第' + (i + 1).toString() + '行的【序号】列【' + en.RowNo + '】 填写错误，需为数字');
            }
            en.CustomOrder = en.CustomOrder || '';
            en.DemandCode = en.DemandCode || '';
            en.MRPType = en.MRPType || '';
            en.FormType = en.FormType || '';
            en.WorkOrder = en.WorkOrder || '';
            en.MaterialCode = en.MaterialCode || '';
            en.MaterialName = en.MaterialName || '';
            en.WorkShop = en.WorkShop || '';
            en.Line = en.Line || '';
            en.State = en.State || '';
            //if (!en.Quantity) {
            //    toastr.error('Excel表中的第' + (i + 1).toString() + '行的【工单数量】未填写，不允许导入');
            //    return;
            //}
            if (en.Quantity && isNaN(en.Quantity)) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【工单数量】列【' + en.Quantity + '】 填写错误，需为数字');
            }
            en.Quantity = en.Quantity || '';
            if (en.FinishQty && isNaN(en.FinishQty)) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【已完工数量】列【' + en.FinishQty + '】 填写错误，需为数字');
            }
            en.FinishQty = en.FinishQty || '';
            if (en.NotFinishQty && isNaN(en.NotFinishQty)) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【未完工数量】列【' + en.NotFinishQty + '】 填写错误，需为数字');
            }
            en.NotFinishQty = en.NotFinishQty || '';

            if (en.ThisPlanQty && isNaN(en.ThisPlanQty)) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【本次排产数量】列【' + en.ThisPlanQty + '】 填写错误，需为数字');
            }
            en.ThisPlanQty = en.ThisPlanQty || '';

            en.PlanStDate = (en.PlanStDate || '').toString().trim();
            en.PlanEdDate = (en.PlanEdDate || '').toString().trim();
            en.NeedDate = (en.NeedDate || '').toString().trim();
            en.ProduceDate = (en.ProduceDate || '').toString().trim();
           
            //en.PlanStDate = en.PlanStDate || '';
            //en.PlanEdDate = en.PlanEdDate || '';
            //en.NeedDate = en.NeedDate || '';
            //en.ProduceDate = en.ProduceDate || '';

            if (en.PlanStDate && !en.PlanStDate.IsDate()) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【计划开工日期】列【' + en.PlanStDate + '】 日期格式填写错误, 请填写为YYYY-MM-DD格式');
            }
            if (en.PlanEdDate && !en.PlanEdDate.IsDate()) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【计划完工日期】列【' + en.PlanEdDate + '】 日期格式填写错误, 请填写为YYYY-MM-DD格式');
            }
            if (en.NeedDate && !en.NeedDate.IsDate()) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【需求日期】列【' + en.NeedDate + '】 日期格式填写错误, 请填写为YYYY-MM-DD格式');
            }
            if (en.ProduceDate && !en.ProduceDate.IsDate()) {
                vm.ErrList.push('Excel表中的第【' + (i + 1).toString() + '】行,序号为【' + en.RowNo + '】的【排产日期】列【' + en.ProduceDate + '】 日期格式填写错误, 请填写为YYYY-MM-DD格式');
            }
            en.PlanStDate = en.PlanStDate != "" ? new Date(en.PlanStDate).Format('yyyy-MM-dd') : "";
            en.PlanEdDate = en.PlanEdDate != "" ? new Date(en.PlanEdDate).Format('yyyy-MM-dd') : "";
            en.NeedDate = en.NeedDate != "" ? new Date(en.NeedDate).Format('yyyy-MM-dd') : "";
            en.ProduceDate = en.ProduceDate != "" ? new Date(en.ProduceDate).Format('yyyy-MM-dd') : "";
            en.Remark = en.Remark || '';
            list.push(en);
        }
        if (vm.ErrList.length > 0) {
            toastr.error("导入的excel表资料数据有误， 请下如下错误信息");
            return;
        }
        
        vm.List = list;
    }

    function Save(item) {
        if (!vm.List || vm.List.length == 0) {
            toastr.error("还未导入任何数据");
            return;
        }
        var en = {};
        en.List = JSON.stringify(vm.List);
        en.TempColumns = "List";
        vm.promise = AjaxService.ExecPlan("WorkOrderPlanImport", "import", en).then(function (data) {
            toastr.success("储存成功");
            $uibModalInstance.close(item);
        })
    }
    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
