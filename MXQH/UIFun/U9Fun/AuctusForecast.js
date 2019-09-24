'use strict';
angular.module('app')
.controller('AuctusForecastCtrl', ['$rootScope', '$scope', '$http', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window','Dialog',
function ($rootScope, $scope, $http,  toastr, AjaxService, Form, MyPop, $window,Dialog) {
    var vm = this;
    vm.page = { pageIndex: 1, pageSize: 12, maxSize: 10,UserName:$rootScope.User.Name};
    vm.pageDetail = { pageIndex: 1, pageSize: 12, maxSize: 10 };
    vm.Forecast = { CreatedBy: $rootScope.User.Name };
    vm.ForecastLine = {};
    vm.Lines = [];
    vm.DataBind = DataBind;//绑定数据
    vm.Search = Search;//查询功能
    vm.Add = Add;
    vm.Save = Save;
    vm.Edit = Edit;
    vm.Delete = Delete;
    vm.AddLine = AddLine;
    vm.GetDetail = GetDetail;
    vm.SaveLine = SaveLine;//保存订单行
    vm.EditLine = EditLine;//编辑订单行
    vm.DeleteLine = DeleteLine;//保存订单行
    vm.CancelLine = CancelLine;//行放弃按钮
    vm.SelectItem = SelectItem;//选择料号
    vm.DocLineNo = 0;
    vm.OpenImport = OpenImport;
    vm.Export = Export;//导出
    vm.CloseImport = CloseImport;
    vm.FileData = { header: { header: ["DocType","Customer_Name", "BusinessDate", "Remark", "Code", "Qty", "DemandDate", "DeliveryDate", "LineRemark"] }, sheetNum: 1, data: [] };
    vm.Do = Do;//导入控件Do方法
    vm.Import = Import;//导入
    //日期控件参数
    vm.DateOption = {
        format: 'Y/m',
        formatDate: 'Y/m',
        timepicker: false,
        autoclose: true,
        datepicker:true
    }
    DataBind();

    //#region 导入导出功能

    function CloseImport() {
        $(".pro-file").removeClass("active");
    }
    function OpenImport() {
        $(".pro-file").addClass("active");
    }
    function Import() {
        //导入时将表头也包含在内，表头的行号为1，在存储过程中导入时自动删除表头这一行
        var en = {};
        en.CreateBy = $rootScope.User.Name;
        en.List = JSON.stringify(vm.ImportList);
        en.TempColumns = 'List';
        vm.promise = AjaxService.ExecPlan("AuctusForecast", "Import", en).then(function (data) {
            console.log(data);
            if (data.data[0].Result == "0") {
                toastr.error('供应商名称不对！');
            } else {
                //更新功能基本信息
                DataBind();
                toastr.success('储存成功');
            }

        })
    }
    function Do() {
        vm.IsValid = true;
        vm.ImportList = angular.copy(vm.FileData.data[0]);
        vm.ImportList.splice(0, 1);
        if (!vm.ImportList[0].Remark) {
            vm.ImportList[0].Remark = '';
        }
        if (!vm.ImportList[0].LineRemark) {
            vm.ImportList[0].LineRemark = '';
        }
        if (!vm.ImportList[0].Customer_Name) {
            vm.ImportList[0].Customer_Name = '';
        }
        if (!vm.ImportList[0].DocType) {
            toastr.error('订单类型不能为空！');
            vm.IsValid = false;
            return;
        }
    }
    //导出功能
    function Export() {
        vm.promise = AjaxService.GetPlanExcel("AuctusForecast", 'GetList', vm.page).then(function (data) {
            $window.location.href = data.File;
        });
    }
    //#endregion

    //绑定数据
    function DataBind() {
        vm.promise = AjaxService.ExecPlan("AuctusForecast", "GetList", vm.page).then(function (data) {
            console.log(vm.page);
            vm.List = data.data;
            vm.page.total = data.data1[0].TotalCount;
        });
    }
    //查询
    function Search() {
        vm.page.pageIndex = 1;
        DataBind();
    }
    //新增订单
    function Add() {
        vm.Forecast = { CreatedBy: $rootScope.User.Name };
        vm.ForecastLine = {};
        vm.Lines = [];
        vm.showLineForm = false;
        vm.IsEdit = false;
    }

    //保存单据
    function Save(validForm) {
        //表单验证是否通过
        if (validForm.$invalid) {
            return;
        }
        if (vm.Lines.length == 0) {
            toastr.error("请填写订单行");
            return;
        }
        var en = {};
        var forecast = [];
        if (!vm.Forecast.Remark) {
            vm.Forecast.Remark = '';
        }
        if (!vm.Lines[0].Remark) {
            vm.Lines[0].Remark = '';
        }
        if (!vm.Forecast.Customer_Name) {
            vm.Forecast.Customer_Name = '';
        }
        vm.Forecast.ModifiedBy = $rootScope.User.Name;
        forecast.push(vm.Forecast);//单头数据
        en.TempColumns = 'Forecast,Lines';//设置参数
        en.ForeCast = JSON.stringify(forecast);
        if (vm.IsEdit) {
            en.Lines = JSON.stringify(vm.Lines);
            vm.promise = AjaxService.ExecPlan("AuctusForecast", "Update", en).then(function (data) {
                vm.pageDetail.DocNo = vm.Forecast.DocNo;
                GetDetail();
                toastr.success("修改成功");
            }).catch(function (reason) {
                toastr.success(reason);
            });
        }
        else {
            en.Lines = JSON.stringify(vm.Lines);
            vm.promise = AjaxService.ExecPlan("AuctusForecast", "Add", en).then(function (data) {
                toastr.success("添加成功");
                vm.pageDetail.DocNo = data.data[0].DocNo;
                GetDetail();          
            }).catch(function (reason) {
                toastr.warning(reason);
            });
        }
    }
    //获取单据详情
    function GetDetail() {
        vm.promise = AjaxService.ExecPlan("AuctusForecast", "Select", vm.pageDetail).then(function (data) {
            vm.pageDetail.total = data.data2[0].TotalCount;
            vm.Forecast = data.data[0];
            vm.Lines = data.data1;            
            vm.DocLineNo = vm.Lines[vm.Lines.length-1].DocLineNo;
            DataBind();
        });
    }
    //编辑单据
    function Edit(item) {
        vm.pageDetail.pageIndex = 1;
        vm.pageDetail.DocNo = item.DocNo;
        vm.IsEdit = true;
        GetDetail();        
        ChangeTabIndex(0);
    }
    //删除单据
    function Delete() {
        if (vm.Forecast.ID) {
            vm.promise = AjaxService.ExecPlan("AuctusForecast", "Delete", {ID:vm.Forecast.ID}).then(function (data) {
                vm.Forecast = { CreatedBy: $rootScope.User.Name };
                vm.Lines = [];
                DataBind();
                toastr.success("删除成功");
            })
        }
    }
    //#region 行操作
    //新增行
    function AddLine() {
        vm.showLineForm = true;
        vm.IsEditLine = false;
        vm.ForecastLine = {};
    }
    //保存行
    function SaveLine(validForm) {
        if (validForm.$invalid) {
            return;
        }
        if (vm.IsEditLine) {
            vm.showLineForm = false;
            return;
        }
        var line = angular.copy(vm.ForecastLine);
        vm.DocLineNo += 10;
        if (!line.Remark) {
            line.Remark = '';
        }
        line.DocLineNo = vm.DocLineNo;
        line.CreatedBy = $rootScope.User.Name;
        line.ModifiedBy = $rootScope.User.Name;
        vm.Lines.push(line);
        //保存行成功，清空表单
        vm.ForecastLine = {};
        vm.showLineForm = false;
    }
    function CancelLine() {
        vm.ForecastLine = {};
        vm.showLineForm = false;
    }
 
    //编辑行
    function EditLine(item) {
        vm.ForecastLine = item;
        vm.showLineForm = true;
        vm.IsEditLine = true;
    }

    //删除行
    function DeleteLine(id) {        
        vm.promise = AjaxService.ExecPlan("AuctusForecast", "DeleteLine", { ID: id }).then(function (data) {
            DataBind();
            if (vm.Forecast.ID) {
                GetDetail();
            }
            toaster.success("删除成功");
        
        });
    }
    //#endregion


    //料品信息弹出框
    function SelectItem() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("CBOItemDialog", resolve).then(function (data) {
            if (data) {
                vm.ForecastLine.Itemmaster = data.ID;
                vm.ForecastLine.Code = data.Code;
                vm.ForecastLine.Name = data.Name;
                vm.ForecastLine.SPECS = data.SPECS;
            }
        }).catch(function (reason) {

        });
    }

    //切换Tab页
    function ChangeTabIndex(index) {
        vm.tabIndex = index;
    }

}
])