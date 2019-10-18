'use strict';

angular.module('app')
.controller('U9HKAllSoCtrl', ['$rootScope', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 10 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    function Search() {
        vm.page.index = 1;
        PageChange();
    }

    function PageChange() {
        vm.Ser.Type = "S";
        vm.promise = AjaxService.ExecPlanPage("U9ItemData", "HkAllSo", vm.Ser, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.ProList = data.data1;
            vm.ColList = [];
            for (var i = 0, len = vm.ProList.length; i < len; i++) {
                //var en = angular.copy(vm.ProList[i]);
                //en.List = [];
                //vm.ColList.push({ Col: vm.ProList[i].MateNo, Name: vm.ProList[i].Code + ' Bom用量' });
                //vm.ColList.push({ Col: vm.ProList[i].MateNo + "_S", Name: vm.ProList[i].Code + '出(300材料)' });
                //vm.ColList.push({ Col: vm.ProList[i].MateNo + "_R", Name: vm.ProList[i].Code + '收(800整)' });

                var en = angular.copy(vm.ProList[i]);
                en.List = [];
                en.List.push({ Col: vm.ProList[i].MateNo, Name: 'Bom用量' });
                en.List.push({ Col: vm.ProList[i].MateNo + "_S", Name: '出(300材)' });
                en.List.push({ Col: vm.ProList[i].MateNo + "_R", Name: '收(800整)' });
                vm.ColList.push(en);
            }
            vm.page.total = data.Count;
        });

    }

    function ExportExcel() {
        vm.Ser.Type = "E";
        vm.promise = AjaxService.GetPlanExcel("U9ItemData", "HkAllSo", vm.Ser).then(function (data) {
            $window.location.href = data.File;
        });
    }

}]);
