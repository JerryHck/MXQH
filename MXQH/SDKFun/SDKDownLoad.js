var app = angular.module('app').controller('SDKDownLoadCtrl', SDKDownLoadCtrl);
SDKDownLoadCtrl.$inject = ['$scope', '$rootScope', 'AjaxService', 'toastr', 'appUrl', 'FileUrl', '$window'];
function SDKDownLoadCtrl($scope, $rootScope, AjaxService, toastr, appUrl, FileUrl, $window) {
    var vm = this;

    vm.Ser = {};
    vm.Item = {};
    vm.page = { index: 1, size: 12 };
    vm.DeleteFile = [];

    vm.Search = Search;
    vm.ProFile = ProFile;
    vm.Download = Download;
    vm.SelectAll = SelectAll;

    Search()
    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function PageChange() {
        var en = {};
        en.ProNo = vm.Ser.ProNo;
        en.Start = vm.page.index <= 1 ? 1 : (vm.page.index - 1) * vm.page.size + 1;
        en.End = en.Start + vm.page.size;
        var json = {};
        json.strJson = JSON.stringify(en);
        vm.promise = AjaxService.Custom("GetProList", json).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Total;
        });
        
    }

    function ProFile(item) {
        vm.FileItem = item;
        GetProFile();
        $(".pro-file").addClass("active");
    }

    function GetProFile() {
        var list = [];
        list.push({ name: "ProNo", value: vm.FileItem.ProNo });
        list.push({ name: "Version", value: vm.FileItem.Version });
        AjaxService.GetPlans("SDKProFile", list).then(function (data) {
            vm.ProFileList = data;
        });
    }

    function Download() {
        vm.ProFileList = vm.ProFileList || [];
        var List = [];
        for (var i = 0, len = vm.ProFileList.length; i < len; i++) {
            if (vm.ProFileList[i].isCheck) {
                List.push(vm.ProFileList[i].File);
            }
        }
        var en = {};
        en.ProNo = vm.FileItem.ProNo;
        en.Version = vm.FileItem.Version;
        en.FileJson = JSON.stringify(List);

        vm.promise = AjaxService.Custom("SdkDownload", en).then(function (data) {
            toastr.success("下载链接已经发送到您的邮箱，请查收！");
        })
    }

    function SelectAll() {
        vm.ProFileList = vm.ProFileList || [];
        for (var i = 0, len = vm.ProFileList.length; i < len; i++) {
            vm.ProFileList[i].isCheck = vm.IsAll;
        }
    }
}