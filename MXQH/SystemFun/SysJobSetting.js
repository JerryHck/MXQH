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
    vm.TimeOption = {
        datepicker: false,
        format: 'H:i',
        step: 1
    };

    vm.EnChange = EnChange;

    vm.JobSave = JobSave;
    vm.Search = Search;
    vm.JobEdit = JobEdit;
    vm.Insert = Insert;
    vm.isProExists = isProExists;
    vm.JobDelete = JobDelete;

    AjaxService.GetPlans("PlanEntity").then(function (data) {
        vm.EnList = data;
    });

    

    Search()
    function Search() {
        vm.page.index = 1;
        PageChange()
    }

    function Insert() {
        vm.isEdit = false;
        vm.isCopy = false;
        vm.Item = {
            IsStart: true, JobType: 'R', RepeatType: 'D', FrequencyUnit: 'D', MethodType: 'PlanExec',
            NextRunTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            StartDate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            DayFreUnit:'F'
        };
    }

    function PageChange() {
        var list = [];
        if (vm.Ser.ProNo) {
            list.push({ name: "JobName", value: vm.Ser.JobName });
        }
        vm.promise = AjaxService.GetPlansPage("JobSetting", list, vm.page.index, vm.page.size).then(function (data) {
            vm.List = data.List;
            vm.page.total = data.Count;
        });
    }

    function EnChange() {
        var en = { name: "EntityName", value: vm.Item.JobExecMethod || "-1" };
        AjaxService.GetPlans("EntityProcedure", en).then(function (data) {
            vm.ShortList = data;
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

        vm.isEdit = true;
        vm.isCopy = false;
        $(".insert-job").addClass("active");
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
        }

        if (vm.isEdit) {
            vm.Item.ModifyBy = $rootScope.User.UserNo;
            vm.Item.ModifyDate = new Date();
            AjaxService.PlanUpdate("JobSetting", vm.Item).then(function (data) {
                toastr.success("储存成功");
                $(".insert-job").removeClass("active");
                PageChange();
            })
        }
        else {
            vm.Item.CreateBy = $rootScope.User.UserNo;
            AjaxService.PlanInsert("JobSetting", vm.Item).then(function (data) {
                toastr.success("储存成功");
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
        if (s == "F") return '分钟';
        if (s == "H") return '小时';
    }

    function isProExists() {
        if (vm.Item.ProNo && vm.Item.Version) {
            var list = [];
            list.push({ name: "ProNo", value: vm.Item.ProNo });
            list.push({ name: "Version", value: vm.Item.Version });
            AjaxService.GetPlan("SDKPro", list).then(function (data) {
                vm.ProductForm.Version.$setValidity('unique', !data.ProNo);
            });
        }
    }

    function JobDelete(item) {
        var en = {};
        en.ProNo = item.ProNo;
        en.Version = item.Version;
        en.CreateBy = $rootScope.User.UserNo;
        AjaxService.ExecPlan("SDKPro", "delete", item).then(function (data) {
            toastr.success("删除成功");
            PageChange();
        })
    }
}
]);