'use strict';

angular.module('app')
.controller('RegUserSignDialogCtrl', ['$scope', '$uibModalInstance', '$rootScope', 'ItemData', 'toastr', 'AjaxService', '$window',
function ($scope, $uibModalInstance, $rootScope, ItemData, toastr, AjaxService, $window) {
    var vm = this;
    vm.title = ItemData.Type == 'Q' ? '查看' : '审核';
    vm.opts = ItemData.opts;
    vm.opts.size = 'large';
    vm.AbleSign = ItemData.Type == 'S';
    vm.Sign = Sign;

    vm.DownLoad = DownLoad;
    //取消
    vm.cancel = cancel;
    var list = [];
    list.push({ name: 'Account', value: ItemData.Account });
    AjaxService.GetPlan("SDKRegUser", list).then(function (data) {
        vm.Data = data;
    });

    function Sign(isagree) {
        var en = {};
        en.IsAgree = isagree;
        en.Account = ItemData.Account;
        en.UserNo = $rootScope.User.UserNo;
        en.Remark = vm.SignItem.Remark;
        AjaxService.ExecPlanMail("SDKRegUser", 'sign', en).then(function (data) {
            toastr.success('审核成功');
            $uibModalInstance.close();
        });
    }

    function DownLoad (url) {
        $window.open(url);
    }

    //取消
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    };
}
]);