var app = angular.module('access').controller('SignUpCtrl', SignUpCtrl);
SignUpCtrl.$inject = ['$scope', 'AjaxService', 'toastr', 'appUrl', 'FileUrl', '$window'];
function SignUpCtrl($scope, AjaxService, toastr, appUrl, FileUrl, $window) {
    var vm = this;
    vm.indextab = 0;
    vm.process = 0;
    vm.Next = Next;
    vm.Register = Register;

    vm.ThisTap = function (index) {
        if (index <= vm.process)
        {
            vm.indextab = index;
        }
    }

    vm.Agree = function () {
        vm.process = vm.Item.IsAgree ? 1 : 0;
        vm.indextab = vm.Item.IsAgree ? 1 : 0;
    }

    function Next(index)
    {
        vm.process = index;
        vm.indextab = index;
    }

    vm.SetImg = function (index) {
        if (index - vm.process == 1) {
            return 'Content/images/process2.png'
        }
        else if (index <= vm.process) {
            return 'Content/images/process3.png'
        }
        return 'Content/images/process1.png'
    }

    vm.checkAccount = function () {
        var en = {}, en2 = {};
        en.Account = vm.Item.Password;
        en2.Json = JSON.stringify(en);
        AjaxService.DoBefore("CheckAccountExists", en2).then(function (data) {
            vm.OneForm.Account.$setValidity('isExists', data.data[0].Result == 0);
        });
    }

    vm.checkPwdSign = function () {
        if (vm.Item.PasswordSign) {
            vm.OneForm.PasswordSign.$setValidity('check', vm.Item.Password == vm.Item.PasswordSign);
        }
    }

    vm.DownloadNDA = function () {
        //$window.location.href = data.File;
        vm.Item.NDA = true;
        $window.open(FileUrl + 'DownLoad/相互保密协议中英文版本（平台专用）.docx')
    }

    vm.ThreeNext = function () {
        if (!vm.License || !vm.License.AttachSn) {
            toastr.error("公司营业执照复印件未上传");
        }
        else if (!vm.NDAFile || vm.NDAFile.length == 0) {
            toastr.error("NDA协议未上传");
        }
        else
        {
            Next(3);
        }
    }

    vm.FourNext = function () {
        if (!vm.Card || !vm.Card.AttachSn) {
            toastr.error("名片正面未上传");
        }
        else if (!vm.CardReverse || !vm.CardReverse.AttachSn) {
            toastr.error("名片反面未上传");
        }
        else {
            Next(4);
        }
    }

    //完成注册
    function Register()
    {
        if (!vm.License || !vm.License.AttachSn) {
            toastr.error("公司营业执照复印件未上传");
        }
        else if (!vm.NDAFile || vm.NDAFile.length == 0) {
            toastr.error("NDA协议未上传");
        }
        else if (!vm.Card || !vm.Card.AttachSn) {
            toastr.error("名片正面未上传");
        }
        else if (!vm.CardReverse || !vm.CardReverse.AttachSn) {
            toastr.error("名片反面未上传");
        }

        var RegFile = [];
        var AttachFile = [];
        //营业执照
        AttachFile.push(angular.copy(vm.License));
        var license = {};
        license.AttachSn = vm.License.AttachSn;
        license.FileType = 'License';
        RegFile.push(license);
        //NDA
        for (var i = 0, len = vm.NDAFile.length; i < len; i++)
        {
            AttachFile.push(angular.copy(vm.NDAFile[i]));
            var n = {};
            n.AttachSn = vm.NDAFile[i].AttachSn;
            n.FileType = 'NDA';
            RegFile.push(n);
        }

        //Card
        AttachFile.push(angular.copy(vm.Card));
        var c = {};
        c.AttachSn = vm.Card.AttachSn;
        c.FileType = 'Card';
        RegFile.push(c);

        //CardReverse
        AttachFile.push(angular.copy(vm.CardReverse));
        var cr = {};
        cr.AttachSn = vm.CardReverse.AttachSn;
        cr.FileType = 'CardReverse';
        RegFile.push(cr);

        vm.Item.NDA = !vm.Item.NDA || false;
        vm.Item.Files = JSON.stringify(RegFile);
        vm.Item.PswdKey = "NAN";
        vm.Item.TempColumns = "Files";

        var en = {};
        en.planName = "SDKRegUser";
        en.shortName = "save";
        en.strJson = JSON.stringify(vm.Item);
        en.fileJson = JSON.stringify(AttachFile);
        en.dir = "SDKRegister";

        AjaxService.DoBefore("ExecPlanUpload", en).then(function (data) {
            toastr.success("储存成功");
            setTimeout(function () {
                $window.location.href = appUrl + 'Acess.html#!/login';
            }, 3000);
        })
    }

}