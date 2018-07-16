'use strict';

angular.module('app')
.controller('UserCtrl', ['$scope', '$http', 'Dialog', 'AjaxService', 'toastr', 'i18nService',
function ($scope, $http, Dialog, AjaxService, toastr, i18nService) {

    var vm = this;
    i18nService.setCurrentLang('zh-cn');

    vm.gridOptions = {
        enableSorting: true, //是否排序
        useExternalSorting: false, //是否使用自定义排序规则
        enableGridMenu: true, //是否显示grid 菜单
        showGridFooter: true, //是否显示grid footer
        enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar : 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
                
        //-------- 分页属性 ----------------
        enablePagination: true, //是否分页，默认为true
        enablePaginationControls: true, //使用默认的底部分页
        paginationPageSizes: [10, 15, 20], //每页显示个数可选项
        paginationCurrentPage:1, //当前页码
        paginationPageSize: 10, //每页显示个数
        //paginationTemplate:"<div></div>", //自定义底部分页代码
        totalItems : 0, // 总数量
        useExternalPagination: true,//是否使用分页按钮
                
           
        //----------- 选中 ----------------------
        enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
        enableFullRowSelection : true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
        enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
        enableRowSelection : true, // 行选择是否可用，默认为true;
        enableSelectAll : true, // 选择所有checkbox是否可用，默认为true; 
        enableSelectionBatchEvent : true, //默认true
        isRowSelectable: function(row){ //GridRow
            if(row.entity.age > 45){
                row.grid.api.selection.selectRow(row.entity); // 选中行
            }
        },
        modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
        multiSelect: false ,// 是否可以选择多个,默认为true;
        noUnselect: false,//默认false,选中后是否可以取消选中
        selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；
                
        //--------------导出----------------------------------
        exporterAllDataFn: function(){
            return getPage(1,$scope.gridOptions.totalItems);
        },
        exporterCsvColumnSeparator: ',',
        exporterCsvFilename:'download.csv',
        exporterFieldCallback : function ( grid, row, col, value ){
            if ( value == 50 ){
                value = "可以退休";
            }
            return value;
        },
        exporterHeaderFilter :function( displayName ){ 
            return 'col: ' + name; 
        },
        exporterHeaderFilterUseName : true,
        exporterMenuCsv : true,
        exporterMenuLabel : "Export",
        exporterMenuPdf : true,
        exporterOlderExcelCompatibility : false,
        exporterPdfCustomFormatter : function ( docDefinition ) {
            docDefinition.styles.footerStyle = { bold: true, fontSize: 10 };
            return docDefinition;
        },
        exporterPdfFooter :{ 
            text: 'My footer', 
            style: 'footerStyle' 
        },
        exporterPdfDefaultStyle : {
            fontSize: 11,font:'simblack' //font 设置自定义字体
        },
        exporterPdfFilename:'download.pdf',
        /* exporterPdfFooter : {
         columns: [
           'Left part',
           { text: 'Right part', alignment: 'right' }
         ]
        }, 
        或 */
        exporterPdfFooter: function(currentPage, pageCount) { 
            return currentPage.toString() + ' of ' + pageCount; 
        },
        exporterPdfHeader : function(currentPage, pageCount) { 
            return currentPage.toString() + ' of ' + pageCount; 
        },
        exporterPdfMaxGridWidth : 720,
        exporterPdfOrientation : 'landscape',//  'landscape' 或 'portrait' pdf横向或纵向
        exporterPdfPageSize : 'A4',// 'A4' or 'LETTER' 
        exporterPdfTableHeaderStyle : {
            bold: true,
            fontSize: 12,
            color: 'black'
        },
        exporterPdfTableLayout : null,
        exporterPdfTableStyle: {
            margin: [0, 5, 0, 15]
        },
        exporterSuppressColumns : ['buttons'],
        exporterSuppressMenu: false,
 
        //---------------api---------------------
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            //分页按钮事件
            gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                if(getPage) { 
                    getPage(newPage, pageSize); 
                }
            });
            ////行选中事件
            //$scope.gridApi.selection.on.rowSelectionChanged($scope,function(row,event){
            //    if(row){
            //        $scope.testRow = row.entity;
            //    }
            //});
        }
    };
         
    getPage(0, 10);
    function getPage (curPage, pageSize) {
        var firstRow = (curPage - 1) * pageSize;

        AjaxService.GetPlansPage("U9Test", undefined, firstRow, firstRow + pageSize).then(function (data) {
            vm.gridOptions.data = data.List;
            vm.gridOptions.totalItems = data.Count;
        });
    };
    

    vm.gridOptions.columnDefs = [
            { name: 'Id', displayName: '编辑', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="edit(row.entity)" >Edit</button> '},
            { field: 'Code', displayName: '料号' },
            { field: 'Name', displayName: '名称' },
            { field: 'Org', displayName: '名称' },

    ]

}
]);