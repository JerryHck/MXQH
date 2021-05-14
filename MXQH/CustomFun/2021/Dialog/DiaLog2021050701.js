'use strict';

angular.module('AppSet')
.controller('BomMateSoftVerDialogCtrl', ['$scope', 'ItemData', '$uibModalInstance', 'Form', 'AjaxService', 'toastr', '$window',
function ($scope, ItemData, $uibModalInstance, Form, AjaxService, toastr, $window) {

    var vm = this;
    vm.form = Form[ItemData.Code ? 1 : 0];    vm.Item = angular.copy(ItemData);;
    vm.Save = Save;
    vm.Cancel = Cancel;
    vm.ChangeMate = ChangeMate;
    vm.Insert = Insert;
    vm.SaveInsert = SaveInsert;
    vm.IsVerNewExists = IsVerNewExists;
    vm.Edit = Edit;
    vm.SaveEdit = SaveEdit;
    vm.DownLoad = DownLoad;
    vm.OKSign = OKSign;
    vm.IsVerExists = IsVerExists;

    if (ItemData.Code) {
        ChangeMate()
    }

    function Insert() {
        //验证数据
        AjaxService.GetPlan("BomMateSoftVer", [{ name: "Code", value: vm.Item.Code }, { name: "IsConfirm", value: false }]).then(function (data) {
            if (data.ID) {
                toastr.error('已有一新的未确认版本，不允许再添加新版本');
            }
            else {
                vm.NewItem = { ID: -1 };
                vm.IsInsert = true;
            }
        })
    }

    function SaveInsert() {
        SoftMateVerSave(vm.NewItem);
    }


    function Edit(item) {
        for (var i = 0, len = vm.List.length; i < len; i++) {
            vm.List[i].IsEdit = false;
        }
        vm.EditItem = angular.copy(item);
        vm.EditItem.SDK = vm.EditItem.File;
        vm.NowItem = item;
        item.IsEdit = true;
    }

    function SaveEdit(index) {
        SoftMateVerSave(vm.EditItem)
    }

    function ChangeMate() {
        //获取料号信息
        AjaxService.GetPlan("U9CBOItemMaster", [{ name: "Code", value: vm.Item.Code }, { name: "Org", value: 1001708020000209 }]).then(function (data) {
            vm.Item.Name = data.Name;
            vm.Item.SPECS = data.SPECS;
            GetMateSoftVer();
        })
    }

    function GetMateSoftVer() {
        //获取该料之前的软件版本
        AjaxService.GetPlans("BomMateSoftVer", { name: "Code", value: vm.Item.Code }).then(function (data2) {
            vm.IsInsert = false;
            vm.List = data2;
        })
    }


    function SoftMateVerSave(item) {
        //相关文件
        var FileList = []; var AttachSn = item.AttachSn;
        if (item.SDK) {
            FileList.push(item.SDK);
            AttachSn = item.SDK.AttachSn;
            //删除无效文件
            if (item.File && item.File.AttachSn) {
                if (item.File.AttachSn != item.SDK.AttachSn) {
                    item.File.IsDelete = true;
                    FileList.push(item.File);
                }
            }
        }

        var en = {};
        en.ID = item.ID;
        en.Code = vm.Item.Code;
        en.Name = vm.Item.Name;
        en.SPECS = vm.Item.SPECS;
        en.SoftVersion = item.SoftVersion;
        en.AttachSn = AttachSn;
        en.Remark = item.Remark;

        en.List = JSON.stringify(FileList);
        en.TempColumns = 'List';
        vm.promise = AjaxService.ExecPlanUpload("BomMateSoftVer", "saveVer", en, FileList, "MateSoft").then(function (data) {
            GetMateSoftVer();
            toastr.success("储存成功");
        })
    }

    function OKSign(item) {
        var en = {};
        en.SoftID = item.ID;
        en.ID = item.ID;
        en.Code = item.Code;
        en.ItemType = "COM";
        vm.promise = AjaxService.GetProc("U9con", "Cust_AuctusSyncItemSoftwareDateFrom", en).then(function (data) {
            
            vm.promise = AjaxService.ExecPlan("BomMateSoftVer", "confirm", en).then(function (data) {
                if (data.data[0].MsgType == 'Error') {
                    console.log(data)
                    toastr.error(data.data[0].MsgText);
                }
                else if (data.data[0].MsgType == 'Success') {
                    //更新工单bom
                    toastr.success("确认成功");
                    GetMateSoftVer();
                }
            })
        });
    }

    function IsVerExists(item) {
        if (item.SoftVersion != vm.EditItem.SoftVersion) {
            var list = [];
            list.push({ name: "Code", value: vm.Item.Code });
            list.push({ name: "SoftVersion", value: vm.NewItem.SoftVersion });
            AjaxService.GetPlan("BomMateSoftVer", list).then(function (data) {
                item.ItemForm.item_Version.$setValidity('unique', !data.Code);
            });
        }
    }

    function IsVerNewExists() {
        var list = [];
        list.push({ name: "Code", value: vm.Item.Code });
        list.push({ name: "SoftVersion", value: vm.NewItem.SoftVersion });
        AjaxService.GetPlan("BomMateSoftVer", list).then(function (data) {
            vm.InsertForm.Version.$setValidity('unique', !data.Code);
        });
    }

    function Save() {
        if (vm.form.index==0) {
            vm.promise = AjaxService.PlanInsert("BomMateSoftVer", vm.Item).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(vm.Item);
            });
        }
        else {
            var en = {};
            en.Code = vm.Item.Code;
            en.Name = vm.Item.Name;
            vm.promise = AjaxService.PlanUpdate("BomMateSoftVer", en).then(function (data) {
                toastr.success('储存成功');
                $uibModalInstance.close(en);
            });
        }
    };

    function DownLoad(url) {
        $window.open(url);
    }

    function Cancel() {
        $uibModalInstance.dismiss('cancel');
    }

}]);
