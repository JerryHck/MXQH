'use strict';
angular.module('app')
.controller('EquipCheckReportCtrl', ['$rootScope', '$scope', 'Dialog', 'toastr', 'AjaxService', 'Form','$window',
function ($rootScope, $scope, Dialog, toastr, AjaxService, Form,$window) {
    var vm = this;
    var colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655',
'#FFF263', '#6AF9C4'];
    Init();
    //初始化
    function Init() {
        vm.chart = {}
        vm.page = { pageSize: 9, pageIndex: 1, maxSize: 10 }
        vm.page2 = { pageSize: 9, pageIndex: 1, maxSize: 10 }
        Highcharts.setOptions({
            colors: colors
        })
        vm.Search = Search;
        vm.Search2 = Search2;
        vm.Export = Export;
        $("input[name='Code']").focus();
    }
   
    //查询功能
    function Search() {
        if (!vm.page.SD || !vm.page.ED) {
            toastr.error('查询时间不能为空！！！');
            return;
        }            
        vm.promise = AjaxService.ExecPlan("EquipCheck", "GetList", vm.page).then(function (data) {
            var title = { text: vm.page.SD + '-' + vm.page.ED };//标题
            var categories = [];
            for (var i = 0; i < data.data.length; i++) {
                categories.push(data.data[i].Duration);
            }
            var xAxis = { categories: categories };//x坐标轴

            var yAxis = {
                title: {
                    text: '('+data.data3[0].CheckUOMName+')'
                },
                plotLines: []
            };
            var yplotLines = [];//y轴基准线
            for (var i = 0; i < data.data2.length; i++) {
                yplotLines.push({
                    value: data.data2[i].LowerLimit,
                    dashStyle: 'Dash',
                    width: 1,
                    color: colors[i],
                    zIndex: 5
                });
                yplotLines.push({
                    value: data.data2[i].UpperLimit,
                    dashStyle: 'Dash',
                    width: 1,
                    color: colors[i],
                    zIndex: 5
                });
            }
            yAxis.plotLines = yplotLines;//y轴基准线
            //配置图表要展示的数据。每个系列是个数组，每一项在图片中都会生成一条曲线。
            var series = [];//曲线数据
            var index = 1;
            var item = { name: '', data: [] };
            for (var i = 0; i < data.data1.length; i++) {
                if (data.data1[i].Index == index) {
                    item.name = data.data1[i].Name +'['+ data.data1[i].Code+']';
                    item.data.push(data.data1[i].Record);
                } else {
                    index = data.data1[i].Index;                    
                    series.push(angular.copy(item));
                    item = { name: '', data: [] };
                    item.name = data.data1[i].Name + '[' + data.data1[i].Code + ']';
                    item.data.push(data.data1[i].Record);
                }
            }
            series.push(angular.copy(item));//
            vm.chart.title = title;
            vm.chart.xAxis = xAxis;
            vm.chart.yAxis = yAxis;
            vm.chart.series = series;
            vm.chart.legend = {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            };
            //chart.width = 550;
            //chart.height = 400;
            //chart.type = 'area';
            //chart.marginRight = 10;
            console.log(vm.chart);
            $("#container").highcharts(vm.chart);
        });
    }

    function DataBind() {
        if (!vm.page2.SD || !vm.page2.ED) {
            toastr.error('查询时间不能为空！！！');
            return;
        }
        vm.promise = AjaxService.ExecPlan("EquipCheck", "GetList", vm.page2).then(function (data) {
            vm.List = data.data1;
        });
    }

    //查询功能
    function Search2() {
        vm.page2.pageIndex = 1;
        DataBind();
    }

    function Export() {
        vm.page2.pageSize = 100000;
        vm.promise = AjaxService.GetPlanExcel("EquipCheck", 'GetList', vm.page2).then(function (data) {
            vm.page2.pageSize = 9;
            $window.location.href = data.File;
        });
    }
}
])