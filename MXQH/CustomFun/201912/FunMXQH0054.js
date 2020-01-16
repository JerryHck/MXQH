'use strict';

angular.module('app')
.controller('TestCtrl', ['$rootScope', '$scope', 'AjaxService', 'toastr', '$window',
function ($rootScope, $scope, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};
    vm.PageChange = PageChange;
    vm.Search = Search;

    vm.Text = "我是新的功能fdsfas！";
    //PageChange();


    var arr = new Array();
    //arr.unshift(1);
    //arr.unshift(2);
    //arr.unshift(3);
    //arr.unshift(4);
    arr.push("a")
    arr.push("b")
    arr.push("c")
    arr.push("d")
    arr.push("e")
    console.log(arr.length);
    // 此时数组arr= [4, 3, 2, 1]
    console.log(arr.pop()) //把最后一位移出来
    //此时arr = [4, 3, 2]，达到先进来的数据为1，先出去为1

    console.log(arr);
    console.log(arr.pop())
    console.log(arr);

    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.Name) {
            list.push({ name: "name", value: vm.Ser.InternalCode });
        }
        //if (vm.Ser.DeleteBy) {
        //    list.push({ name: "DeleteBy", value: vm.Ser.DeleteBy });
        //}
        //if (vm.Ser.StartDate) {
        //    list.push({ name: "DeleteDate", value: vm.Ser.StartDate, type: ">=" });
        //}
        //if (vm.Ser.EndDate) {
        //    list.push({ name: "DeleteDate", value: vm.Ser.EndDate, type: "<=" });
        //}
        vm.promise = AjaxService.GetPlansPage("Dialog", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }
}
]);