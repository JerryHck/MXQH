'use strict';

angular.module('app', ['ui.grid', 'ui.grid.autoResize'])
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'i18nService',
function ($scope, $http, Dialog, AjaxService, toastr, i18nService) {

    var vm = this;
    i18nService.setCurrentLang('zh-cn');

    vm.gridOptions = {
        
        enablePagination: true, //是否分页，默认为true
        enablePaginationControls: true, //使用默认的底部分页
        paginationPageSizes: [14, 28, 50], //每页显示个数可选项
        paginationCurrentPage: 1, //当前页码
        paginationPageSize: 14, //每页显示个数
        //paginationTemplate:"<div></div>", //自定义底部分页代码
        totalItems: 0, // 总数量
        useExternalPagination: true,//是否使用分页按钮


        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: { fontSize: 8 },
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
            vm.gridOptions.totalItems = data.Count;
            vm.gridOptions.data = data.List;
            console.log(vm.gridOptions.totalItems)
        });
    };
    
    getPage(1, vm.gridOptions.paginationPageSize);

    vm.gridOptions.columnDefs = [
            { name: 'SIGN_SN', displayName: '编辑', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="edit(row.entity)" >Edit</button> ' },
            { field: 'SIGN_SN', displayName: 'SIGN_SN' },
            { field: 'SIGN_EMP', displayName: 'SIGN_EMP' },
            { field: 'SIGN_ORG', displayName: 'SIGN_ORG' },
            { field: 'SIGN_MEMO', displayName: 'SIGN_MEMO' },

    ]
    vm.gridStyle = function () { return { height: $(document.body).height() * 0.68 + 'px' }; }
}
]);