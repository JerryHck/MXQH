'use strict';

angular.module('app')
.controller('MesDashboardCtrl', ['$document', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($document, $scope, $http, AjaxService, toastr, $window) {
    var vm = this;
    //=============================================获取服务器值
    var NomalStyle = {
        label: { show: false, fontSize: 25 }, //拐点上显示数值
        labelLine: { show: false },
        //borderColor: 'red',  // 拐点边框颜色
        lineStyle: {
            width: 3,  // 设置线宽
            type: 'solid'  //'dotted'虚线 'solid'实线
        }
    }

    var option = {
        //backgroundColor: '#404a59',
        title: {
            //textAlign: 'right',
            text: 'MES组装生产实况',
            subtext: '时间段内生产情况',
            //textStyle: {
            //    //fontSize: 25,
            //    color: 'rgba(255, 255, 255, 0.7)'
            //}

        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            data: ['完工数', '投入数', '不良数', '维修数', '报废数']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: []
        },
        {
            type: 'category',
            boundaryGap: true,
            data: []
        }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '投入数',
                //max: 50,
                min: 0,
                splitNumber: 0,  // 设置y轴刻度间隔个数
                boundaryGap: [0.2, 0.2]
            },
            {
                name: '完工',
                type: 'value',
                scale: true,
                min: 0, // 设置y轴刻度的最小值
                //max: 15,  // 设置y轴刻度的最大值
                splitNumber: 0,  // 设置y轴刻度间隔个数
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '完工数', type: 'bar',
                xAxisIndex: 1, yAxisIndex: 1,
                // 设置小圆点消失
                // 注意：设置symbol: 'none'以后，拐点不存在了，设置拐点上显示数值无效
                //symbol: 'none',
                // 设置折线弧度，取值：0-1之间
                smooth: 0.3,
                // 设置折线上圆点大小
                symbolSize: 5,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
                //data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                data:[]
            },
            {
                name: '投入数', type: 'bar', xAxisIndex: 1, yAxisIndex: 0, data: [],
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '不良数', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
                data:[],
                smooth: 0.3,

                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '维修数', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: [],
                smooth: 0.3,

                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '报废数', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: [],
                smooth: 0.3,

                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
        ],
        color: ['#7fb115', '#5ee4e9', '#ff0000', '#c38f8f', '#0b0b0b']
    };
    var count = 11;
    var sec = 20;//取值频率

    var Con = {};
    Con.conn = "MEScon";
    Con.procName = "sp_MESProduceRangeCal";
    Con.strJson = JSON.stringify({ SECOND: sec, Count: 11 });
    AjaxService.DoBefore("GetProc", Con).then(function (data) {
        data.data.forEach(function (row) {
            option.series[0].data.push({
                value: row.FinishNum,
                label: {  show: row.FinishNum != 0, position: 'top', },
                labelLine: { show: row.FinishNum != 0 },
            });
            option.series[1].data.push({ value: row.InNum, label: { show: row.InNum != 0, position: 'top' }, labelLine: { show: row.InNum != 0 }, });
            option.series[2].data.push({ value: row.NgNum, label: { show: row.NgNum != 0 }, labelLine: { show: row.NgNum != 0 }, });
            option.series[3].data.push({ value: row.RepairNum, label: { show: row.RepairNum != 0 }, labelLine: { show: row.RepairNum != 0 }, });
            option.series[4].data.push({ value: row.DumpNum, label: { show: row.DumpNum != 0 }, labelLine: { show: row.DumpNum != 0 }, });
            option.xAxis[0].data.push(row.OpTime);
            option.xAxis[1].data.push(row.OpTime);
        })
        vm.groupData.setOption(option);
        setTimeout(function () {
            SocetGet();
        }, sec*1000)
    })


    function SocetGet() {
        var enCon = { SECOND: sec, Count: 1 };
        var en = {};
        en.Method = 'GetProc';
        en.conn = "MEScon";
        en.procName = "sp_MESProduceRangeCal";
        en.Interval = sec;
        //传送的参数字符串
        en.Json = JSON.stringify(enCon);
        AjaxService.GetServerSocket(en, "RangeCal", function (data, socket) {
            CalData(JSON.parse(data).data[0])
        });
    }



    function CalData(proData) {
        var data0 = option.series[0].data;
        var data1 = option.series[1].data;
        data0.shift();
        data0.push({
            value: proData.FinishNum,
            label: {
                show: proData.FinishNum != 0, position: 'top',  //折线上方显示数据
            }, labelLine: { show: proData.FinishNum != 0 },
        });
        data1.shift();
        data1.push({ value: proData.InNum, label: { show: proData.InNum != 0, position: 'top' }, labelLine: { show: proData.InNum != 0 }, });

        option.series[2].data.shift();
        option.series[2].data.push({ value: proData.NgNum, label: { show: proData.NgNum != 0 }, labelLine: { show: proData.NgNum != 0 }, });
        option.series[3].data.shift();
        option.series[3].data.push({ value: proData.RepairNum, label: { show: proData.RepairNum != 0 }, labelLine: { show: proData.RepairNum != 0 }, });
        option.series[4].data.shift();
        option.series[4].data.push({ value: proData.DumpNum, label: { show: proData.DumpNum != 0 }, labelLine: { show: proData.DumpNum != 0 }, });

        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(proData.OpTime);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(proData.OpTime);

        ;
        //lineHide(option)
        vm.groupData.setOption(option);
    }
}])

