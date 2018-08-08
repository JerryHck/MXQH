'use strict';

angular.module('app')
.controller('FileCtrl', ['$scope', '$http', '$q', 'AjaxService',
function ($scope, $http, $q, AjaxService) {

    var vm = this;
    $scope.importf = importf;
    vm.Do = Do;
    //vm.FileData = { header: { header: "A" }, sheetNum: 1 };

    function Do() {
        $scope.List = angular.copy(vm.FileData.data[0]);
        console.log($scope.List)
    }
    /*
    FileReader共有4种读取方法：
    1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
    2.readAsBinaryString(file)：将文件读取为二进制字符串
    3.readAsDataURL(file)：将文件读取为Data URL
    4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
                         */
    var wb;//读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串
    function importf(obj) {
        if (!obj.files) {
            return;
        }
        $scope.List = [];
       
        vm.promise = ToJson(obj.files[0]).then(function (data) {
            $scope.List = data;
        });
    }

    function ToJson(f) {//导入
        var d = $q.defer();
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;

                console.log(data);

                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                d.resolve(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
            reader.readAsText(f);

        } catch (e) {
            d.reject();
        }
        return d.promise;
    }

    function reader(file, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();

            reader.onload = function () {
                resolve(reader);
            };
            reader.onerror = reject;

            if (options.accept && !new RegExp(options.accept).test(file.type)) {
                reject({
                    code: 1,
                    msg: 'wrong file type'
                });
            }

            if (!file.type || /^text\//i.test(file.type)) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    }

}
]);