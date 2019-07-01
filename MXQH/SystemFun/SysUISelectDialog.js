'use strict';
angular.module('app').controller('SysUISelectDialogCtrl', SysUISelectDialogCtrl);

SysUISelectDialogCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'Form', 'ItemData', 'toastr', 'AjaxService', '$window'];

function SysUISelectDialogCtrl($rootScope, $scope, $uibModalInstance, Form, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.form = Form[ItemData.SelectName ? 1 : 0];
    vm.Item = angular.copy(ItemData);
    vm.Item.CreateBy = $rootScope.User.UserNo;
    vm.SerList = angular.copy(ItemData.SerList);
    vm.Item.SerList = undefined;
    vm.isExists = isExists;
    vm.Ser = { SerLevel: 0 };
    vm.ChangeEntity = ChangeEntity;
    vm.AddSer = AddSer;
    vm.DeleteSer = DeleteSer;
    vm.ToHtml = ToHtml;

    vm.EntityRelationExp = { Table: "EntityRelation", Column: "Expression" };
    vm.EntityRelationAss = { Table: "EntityRelation", Column: "Associate" };


    //$scope.$watch(function () { return vm.Item.EntityName; }, ChangeEntity);
    GetTbColumns(vm.Item.EntityName);
    //获取组织信息
    if (vm.form.index == 1) {
        //html文件
        AjaxService.AjaxHandle("GetSelectText", vm.Item.SelectName).then(function (data) {
            vm.tempHtml = data.Html;
        })
    }

    function ChangeEntity() {
        if (vm.Item.EntityName) {
            GetTbColumns(vm.Item.EntityName);
            vm.Item.ReturnColumn = undefined;
            vm.Item.ShowColumn = undefined;
            vm.Item.ShowSmallColumn = undefined;
            vm.Item.SelectedColumn = undefined;
            vm.SerList = [];
        }
    }

    function GetTbColumns(name) {
        if (name) {
            var en = {};
            en.name = "EntityName";
            en.value = name;
            AjaxService.GetPlans("PlanProperty", en).then(function (data) {
                vm.EnColumns = data;
            });
        }
    }

    //添加查询条件
    function AddSer() {
        vm.SerList = vm.SerList || [];
        var item = angular.copy(vm.Ser);
        item.SerValue = item.SerValue || '';
        vm.SerList.push(item);
        vm.Ser.ColumnName = undefined;
    }

    function DeleteSer(index) {
        vm.SerList.splice(index, 1);
    }

    //储存
    vm.Save = function () {
        vm.SerList = vm.SerList || [];
        for (var i = 0, len = vm.SerList.length; i < len; i++) {
            vm.SerList[i].SerValue = vm.SerList[i].SerValue || '';
            vm.SerList[i].SerLevel = vm.SerList[i].SerLevel || 0;
        }
        vm.Item.SerList = JSON.stringify(vm.SerList);
        vm.Item.Action = vm.form.index;
        vm.Item.TempColumns = "SerList";
        AjaxService.ExecPlan("SysUISelect", "save", vm.Item).then(function (data) {
            toastr.success('储存成功');
            var JsEn = {};
            JsEn.FileName = vm.Item.SelectName + ".html";
            if (!vm.tempHtml) { ToHtml(); }
            JsEn.Text = $window.btoa($window.encodeURIComponent(vm.tempHtml));
            //保存html
            AjaxService.AjaxHandle("AddUISelect", JSON.stringify(JsEn));
            $uibModalInstance.close(vm.SerList);
        });

    };

    function ToHtml() {
        var data = vm.Item;
        var html = '';
        html = '<div class="py-xl-0 pt-xl-0" ng-class="{ \'input-group\' : clear }">\n';
        html += '    <ui-select ng-model="$parent.ngModel" ng-change="ValueChange()" theme="bootstrap" class="{{ selectClass }}" ng-disabled="ngDisabled" name="{{ ngName }}" ng-required="ngRequired">\n';
        html += '        <ui-select-match placeholder="{{ placeholder }}">{{ $select.selected.' + data.SelectedColumn + ' }}</ui-select-match>\n';
        html += '        <ui-select-choices repeat="' + (data.ReturnColumn && data.ReturnColumn != '' ? 'item.' + data.ReturnColumn + ' as ' : "") + 'item in data | filter: $select.search"  refresh="refresh($select.search)">\n';
        html += '            <div ng-bind-html="item.' + data.ShowColumn + ' | highlight: $select.search"></div>\n';
        html += data.ShowSmallColumn && data.ShowSmallColumn != '' ? ('            <small ng-bind-html="item.' + data.ShowSmallColumn + ' | highlight: $select.search"></small>\n') : "";
        html += '        </ui-select-choices>\n';
        html += '    </ui-select>\n';
        html += '    <span class="input-group-btn" ng-if="clear">\n';
        html += '        <button ng-click="$parent.ngModel= undefined" class="btn btn-default" ng-disabled="ngDisabled">\n';
        html += '            <span class="glyphicon glyphicon-trash text-danger"></span>\n';
        html += '        </button>\n';
        html += '    </span>\n';
        html += '</div>\n';
        vm.tempHtml = html;
        return html;
    }

    //取消
    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验证是否存在
    function isExists() {
        if (vm.Item.SelectName) {
            var en = { name: "SelectName", value: vm.Item.SelectName };
            AjaxService.GetPlan('SysUISelect', en).then(function (data) {
                vm.DialogForm.SelectName.$setValidity('unique', !data.SelectName);
            });
        }
    }

}
