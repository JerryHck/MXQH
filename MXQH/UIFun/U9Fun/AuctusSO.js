'use strict';
angular.module('app')
.controller('AuctusSOCtrl', ['$rootScope', '$scope', '$http', 'Dialog', 'toastr', 'AjaxService', 'Form', 'MyPop', '$window',
function ($rootScope, $scope, $http, Dialog, toastr, AjaxService, Form, MyPop, $window) {
    var auctusSO = this;
    auctusSO.tabIndex = 0;//选中的Tab索引
    auctusSO.SO = { Operator: $rootScope.User.Name };
    auctusSO.IsAddLine = false;
    auctusSO.SOLines = [];//当前订单
    auctusSO.SOLine = {};
    auctusSO.page = { pageIndex: 1, pageSize: 10, maxSize: 10, DocNo: '', Code: '', U9_DocNo: '', Customer_DocNo: '', HK_DocNo: '' };
    auctusSO.pageDetail = { pageIndex: 1, pageSize: 10, maxSize: 10, DocNo: '', Code: '', U9_DocNo: '', Customer_DocNo: '', HK_DocNo: '', UserNo: $rootScope.User.UserNo };
    auctusSO.DataBind = DataBind;
    auctusSO.DataBindDetail = DataBindDetail;    
    auctusSO.Search = Search;
    auctusSO.SearchSO = SearchSO;
    auctusSO.List = {};
    auctusSO.Insert = Insert;
    auctusSO.Save = Save;
    auctusSO.Edit = Edit;
    auctusSO.Delete = Delete;
    auctusSO.Cancel = Cancel;
    auctusSO.SelectItem = SelectItem;//选择客户
    auctusSO.SelectSOItem = SelectSOItem;//选择客户
    auctusSO.AddSOLine = AddSOLine;//新增销售行
    auctusSO.SaveSOLine = SaveSOLine;
    auctusSO.EditSOLine = EditSOLine;
    auctusSO.DeleteSOLine = DeleteSOLine;
    auctusSO.CancelSOLine = CancelSOLine;
    auctusSO.DocLineNo = 0;
    auctusSO.Export = Export;//导出
    auctusSO.Import = Import;//导出
    DataBind();//绑定数据
    function SelectSOItem() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("CBOItemDialog", resolve).then(function (data) {
            //Dialog.open(name, resolve).then(function (data) {
            if (data) {
                auctusSO.SO.Itemmaster = data.ID;
                auctusSO.SO.Code = data.Code;
                auctusSO.SO.Name = data.Name;
                auctusSO.SO.SPECS = data.SPECS;
            }
        }).catch(function (reason) {

        });
    }
    function Import() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Dialog.open("AuctusSODialog", resolve).then(function (data) {
            DataBind();
        }).catch(function (reason) {

        });
    }
    function Export() {
        auctusSO.promise = AjaxService.GetPlanExcel("AuctusSO", 'Export', auctusSO.page).then(function (data) {
            $window.location.href = data.File;
        });
    }

    //绑定数据
    function DataBind() {
        if (!auctusSO.Code) {
            auctusSO.page.Code = '';
        }
        else {
            auctusSO.page.Code = '' + auctusSO.Code + '';
        }
        if (!auctusSO.U9_DocNo) {
            auctusSO.page.U9_DocNo = '';
        }
        else {
            auctusSO.page.U9_DocNo = '%' + auctusSO.U9_DocNo + '%';
        }
        if (!auctusSO.Customer_DocNo) {
            auctusSO.page.Customer_DocNo = '';
        }
        else {
            auctusSO.page.Customer_DocNo = '%' + auctusSO.Customer_DocNo + '%';
        }
        if (!auctusSO.HK_DocNo) {
            auctusSO.page.HK_DocNo = '';
        }
        else {
            auctusSO.page.HK_DocNo = '%' + auctusSO.HK_DocNo + '%';
        }
        auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "GetList", auctusSO.page).then(function (data) {
            auctusSO.List = data.data;
            auctusSO.page.total = data.data1[0].TotalCount
        });
    }


    //查询--列表
    function Search() {
        auctusSO.page.pageIndex = 1;
        DataBind()
    }

    //查询--详情
    function SearchSO() {
        ChangeTabIndex(1);
    }
    //新增销售订单
    function Insert() {
        auctusSO.IsEdit = false;
        auctusSO.SO = {};
        auctusSO.SO.Operator = $rootScope.User.Name;
        auctusSO.SO.CreateBy = $rootScope.User.Name;
        auctusSO.SO.ModifyBy = $rootScope.User.Name;
        auctusSO.SOLines = [];
        auctusSO.IsAddLine = false;
    }
    //保存按钮
    function Save(validForm) {
        if (validForm.$invalid) {
            return;
        }
        if (auctusSO.SOLines.length == 0) {
            toastr.error("请填写订单行");
            return;
        }
        var en = {};
        var so = [];
        if (!auctusSO.SO.Remark) {
            auctusSO.SO.Remark = '';
        }
        if (!auctusSO.SO.CreateBy) {
            auctusSO.SO.CreateBy = $rootScope.User.Name;
        }
        auctusSO.SO.ModifyBy = $rootScope.User.Name;
        auctusSO.SO.Customer_Code = '';
        so.push(auctusSO.SO);
        en.SO = JSON.stringify(so);
        en.TempColumns = 'SO,SOLines';
        if (auctusSO.IsEdit) {
            for (var i = 0; i < auctusSO.SOLines.length; i++) {
                var sl = angular.copy(auctusSO.SOLines[i]);
                if (!sl.IsAdd) {
                    sl.IsAdd = false;
                }
            }
            en.SOLines = JSON.stringify(auctusSO.SOLines);
            auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Update", en).then(function (data) {
                toastr.success("修改成功");
                auctusSO.pageDetail.DocNo = auctusSO.SO.DocNo;
                auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Select", auctusSO.pageDetail).then(function (data) {
                    auctusSO.pageDetail.total = data.data2[0].TotalCount;
                    auctusSO.SO = data.data[0];
                    auctusSO.SOLines = data.data1;
                    auctusSO.IsAddLine = false;
                    DataBind();
                });
            }).catch(function (reason) {
                toastr.success(reason);
            });
        }
        else {
            en.SOLines = JSON.stringify(auctusSO.SOLines);
            auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Add", en).then(function (data) {
                toastr.success("添加成功");
                auctusSO.pageDetail.DocNo = data.data[0].DocNo;
                auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Select", auctusSO.pageDetail).then(function (data) {
                    auctusSO.pageDetail.total = data.data2[0].TotalCount;
                    auctusSO.SO = data.data[0];
                    auctusSO.SOLines = data.data1;
                    auctusSO.IsAddLine = false;
                    DataBind();
                });
            }).catch(function (reason) {
                toastr.success(reason);
            });
        }
    }

    //编辑销售订单
    function Edit(item) {
        auctusSO.IsEdit = true;
        ChangeTabIndex(0);
        auctusSO.pageDetail.pageIndex = 1;
        auctusSO.pageDetail.DocNo = item.DocNo;
        auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Select", auctusSO.pageDetail).then(function (data) {
            auctusSO.pageDetail.total = data.data2[0].TotalCount;
            auctusSO.SO = data.data[0];
            auctusSO.SO.Qty = parseInt(auctusSO.SO.Qty);
            auctusSO.SOLines = data.data1;
            auctusSO.DocLineNo = parseInt(auctusSO.SOLines[auctusSO.SOLines.length - 1].DocLineNo)
            auctusSO.IsAddLine = false;
        });
    }

    function DataBindDetail() {
        auctusSO.IsEdit = true;
        auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Select", auctusSO.pageDetail).then(function (data) {
            auctusSO.pageDetail.total = data.data2[0].TotalCount;
            auctusSO.SO = data.data[0];
            auctusSO.SO.Qty = parseInt(auctusSO.SO.Qty);
            auctusSO.SOLines = data.data1;
            auctusSO.DocLineNo = parseInt(auctusSO.SOLines[auctusSO.SOLines.length - 1].DocLineNo)
            auctusSO.IsAddLine = false;
        });

    }

    function Delete() {
        if (auctusSO.SO.ID) {
            var en = {};
            en.ID = auctusSO.SO.ID;
            auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Delete", en).then(function (data) {
                toastr.success("删除成功！");
                auctusSO.SO = {};
                auctusSO.SOLines = [];
                auctusSO.DocLineNo = 0;
                DataBind();
            });
        }
    }
    //打开弹窗
    function Open(type,name, resolve) {
        Dialog.open("CBOItemDialog", resolve).then(function (data) {
        //Dialog.open(name, resolve).then(function (data) {
            if (data) {
                auctusSO.SOLine.Itemmaster = data.ID;
                auctusSO.SOLine.Code = data.Code;
                auctusSO.SOLine.Name = data.Name;
                auctusSO.SOLine.SPECS = data.SPECS;
            }
        }).catch(function (reason) {

        });        
    }
    //选择料品信息
    function SelectItem() {
        var resolve = {
            ItemData: function () {
                return {};
            }
        }
        Open("I", "CBOItemDialog", resolve)
    }

    //删除销售订单
    function DeleteSOLine(id) {
        var en = {};
        en.ID = id;
        auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "DeleteLine", en).then(function (data) {
            toastr.success("删除成功！");
            auctusSO.pageDetail.DocNo = auctusSO.SO.DocNo;
            auctusSO.promise = AjaxService.ExecPlan("AuctusSO", "Select", auctusSO.pageDetail).then(function (data) {
                auctusSO.pageDetail.total = data.data2[0].TotalCount;
                auctusSO.SO = data.data[0];
                auctusSO.SOLines = data.data1;
                auctusSO.IsAddLine = false;
                DataBind();
            });
        });
    }
    //添加订单行
    function AddSOLine() {
        auctusSO.IsAddLine = true;
        auctusSO.SOLine.IsAdd = true;
    }
    //保存销售订单行
    function SaveSOLine(validForm) {
        if (validForm.$invalid) {
            return;
        }
        if (!auctusSO.SOLine.Remark) {
            auctusSO.SOLine.Remark = '';
        }
        if (!auctusSO.SOLine.CreateBy) {
            auctusSO.SOLine.CreateBy = $rootScope.User.Name;
        }
        if (!auctusSO.SOLine.U9_DocNo) {
            auctusSO.SOLine.U9_DocNo = '';
        }
        if (!auctusSO.SOLine.HK_DocNo) {
            auctusSO.SOLine.HK_DocNo = '';
        }
        var soline = angular.copy(auctusSO.SOLine);
        if (soline.IsAdd) {//新增
            auctusSO.DocLineNo = auctusSO.DocLineNo + 10;
            soline.DocLineNo = auctusSO.DocLineNo;
            auctusSO.SOLines.push(soline);
            auctusSO.SOLine = {};
            auctusSO.IsAddLine = false;
        }
        else {//编辑
            auctusSO.SOLine = {};
            auctusSO.IsAddLine = false;
        }

    }
    //编辑订单行
    function EditSOLine(item) {
        auctusSO.IsAddLine = true;
        auctusSO.SOLine = item;
        auctusSO.SOLine.Qty = parseInt(auctusSO.SOLine.Qty);
        auctusSO.SOLine.IsAdd = false;
    }
    //放弃按钮
    function Cancel() {
        auctusSO.IsEdit = false;
        auctusSO.IsAddLine = false;
        auctusSO.SOLine = {};
        auctusSO.SOLines = [];
        auctusSO.SO = { Operator: $rootScope.User.Name };
    }
    //放弃订单行
    function CancelSOLine() {
        auctusSO.IsAddLine = false;
        auctusSO.SOLine = {};
    }
    //切换Tab页
    function ChangeTabIndex(index) {
        auctusSO.tabIndex = index;
    }
}
])