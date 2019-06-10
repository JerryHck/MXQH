'use strict'
angular.module('app').controller('AuctusSODialogCtrl', AuctusSODialog);
AuctusSODialog.$inject = ['$rootScope','$scope', '$uibModalInstance', 'ItemData','toastr', 'AjaxService'];
function AuctusSODialog($rootScope, $scope, $uibModalInstance, ItemData, toastr, AjaxService) {
    var AuctusSODialog = this;
    AuctusSODialog.Import = Import;
    AuctusSODialog.Do = Do;
    AuctusSODialog.Cancel = Cancel;
    AuctusSODialog.FileData = { header: { header: ["Customer_Name","ProCode","ProQty","Code", "Name", "Qty", "RequireDate", "U9_DocNo", "Customer_DocNo", "HK_DocNo", "Remark", "LineRemark"] }, sheetNum: 1, data: [] };

    function Import() {
        //导入时将表头也包含在内，表头的行号为1，在存储过程中导入时自动删除表头这一行
        var en = {};
        en.CreateBy= $rootScope.User.Name;
        en.List = JSON.stringify(AuctusSODialog.List);
        en.TempColumns = 'List';        
        AuctusSODialog.promise = AjaxService.ExecPlan("AuctusSO", "Import", en).then(function (data) {
            console.log(data);
            if (data.data[0].Result == "0") {
                toastr.error('供应商名称不对！');
            } else {
                //更新功能基本信息
                toastr.success('储存成功');
            }
            
        })
    }

    function Do() {
        AuctusSODialog.IsValid = true;
        AuctusSODialog.List = angular.copy(AuctusSODialog.FileData.data[0]);
        AuctusSODialog.List.splice(0, 1);
        if (!AuctusSODialog.List[0].Remark) {
            AuctusSODialog.List[0].Remark = '';
        }
        if (!AuctusSODialog.List[0].LineRemark) {
            AuctusSODialog.List[0].LineRemark = '';
        }
        if (!AuctusSODialog.List[0].U9_DocNo) {
            AuctusSODialog.List[0].U9_DocNo = '';
        }
        if (!AuctusSODialog.List[0].HK_DocNo) {
            AuctusSODialog.List[0].HK_DocNo = '';
        }
        if (!AuctusSODialog.List[0].Name) {
            AuctusSODialog.List[0].Name = '';
        }
        for (var i = 0; i < AuctusSODialog.List.length; i++) {
            if (!AuctusSODialog.List[i].Customer_Name) {
                AuctusSODialog.IsValid = false;
                break;
            }
            if (!AuctusSODialog.List[i].Code) {
                AuctusSODialog.IsValid = false;
                break;
            }
            //if (!AuctusSODialog.List[i].Name) {
            //    AuctusSODialog.IsValid = false;
            //    break;
            //}
            if (!AuctusSODialog.List[i].Customer_Name) {
                AuctusSODialog.IsValid = false;
                break;
            }
            if (!AuctusSODialog.List[i].Qty) {
                AuctusSODialog.IsValid = false;
                break;
            }
            if (!AuctusSODialog.List[i].RequireDate) {
                AuctusSODialog.IsValid = false;
                break;
            }
            if (!AuctusSODialog.List[i].Customer_DocNo) {
                AuctusSODialog.IsValid = false;
                break;
            }
        }
        if (!AuctusSODialog.IsValid) {
            toastr.error("excel数据不全");
        }
    }

    function Cancel() {
        $uibModalInstance.close();
    }

}
