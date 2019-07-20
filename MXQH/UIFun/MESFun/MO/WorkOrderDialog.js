'use strict';
angular.module('app')
.controller('MesMoDialogCtrl', ['$rootScope', '$scope', 'ItemData', '$uibModalInstance', 'Dialog', 'toastr', 'AjaxService', 'Form',
function ($rootScope, $scope, ItemData, $uibModalInstance, Dialog, toastr, AjaxService, Form) {
    var vm = this;
    vm.Save = Save;
    vm.Cancel = Cancel;    
    vm.Item = ItemData;
    vm.SelectProduct = SelectProduct;
    vm.SelectCustomer = SelectCustomer;
    vm.SelectRouting = SelectRouting;
    vm.Item.ListNo = vm.Item.ListNo == undefined ? GetListNo() : vm.Item.ListNo;
    vm.GetPackInfo = GetPackInfo;
    vm.AddPack = AddPack;
    vm.EditPack = EditPack;
    vm.DeletePack = DeletePack;
    if (!vm.Item.AssemblyDate) {
        vm.Item.AssemblyDate = GetCurrentDate();
        vm.Item.DeliveryDate = GetCurrentDate();
    }
    vm.SNRule = {};//编码规则
    vm.Routing = {};//产品工艺
    vm.DateOption = {
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    };
    if (vm.Item.ID) {
        vm.IsEdit = true;
        vm.Routing.ID = vm.Item.boRoutingID;//工艺信息
        vm.Routing.RoutingName = vm.Item.RoutingName;
        vm.SNRule.TbName = vm.Item.TbName;//编码规则信息
        vm.SNRule.ClName = vm.Item.ClName;
        vm.IsEditSNRule = false;
        GetPackInfo();//获取包装信息
    } else {
        vm.IsEdit = false;
    }
    // #region 工单信息

    //自动生成计划序号
    function GetListNo() {
        var en = { TbName: "MesPlan", ClName: "Detail", CharName: null };
        AjaxService.ExecPlan("SerialNumberSet", "preview", en).then(function (data) {
            vm.Item.ListNo = data.data[0].SN;
        })
    }

    //保存
    function Save() {
        if (!vm.SNRule.TbName) {
            vm.Item.TbName = '';
        } else {
            vm.Item.TbName = vm.SNRule.TbName;
        }
        if (!vm.SNRule.ClName) {
            vm.Item.ClName = '';
        } else {
            vm.Item.ClName = vm.SNRule.ClName;
        }
        if (!vm.Routing.ID) {
            vm.Item.boRoutingID = '';
        } else {
            vm.Item.boRoutingID = vm.Routing.ID;
        }
        if (!vm.Item.CustomerOrder) {
            vm.Item.CustomerOrder = '';
        }
        if (!vm.Item.ERPSO) {
            vm.Item.ERPSO = '';
        }
        if (!vm.Item.ERPQuantity) {
            vm.Item.ERPQuantity = '';
        }
        if (!vm.Item.Remark) {
            vm.Item.Remark = '';
        }
        var en = {};
        var li = [];
        li.push(vm.Item);
        en.EntityInfo = JSON.stringify(li);
        en.TempColumns = "EntityInfo";
        if (vm.Item.ID) {//编辑操作
            vm.promise = AjaxService.ExecPlan("MesPlanDetail", "Update", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        } else {//新增操作
            var SNList = [{ name: "MesPlan", col: "Detail", parm: "ListNo", charName: null }]
            en.SNColumns = JSON.stringify(SNList);
            en.ListNo = "";
            vm.promise = AjaxService.ExecPlan("MesPlanDetail", "Add", en).then(function (data) {
                if (data.data[0].MsgType == "0") {
                    toastr.error(data.data[0].Msg);
                } else {
                    var returnData = "1";                    
                    toastr.success(data.data[0].Msg);
                    $uibModalInstance.close("1");
                }
            }).catch(function (data) {
            });
        }
    }
    //获取当前日期
    function GetCurrentDate() {        
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var day=date.getDate();
        var rq = year + "-" + month + "-" + day;
        return rq;
    }
    //关闭弹窗
    function Cancel() {
        $uibModalInstance.close("1");
    }
    //产品选择框
    function SelectProduct() {
        var resolve = {
            ItemData:function() {
                return {};
            }
        }
        Dialog.open("MesMaterialSer", resolve).then(function (data) {
            if (data.Id) {
                vm.Item.MaterialID = data.Id;
                vm.Item.MaterialCode = data.MaterialCode;
                vm.Item.MaterialName = data.MaterialName;
            }
        }).catch(function (reason) {

        });
    }

    //客户选择框
    function SelectCustomer() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("MesCustomerSer", resolve).then(function (data) {
            if (data.ID) {
                vm.Item.CustomerID = data.ID;
                vm.Item.CustomerCode = data.Code;
                vm.Item.CustomerName = data.Name;
            }
        }).catch(function (reason) {

        });
    }

    //工艺选择框
    function SelectRouting() {
        if (!vm.Item.MaterialID) {
            toastr.error("请先选择产品！");
        }
        else {
            var resolve = {
                ItemData: function () {
                    return { MaterialID: vm.Item.MaterialID };
                }
            }
            Dialog.open("MesRoutingSer", resolve).then(function (data) {
                if (data.ID) {
                    vm.Routing.ID = data.ID;
                    vm.Routing.RoutingName = data.RoutingName;
                }
            }).catch(function (reason) {

            });
        }  
    }
    // #endregion

    // #region 包装信息
    //获取包装信息
    function GetPackInfo(IsEdit) {
        //弹窗为编辑操作时，获取包装信息
        if (vm.Item.ID) {
            vm.promise = AjaxService.GetPlans("MESPackageMain", { name: 'AssemblyPlanDetailID', value: vm.Item.ID }).then(function (data) {
                vm.PackInfo = data;
                if (data.length == 0) {
                    vm.CanAddPack = false;
                } else {
                    if (IsEdit=='1') {
                        vm.Item.CustomerOrder = data[0].TransID
                    }
                    vm.CanAddPack = true;
                }
            });
        }
    }
    //新增包装信息
    function AddPack() {
        var resolve = {
            ItemData: function () {
                return { MaterialID: vm.Item.MaterialID ,MoID:vm.Item.ID};
            }
        }
        Open(resolve);
    }

    //弹出框
    function Open(resolve) {
        Dialog.open("PackDialog", resolve).then(function (data) {
            if (data == "1") {
                GetPackInfo('1');
            }
        }).catch(function (reason) {

        });
    }
    //修改包装信息
    function EditPack(item) {
        item.MoID = vm.Item.ID;
        var resolve = {
            ItemData: function () {
                return item;
            }
        }
        Open(resolve);
    }
    //删除包装信息
    function DeletePack(id) {
        vm.promise = AjaxService.ExecPlan("MESPackageMain", "Delete", { PackMainID:id }).then(function (data) {
            if (data.data[0].MsgType == '1') {
                toastr.success(data.data[0].Msg);
            } else {
                toastr.error(data.data[0].Msg);
            }
        });
    }

    // #endregion

}
])