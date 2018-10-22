var app = angular.module('app').controller('SDKUploadCtrl', SDKUploadCtrl);
SDKUploadCtrl.$inject = ['$scope', '$rootScope', 'AjaxService', 'toastr', 'appUrl', 'FileUrl', '$window'];
function SDKUploadCtrl($scope, $rootScope, AjaxService, toastr, appUrl, FileUrl, $window) {
    var vm = this;
    
    vm.Ser = {};
    vm.Item = {};
    vm.page = { index: 1, size: 12 };
    vm.DeleteFile = [];
    vm.isEdit = false;
    vm.Option = {
        yearOffset: 222,
        format: 'Y/m/d H:i',
        formatDate: 'Y/m/d',
        formatTime: 'H:i',
    };

    vm.ProSave = ProSave;
    vm.Search = Search;
    vm.ProEdit = ProEdit;
    vm.Insert = Insert;
    vm.ProFile = ProFile;
    vm.ProFileSave = ProFileSave;
    vm.DeleteProFile = DeleteProFile;
    vm.DownLoad = DownLoad;
    vm.isProExists = isProExists;
    vm.ProDelete = ProDelete;
    vm.ProCopy = ProCopy;


    Search()
    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function Insert() {
        vm.isEdit = false;
        vm.isCopy = false;
        vm.Item = {};
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.ProNo) {
            list.push({ name: "ProNo", value: vm.Ser.ProNo });
        }
        list.push({ name: "IsDelete", value: false });
        vm.promise = AjaxService.GetPlansPage("SDKPro", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function ProEdit(item) {
        vm.Item = item;
        vm.isEdit = true;
        vm.isCopy = false;
        $(".insert-pro").addClass("active");
    }

    function ProCopy(item) {
        vm.Item = angular.copy(item);
        vm.Item.Version = undefined;
        vm.isCopy = true;
        vm.isEdit = false;
        $(".insert-pro").addClass("active");
    }

    function ProFile(item) {
        vm.FileItem = angular.copy(item);
        GetProFile();
        $(".pro-file").addClass("active");
    }

    function ProSave()
    {
        if (vm.isEdit) {
            vm.Item.ModifyBy = $rootScope.User.UserNo;
            vm.Item.ModifyDate = new Date();
            AjaxService.PlanUpdate("SDKPro", vm.Item).then(function (data) {
                toastr.success("储存成功");
                $(".insert-pro").removeClass("active");
                PageChange();
            })
        }
        else {
            vm.Item.CreateBy = $rootScope.User.UserNo;
            AjaxService.PlanInsert("SDKPro", vm.Item).then(function (data) {
                toastr.success("储存成功");
                $(".insert-pro").removeClass("active");
                PageChange();
            })
        }

    }

    function GetProFile()
    {
        var list = [];
        list.push({ name: "ProNo", value: vm.FileItem.ProNo });
        list.push({ name: "Version", value: vm.FileItem.Version });
        vm.promise = AjaxService.GetPlans("SDKProFile", list).then(function (data) {
            vm.ProFileList = data;
        });
    }

    function isProExists()
    {
        if (vm.Item.ProNo && vm.Item.Version) {
            var list = [];
            list.push({ name: "ProNo", value: vm.Item.ProNo });
            list.push({ name: "Version", value: vm.Item.Version });
            AjaxService.GetPlan("SDKPro", list).then(function (data) {
                vm.ProductForm.Version.$setValidity('unique', !data.ProNo);
            });
        }
    }

    function ProFileSave()
    {
        vm.ProFileList = vm.ProFileList || [];
        vm.UploadFile = vm.UploadFile || [];
        var FileList = [];
        for (var i = 0, len = vm.UploadFile.length; i < len; i++) {
            var file=vm.UploadFile[i];
            if(file.IsNew){
                FileList.push(file);
            }
        }
        for (var j = 0, len2 = vm.ProFileList.length; j < len2; j++) {
            var file = vm.ProFileList[j].File;
            FileList.push(file);
        }


        var en = angular.copy(vm.FileItem);
        en.List = JSON.stringify(FileList);
        en.TempColumns = 'List';
        vm.promise = AjaxService.ExecPlanUpload("SDKPro", "saveFile", en, vm.UploadFile, "SDKFile").then(function (data) {
            GetProFile();
            vm.UploadFile = [];
            toastr.success("储存成功");
        })
    }

    function DeleteProFile(index, item) {
        vm.ProFileList.splice(index, 1);
    }

    function DownLoad(url) {
        $window.open(url);
    }

    function ProDelete(item) {
        var en = {};
        en.ProNo = item.ProNo;
        en.Version = item.Version;
        en.CreateBy = $rootScope.User.UserNo;
        AjaxService.ExecPlan("SDKPro", "delete", item).then(function (data) {
            toastr.success("删除成功");
            PageChange();
        })
    }
}