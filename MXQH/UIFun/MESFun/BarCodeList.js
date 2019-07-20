'use strict';
angular.module('app')
.controller('BarCodeListCtrl', ['$rootScope', '$scope', 'FileUrl', 'AjaxService', 'toastr', 'serviceUrl',
function ($rootScope, $scope, FileUrl, AjaxService, toastr, serviceUrl) {

    var vm = this;

    vm.Ser = {};
    vm.Item = {};
    vm.page = { index: 1, size: 9 };

    vm.Search = Search;
    vm.SelectType = SelectType;
    vm.PageChange = PageChange;
    vm.Edit = Edit;
    vm.NewLabel = NewLabel;

    Search()
    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    //获取类型
    vm.promise = AjaxService.GetPlans("MESBarcodeType").then(function (data) {
        vm.List = data;
    });

    function PageChange() {
        var en = {}, con = [];
        if (vm.Ser.Name) {
            con.push({ name: "Name", value: vm.Ser.Name })
        }
        if (vm.SelectedType && vm.SelectedType.ID) {
            con.push({ name: "TypeID", value: vm.SelectedType.ID })
        }

        en.strJson = JSON.stringify(con);
        en.Start = vm.page.index <= 1 ? 1 : (vm.page.index - 1) * vm.page.size + 1;
        en.End = en.Start + vm.page.size - 1;
        vm.promise = AjaxService.Custom("GetBarCodeTemplate", en).then(function (data) {
            vm.BarList = data.List;
            vm.page.total = data.Count;
        });
    }

    function SelectType(item) {
        vm.SelectedType = item;
        PageChange();
    }

    function Edit(item) {
        var str = 'BarCode:' + serviceUrl + '-' + item.TemplateId + "-" + item.TypeID;
        console.log(str);
        $window.location.href = str;
    }

    function NewLabel() {
        var str = 'BarCode:' + serviceUrl + '-0-' + (vm.SelectedType && vm.SelectedType.ID ? vm.SelectedType : "0");
        //console.log(str);
        $window.location.href = str;
    }
}
]);