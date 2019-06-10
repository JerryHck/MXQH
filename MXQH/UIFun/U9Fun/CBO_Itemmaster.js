'use strict'
angular.module('app').controller('CBOItemCtrl', CBOItemDialog);
CBOItemDialog.$inject = ['$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService'];
function CBOItemDialog($scope, $uibModalInstance, Form, ItemData, toastr, AjaxService) {
    var CBOItem = this;
    CBOItem.page = { pageIndex: 1, pageSize: 10, maxSize: 10, Code: '', Name: '' };
    CBOItem.DataBind = DataBind;
    CBOItem.Search = Search;
    CBOItem.Select = Select;
    CBOItem.Cancel = Cancel;
    DataBind();

    //数据绑定
    function DataBind() {
        var list2 = [];
        if (CBOItem.page.Code) {            
            list2.push({ name: "Code", value: '%'+CBOItem.page.Code+'%' });
        }
        if (CBOItem.page.Name) {
            list2.push({ name: "Name", value: '%' + CBOItem.page.Name + '%' });
        }
        CBOItem.promise = AjaxService.GetPlansPage("CBO_Itemmaster", list2, CBOItem.page.pageIndex, CBOItem.page.pageSize).then(function (data) {
            CBOItem.List = data.List;
            CBOItem.page.total = data.Count
        });
    }

    //查询
    function Search() {
        CBOItem.page.pageIndex = 1;
        DataBind();
    }

    function Select(item) {
        $uibModalInstance.close(item);
    }
    function Cancel() {        
        $uibModalInstance.close();
    }
}
