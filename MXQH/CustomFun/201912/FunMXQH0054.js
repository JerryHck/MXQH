﻿'use strict';

angular.module('app')
.controller('TestCtrl', ['$document', '$scope', '$http', 'AjaxService', 'toastr', '$window',
function ($document, $scope, $http, AjaxService, toastr, $window) {

    var vm = this;
    vm.page = { index: 1, size: 12 };
    vm.Ser = {};

    vm.PageChange = PageChange;
    vm.Search = Search;
    vm.ExportExcel = ExportExcel;

    vm.groupData = ['测试栏目1','测试栏目2','测试栏目3','测试栏目4','测试栏目5','测试栏目6']; 

    function PageChange() {
        vm.promise = AjaxService.GetPlansPage("FunList", GetContition(), vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
           console.log(data.List)
            vm.page.total = data.Count;
        });

    }
    function ExportExcel() {
        vm.promise = AjaxService.GetPlanOwnExcel("FunList", GetContition()).then(function (data) {
            $window.location.href = data.File;
        });
    }
    function GetContition() {
        var list = [];
        if (vm.Ser.aFunNo) {
            list.push({ name: "FunNo", value: vm.Ser.aFunNo, tableAs:"a" });
        }
        return list;
    }

    var BsnList = [
'JDH0102',
'JDH0366',
'JDH0444',
'JDH0450',
'JDH0451',
'JDH0452',
'JDH0455',
'JDH0538',
'JDH0540',
'JDH0544',
'JDH1228',
'JDH1299',
'JDH1309',
'JDH1593',
'JDH1632',
'JDH1642',
'JDH1644',
'JDH1649',
'JDH1650',
'JDH1651',
'JDH1652',
'JDH1654',
'JDH1701',
'JDH2103',
'JDH2106',
'JDH2155',
'JDH2160',
'JDH2166',
'JDH2168',
'JDH2176',
'JDH2211',
'JDH2217',
'JDH2220',
'JDH2224',
'JDH2226',
'JDH2859',
'JDH2861',
'JDH2866',
'JDH2868',
'JDH2874',
'JDH2883',
'JDH2885',
'JDH2920',
'JDH2922',
'JDH2929',
'JDH3009',
'JDH3053',
'JDH3091',
'JDH3093',
'JDH3094',
'JDH3095',
'JDH3096',
'JDH3097',
'JDH3098',
'JDH3099',
'JDH3100',
'JDH3101',
'JDH3102',
'JDH3103',
'JDH3105',
'JDH3134',
'JDH3136',
'JDH3137',
'JDH3141',
'JDH3142',
'JDH3143',
'JDH3144',
'JDH3145',
'JDH3146',
'JDH3148',
'JDH3149',
'JDH3150',
'JDH3281',
'JDH3353',
'JDH3430',
'JDH3434',
'JDH3435',
'JDH3440',
'JDH3661',
'JDH3670',
'JDH3740',
'JDH3754',
'JDH3761',
'JDH3763',
'JDH3766',
'JDH3770',
'JDH3771',
'JDH3772',
'JDH3774',
'JDH3776',
'JDH3913',
'JDH3914',
'JDH3923',
'JDH3924',
'JDH3925',
'JDH4700',
'JDH4998',
'JDH5089',
'JDH5511',
'LA80072',
'LA80076',
'LA80083',
'LA80085',
'LA80126',
'LA80134',
'LA80148',
'LA80161',
'LA80175',
'LA80217',
'LA80227',
'LA80232',
'LA80254',
'LA80266',
'LA80270',
'LA80276',
'LA80279',
'LA80280',
'LA80281',
'LA80282',
'LA80284',
'LA80294',
'LA80297',
'LA80299',
'LA80302',
'LA80303',
'LA80304',
'LA80306',
'LA80311',
'LA80313',
'LA80316',
'LA80318',
'LA80322',
'LA80323',
'LA80344',
'LA80347',
'LA80350',
'LA80351',
'LA80353',
'LA80354',
'LA80361',
'LA80370',
'LA80371',
'LA80383',
'LA80388',
'LA80410',
'LA80412',
'LA80413',
'LA80422',
'LA80433',
'LA80443',
'LA80489',
'LA80493',
'LA80505',
'LA80509',
'LA80563',
'LA80569',
'LA80585',
'LA80611',
'LA80614',
'LA80615',
'LA80627',
'LA80629',
'LA80642',
'LA80651',
'LA80652',
'LA80658',
'LA80660',
'LA80665',
'LA80669',
'LA80679',
'LA80682',
'LA80683',
'LA80684',
'LA80688',
'LA80697',
'LA80756',
'LA80757',
'LA80777',
'LA80787',
'LA80807',
'LA80812',
'LA80848',
'LA80881',
'LA80933',
'LA81052',
'LA81070',
'LA81074',
'LA81130',
'LA81135',
'LA81137',
'LA81143',
'LA81149',
'LA81155',
'LA81173',
'LA81180',
'LA81191',
'LA81192',
'LA81209',
'LA81216',
'LA81227',
'LA81267',
'LA81284',
'LA81307',
'LA81309',
'LA81318',
'LA81345',
'LA81350',
'LA81359',
'LA81362',
'LA81370',
'LA81372',
'LA81377',
'LA81385',
'LA81405',
'LA81416',
'LA81420',
'LA81422',
'LA81443',
'LA81446',
'LA81456',
'LA81457',
'LA81506',
'LA81512',
'LA81539',
'LA81541',
'LA81546',
'LA81560',
'LA81577',
'LA81603',
'LA81606',
'LA81626',
'LA81628',
'LA81629',
'LA81645',
'LA81696',
'LA81698',
'LA81702',
'LA81742',
'LA81766',
//'LA81868',

    ]

    function Search() {
        Save(0)
        //vm.page.index = 1;
        //PageChange();
    }

    function Save(index) {
        //if (BsnList[index]) {
        //    var en = {};
        //    en.WorkOrder = "AMO-30191216027";
        //    en.InternalCode = BsnList[index];
        //    en.RoutingId = 983;
        //    //console.log(en);
        //    vm.promise = AjaxService.ExecPlan("MesMxWOrder", "save", en).then(function (data) {
        //        if (data.data[0].MsgType == 'Success') {
        //            console.log(data.data1[0]);
        //            Save(index + 1);

        //        }
        //        else if (data.data[0].MsgType == 'Error') {
        //            console.log(data.data[0]);
        //        }
        //    })
        //}

        //BsnList.forEach(function (item) {
        //    setTimeout(function () {
        //        var en = {};
        //        en.WorkOrder = "AMO-30191216027";
        //        en.InternalCode = item;
        //        en.RoutingId = 983;
        //        //console.log(en);
        //        vm.promise = AjaxService.ExecPlan("MesMxWOrder", "save", en).then(function (data) {
        //            if (data.data[0].MsgType == 'Success') {
        //                console.log(data.data1[0]);
        //            }
        //            else if (data.data[0].MsgType == 'Error') {
        //                console.log(data.data[0]);
        //            }
        //        })
        //    }, 0)
        //})

    }


    //=============================================获取服务器值
    var enCon = { SECOND: 60 };
    var en = {};
    en.Method = 'GetProc';
    en.conn = "MEScon";
    en.procName = "sp_MESProduceRangeCal";
    en.Interval = 60;
    //传送的参数字符串
    en.Json = JSON.stringify(enCon);
    AjaxService.GetServerSocket(en, "RangeCal", function (data, socket) {
        CalData(JSON.parse(data).data[0])
    })


    var NomalStyle = {
        label: { show: false, fontSize: 25 }, //拐点上显示数值
        labelLine: { show: false }, 
        borderColor:'red',  // 拐点边框颜色
        lineStyle:{                 
            width:3,  // 设置线宽
            type:'solid'  //'dotted'虚线 'solid'实线
        }
    }

    var option = {
        title: {
            text: 'MES组装生产实况',
            subtext: '时间段内生产情况'
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
            data: (function () {
                var now = new Date();
                var res = [];
                var len = 11;
                while (len--) {
                    res.push(11 - len - 1);
                }
                return res;
            })()
        },
        {
            type: 'category',
            boundaryGap: true,
            data: (function () {
                var res = [];
                var len = 11;
                while (len--) {
                    res.push(11 - len - 1);
                }
                return res;
            })()
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
                name: '完工/不良/维修',
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
                name: '完工数', type: 'line',
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
                itemStyle: {  normal: NomalStyle },
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: '投入数', type: 'bar', xAxisIndex: 1, yAxisIndex: 0, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '不良数', type: 'line', xAxisIndex: 1, yAxisIndex: 1,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                smooth: 0.3,
                
                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '维修数', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                smooth: 0.3,

                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
            {
                name: '报废数', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                smooth: 0.3,

                // 设置折线上圆点大小
                symbolSize: 3,
                // 设置拐点为实心圆
                symbol: 'circle',
                itemStyle: { normal: NomalStyle },
            },
        ],
        color: ['#2c04f9', '#527509', '#ff0000', '#c38f8f', '#0b0b0b']
    };
    var count = 11;
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
        data1.push({ value: proData.InNum, label: { show: proData.InNum != 0 }, labelLine: { show: proData.InNum != 0 }, });

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
