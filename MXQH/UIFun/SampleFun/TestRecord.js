'use strict';
angular.module('app')
.controller('TestRecordCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form', '$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form, $window) {
    var vm = this;
    vm.page = { pageSize: 10, pageIndex: 1, maxSize: 10 };
    vm.DataBind = DataBind;
    vm.Ser = {};
    vm.Add = Add;
    vm.SaveInsert = SaveInsert;
    vm.Edit = Edit;
    vm.SaveEdit = SaveEdit;
    vm.OpenScan = OpenScan;
    vm.ProFile = ProFile;
    vm.ProFileSave = ProFileSave;
    vm.DeleteProFile = DeleteProFile;
    vm.Delete = Delete;
    vm.Search = Search;
    vm.DownLoad = DownLoad;
    vm.Export = Export;

    Init();
    //初始化
    function Init() {
        DataBind();
    }

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("TestRecord", "GetList", vm.page).then(function (data) {
            vm.List = data.data;
            vm.page.total = data.data1[0].Count;
        });
    }

    //查询功能
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    //导出
    function Export() {
        //vm.page.pageSize = 100000;
        //vm.promise = AjaxService.GetPlanExcel("CompleteRpt", 'GetList', vm.page).then(function (data) {
        //    $window.location.href = data.File;
        //    vm.page.pageSize = 10;
        //});
    }



    //新增
    function Add() {
        var en = {};
        en.TbName = "RDTest";
        en.ClName = "DocNo";
        en.CharName = "";
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {

            vm.NewItem = {
                DocNo: data.data[0].SN,
                CreateBy: $rootScope.User.Name,
                TestedBy: $rootScope.User.Name,
                TestedDate:new Date().toLocaleDateString()
                //Status: 0
            };
            //PK生成设定
            var snList = [{ name: "RDTest", col: "DocNo", parm: "DocNo" }];
            //SN生产
            vm.NewItem.SNColumns = JSON.stringify(snList);

            vm.IsInsert = true;
        });
    }
    //保存新增信息
    function SaveInsert() {
        if (!vm.NewItem.Remark) {
            vm.NewItem.Remark = '';
        }
        console.log(vm.NewItem);
        vm.promise = AjaxService.PlanInsert("TestRecord", vm.NewItem).then(function (data) {
            DataBind();
            toastr.success('新增成功');
            vm.IsInsert = false;
        });
    }
    //编辑
    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        item.IsEdit = true;
    }
    //保存编辑
    function SaveEdit(index) {
        var en = {};
        en.ID = vm.EditItem.ID;
        en.DocNo = vm.EditItem.DocNo;
        en.TestedBy = vm.EditItem.TestedBy;
        en.TestedDate = vm.EditItem.TestedDate;
        if (!vm.EditItem.Remark) {
            en.Remark = '';
        } else {
            en.Remark = vm.EditItem.Remark;
        }
        console.log(en);

        vm.promise = AjaxService.PlanUpdate("TestRecord", en).then(function (data) {
            DataBind();
            toastr.success('更新成功');
        });
    }

    //编辑
    function OpenScan(item) {
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open(resolve);
    }
    //弹出框
    function Open(resolve) {
        Dialog.open("TestDetailDialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }

    //删除工单
    function Delete(item) {
        //TODO:删除单据及其明细表，并校验单据是否已经被研发入库
        var en = angular.copy(item);
        en.ItemForm = undefined;
        vm.promise = AjaxService.ExecPlan("TestRecord", "Delete", { ID: en.ID }).then(function (data) {
            if (data.data[0].MsgType == '1') {
                DataBind();
                toastr.success('删除成功');
            } else {
                toastr.error('删除失败');
            }
        });
        //vm.promise = AjaxService.PlanDelete("TestRecord", en).then(function (data) {            
        //        DataBind();
        //        toastr.success('删除成功');
        //});
    }
    //附件列表
    function ProFile(item) {
        vm.FileItem = angular.copy(item);
        //GetProFile();
        $(".pro-file").addClass("active");
        GetFileList(item);
    }
    //保存文件
    function ProFileSave() {
        vm.ProFileList = vm.ProFileList || [];
        vm.UploadFile = vm.UploadFile || [];
        var FileList = [];
        for (var i = 0, len = vm.UploadFile.length; i < len; i++) {
            var file = vm.UploadFile[i];
            if (file.IsNew) {
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
        vm.promise = AjaxService.ExecPlanUpload("TPFile", "saveFile", en, vm.UploadFile, "TPFile").then(function (data) {
            console.log(data);
            vm.UploadFile = [];
            GetFileList(vm.FileItem);
            toastr.success("储存成功");
        })
    }

    function GetFileList(item) {
        var list = [];
        list.push({ name: "TestRecordID", value: item.ID });
        vm.promise = AjaxService.GetPlans("TPFile", list).then(function (data) {
            vm.ProFileList = data;
        });
    }

    function DownLoad(url) {
        $window.open(url);
    }

    function DeleteProFile(index, item) {
        vm.ProFileList.splice(index, 1);
    }

    
}
])