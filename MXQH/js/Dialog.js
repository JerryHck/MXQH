'use strict'
angular.module('AppSet').factory('Dialog', ['$rootScope', '$ocLazyLoad', '$uibModal', '$q', 'AjaxService', 'Version',
function ($rootScope, $ocLazyLoad, $uibModal, $q, AjaxService, Version) {
    var obj = {
        //開啟
        open: open,
        OpenDialog: OpenDialog
    };

    return obj;


    function OpenDialog(name, item) {
        var NewItem = {
            ItemData: function () {
                return item;
            }
        };
        return open(name, NewItem);
    }

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
                var l = dialog.LoadFiles[i];
                if (l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == 'css' || l.LoadName.substr(l.LoadName.length - 3, 3).toLowerCase() == '.js') {
                    loadList.push(l.LoadName + "?v=" + Version);
                }
                else {
                    loadList.push(l.LoadName);
                }
                //loadList.push(dialog.LoadFiles[i].LoadName+ "?v=" + Version);
            }
            $ocLazyLoad.load(loadList).then(function () {
                d.resolve($uibModal.open(config).result);
            });
        }
        return d.promise;
    }
}

])
