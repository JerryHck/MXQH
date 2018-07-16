'use strict';

angular.module('app')
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'i18nService',
function ($scope, $http, Dialog, AjaxService, toastr, i18nService) {

    var vm = this;
    i18nService.setCurrentLang('zh-cn');

    getPage(0, 10);

    vm.gridOptions = {
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: { fontSize: 9 },
        exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
        exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        exporterPdfFooter: function (currentPage, pageCount) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
            return docDefinition;
        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'myFile.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //分页按钮事件
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                if (getPage) {
                    getPage(newPage, pageSize);
                }
            });
        }
    };
         
    function getPage (curPage, pageSize) {
        var firstRow = (curPage - 1) * pageSize;

       vm.promise =  AjaxService.GetPlansPage("Sign", undefined, firstRow, firstRow + pageSize).then(function (data) {
            vm.gridOptions.data = data.List;
            vm.gridOptions.totalItems = data.Count;
        });
    };
    

    vm.gridOptions.columnDefs = [
            { name: 'SIGN_SN', displayName: '编辑', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="edit(row.entity)" >Edit</button> ' },
            { field: 'SIGN_SN', displayName: 'SIGN_SN' },
            { field: 'SIGN_EMP', displayName: 'SIGN_EMP' },
            { field: 'SIGN_ORG', displayName: 'SIGN_ORG' },
            { field: 'SIGN_MEMO', displayName: 'SIGN_MEMO' },

    ]

}
]);