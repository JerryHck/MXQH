'use strict'
angular.module('app').factory('Dialog', ['$rootScope', '$ocLazyLoad', '$uibModal', '$q', 'AjaxService',
function ($rootScope, $ocLazyLoad, $uibModal, $q, AjaxService) {
    var obj = {
        //開啟
        open: open
    };

    return obj;

    //開啟
    function open(name, resolve, option) {
        var d = $q.defer();
        //Route Config
        AjaxService.GetJson('Dialog.json?1.2', '').then(function (data) {
            
            var 
                dialog = $.grep(data, function (e) { return e.name == name; })[0],          
                config = angular.extend({
                    templateUrl: dialog.templateUrl,
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
                    loadList.push(dialog.LoadFiles[i].LoadName);
                }
                $ocLazyLoad.load(loadList).then(function () {
                    d.resolve($uibModal.open(config).result);
                });
            }
        });

        return d.promise;
    }
}

])
