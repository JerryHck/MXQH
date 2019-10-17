'use strict';
angular.module('app')
.controller('SysJobSettingCtrl', ['$scope', '$rootScope', 'toastr', 'AjaxService',
function ($scope, $rootScope, toastr, AjaxService) {

    var vm = this;

    vm.Ser = {};
    vm.Item = {};
    vm.page = { index: 1, size: 12 };
    vm.DeleteFile = [];
    vm.isEdit = false;

    vm.Week = { Table: "BasicData", Column: "Week" };
    vm.MethodType = { Table: "Sys_JobSet", Column: "MethodType" };
    vm.JobType = { Table: "Sys_JobSet", Column: "JobType" };
    vm.Unit = { Table: "Sys_JobSet", Column: "Unit" };
    vm.RepeatType = { Table: "Sys_JobSet", Column: "RepeatType" };
    
    vm.NextOption = {
        mask: new Date(),
        minDate: new Date(),
        defaultDate: new Date(),
        //formatTime: 'H:i:s',
        step: 1
    };
    vm.StartOption = {
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
        minDate: new Date(), // yesterday is minimum date
    };
    vm.TimeOption = {
        datepicker: false,
        format: 'H:i',
        step: 1
    };
    vm.NowDate = new Date().Format("yyyy-MM-dd");

    vm.EnChange = EnChange;
    vm.ToEnChange = ToEnChange;
    vm.JobSave = JobSave;
    vm.Search = Search;
    vm.JobEdit = JobEdit;
    vm.Insert = Insert;
    vm.isJobExists = isJobExists;
    vm.JobDelete = JobDelete;
    vm.SerLog = SerLog;
    vm.checkToday = checkToday;

    AjaxService.GetPlans("PlanEntity").then(function (data) {
        vm.EnList = data;
        vm.ToEnList = data;
    });
    //监控值变化
    $scope.$watch(function () { return vm.Item.MethodType; }, function () { EnChange(true) });
    
    Search()
    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function Insert() {
        vm.isEdit = false;
        vm.isCopy = false;
        vm.Item = {
            IsStart: true, JobType: 'R', RepeatType: 'D', FrequencyUnit: 'D', MethodType: 'SrcExePlan',
            NextRunTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            StartDate: new Date().Format("yyyy-MM-dd"),
            DayFreUnit:'F'
        };
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.ProNo) {
            list.push({ name: "JobName", value: vm.Ser.JobName });
        }
        vm.promise = AjaxService.GetPlansPage("JobSet", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function EnChange(cha) {
        var en = { name: "EntityName", value: vm.Item.JobExecMethod || "-1" };
        if (!cha) { vm.Item.EnProShortName = undefined; }
        AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
            vm.ShortList = data;
        });
        vm.ToEnList = [];
        //计算迁移数据库来源
        if (vm.Item.MethodType && vm.Item.MethodType.indexOf("To") != -1) {
            var conn = "";
            for (var i = 0, len = vm.EnList.length; i < len; i++) {
                if (vm.EnList[i].EntityName == vm.Item.JobExecMethod) {
                    conn = vm.EnList[i].ConnectName; break;
                }
            }
            for (var j = 0, len = vm.EnList.length; j < len; j++) {
                if (vm.EnList[j].ConnectName != conn) {
                    vm.ToEnList.push(vm.EnList[j]);
                }
            }
        }
    }

    function ToEnChange(cha) {
        var en = { name: "EntityName", value: vm.Item.ToPlanName || "-1" };
        if (!cha) { vm.Item.ToPlanShort = undefined; }
        AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
            vm.ToShortList = data;
            console.log(data);
        });
    }

    function JobEdit(item) {
        vm.Item = item;
        vm.Item.IntervalWeekList = [];

        var list = vm.Item.IntervalWeek.split(',');
        for (var i = 0, len = list.length; i < len; i++) {
            vm.Item.IntervalWeekList.push(list[i]);
        }
        EnChange(true);
        if (vm.Item.MethodType.indexOf("To") != -1) {
            ToEnChange(true);
        }
        vm.isEdit = true;
        vm.isCopy = false;
        $(".insert-job").addClass("active");
    }

    //查看日志
    function SerLog(item) {
        vm.promise = AjaxService.GetPlansTop("JobRunLog", { name: "JobName", value: item.JobName }, 300).then(function (data) {
            vm.SerItem = item;
            vm.SerList = data;
            $(".ser-job-log").addClass("active");
        })
    }

    function JobSave() {

        if (vm.Item.JobType == 'O') {
            var d = new Date(vm.Item.NextRunTime);
            vm.Item.JobDesc = '在' + d.Format("yyyy-MM-dd hh:mm:ss") + "执行方法[" + vm.Item.JobExecMethod + "]一次";
            //vm.Item.JobDesc = '在' + vm.Item.NextRunTime.toLocaleTimeString() + "执行一次";
        }
        else {
            vm.Item.JobDesc = '在每' + vm.Item.Interval;
            switch (vm.Item.RepeatType) {
                //每天
                case 'D':
                    vm.Item.JobDesc += '天' + (vm.Item.DayType == 'O' ? '的 ' + vm.Item.DayOneTime + ' 执行一次': 
                        "每 " + vm.Item.DayInterval + " " + convertToUnit(vm.Item.DayFreUnit) + " 重复执行 ");
                    break;
                //每周
                case 'W':
                    var enWeek = ListToStr(vm.Item.IntervalWeekList);
                    vm.Item.IntervalWeek = enWeek.s;
                    vm.Item.JobDesc += '周的 ' + enWeek.name  + (vm.Item.DayType == 'O' ? '的 ' + vm.Item.DayOneTime + ' 执行一次' :
                        " 每 " + vm.Item.DayInterval + " " + convertToUnit(vm.Item.DayFreUnit) + " 重复执行");;
                    break;
                //每月
                case 'M':
                    vm.Item.JobDesc += '月的第' + vm.Item.IntervalMonth + '天' + (vm.Item.DayType == 'O' ? '的 ' + vm.Item.DayOneTime + ' 执行一次' :
                        "每 " + vm.Item.DayInterval + " " + convertToUnit(vm.Item.DayFreUnit) + " 重复执行");
                    break;
            }
            vm.Item.JobDesc += '，从' + new Date(vm.Item.StartDate).Format("yyyy-MM-dd") + "开始";
            vm.Item.JobDesc += vm.Item.NoEndDate ? "一直执行。" : ("到" + new Date(vm.Item.EndDate).Format("yyyy-MM-dd") + "结束。");
        }

        if (vm.isEdit) {
            AjaxService.PlanUpdate("JobSetting", vm.Item).then(function (data) {
                toastr.success("储存成功");
                Reflash(vm.Item.JobName);
                $(".insert-job").removeClass("active");
                PageChange();
            })
        }
        else {
            vm.Item.CreateBy = $rootScope.User.UserNo;
            AjaxService.PlanInsert("JobSetting", vm.Item).then(function (data) {
                toastr.success("储存成功");
                Reflash(vm.Item.JobName);
                $(".insert-job").removeClass("active");
                PageChange();
            })
        }
    }

    function ListToStr(list) {
        var en = {};
        en.s = '';
        en.name = '';
        for (var i = 0, len = list.length; i < len; i++) {
            en.s += list[i] + ',';
            en.name += convertToweek(list[i]) + " ";
        }
        en.s = en.s.TrimEnd(',');
        return en;
    }

    function convertToweek(s) {
        if(s == 1) return '星期天';
        if(s == 2) return '星期一';
        if(s == 3) return '星期二';
        if(s == 4) return '星期三';
        if(s == 5) return '星期四';
        if(s == 6) return '星期五';
        if(s == 7) return '星期六';
    }

    function convertToUnit(s) {
        if (s == "S") return '秒';
        if (s == "M") return '分钟';
        if (s == "H") return '小时';
    }

    function isJobExists() {
        if (vm.Item.JobName) {
            var list = [];
            console.log(vm.Item)
            list.push({ name: "JobName", value: vm.Item.JobName });
            AjaxService.GetPlan("JobSetting", list).then(function (data) {
                vm.JobForm.JobName.$setValidity('unique', !data.JobName);
            });
        }
    }

    function JobDelete(item) {
        AjaxService.PlanDelete("JobSetting", item).then(function (data) {
            toastr.success("删除成功");
            Reflash(item.JobName);
            PageChange();
        })
    }

    //验证是否今天
    function checkToday(ts) {
        var d = new Date(ts);
        return vm.NowDate == d.Format("yyyy-MM-dd");
    }

    function Reflash(name) {
        var en = {};
        en.JobName = name;
        AjaxService.DoBefore("ReflashJob", en);
    }
}
]);