'use strict'
angular.module('app').factory('FileLoad', ['$rootScope', '$ocLazyLoad', '$uibModal', '$q', 'AjaxService', 'Version',
function ($rootScope, $ocLazyLoad, $uibModal, $q, AjaxService, Version) {
    var obj = {
        //開啟
        open: open
    };

    return obj;

    //開啟
    function open(name, resolve, option) {
        var d = $q.defer();
        var
            dialog = $.grep($rootScope.DialogData, function (e) { return e.name == name; })[0],
            config = angular.extend({
                templateUrl: dialog.templateUrl + "?v=" + Version,
                controller: dialog.controller,
                backdrop: dialog.backdrop || 'static',
                size: dialog.size
            }, option || {});

        if (dialog.controllerAs) {
            config.controllerAs = dialog.controllerAs;
        }

        if (dialog.keyboard && config.keyboard == undefined) {
            config.keyboard = dialog.keyboard == 'true';
        }

        config.resolve = resolve;
        if (dialog.LoadFiles) {
            var loadList = [];
            for (var i = 0, len = dialog.LoadFiles.length; i < len; i++) {
                loadList.push(dialog.LoadFiles[i].LoadName + "?v=" + Version);
            }
            $ocLazyLoad.load(loadList).then(function () {
                d.resolve($uibModal.open(config).result);
            });
        }
        return d.promise;
    }
}

])