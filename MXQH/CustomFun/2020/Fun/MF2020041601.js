'use strict';

angular.module('AppSet')
.controller('PiecePriceCtrl', ['$scope', 'Dialog', 'AjaxService', 'toastr', '$window',
function ($scope, Dialog, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.Save = Save;
    vm.Open = Open;

    GetData();
    function GetData() {
        vm.promise = AjaxService.GetPlans("bcPiecePrice").then(function (data) {
            vm.List = data;
        });
    }   

    function Open(item) {
        Dialog.OpenDialog("bcPiecePriceHis", item).then(function (data) {

        })
    }

    function Save(item) {
        var en = {};
        en.Code = item.Code;
        en.Price = item.Price;
        en.OverPrice = item.OverPrice;
        en.WeekPrice = item.WeekPrice;
        en.LegalPrice = item.LegalPrice;
        vm.promise = AjaxService.ExecPlan("bcPiecePrice", "save", en).then(function (data) {
            GetData();
            item.IsEdit = !item.IsEdit
            toastr.success("储存成功");
        });
    }
}]);
