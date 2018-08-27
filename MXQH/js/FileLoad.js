'use strict'
//importScripts("../Scripts/Concurrent.Thread/Concurrent.Thread.min.js");
//importScripts("../Scripts/SheetJs/xlsx.full.min.js");

angular.module('app').factory('FileLoad', ['$rootScope', '$q', 'AjaxService', '$ocLazyLoad', 
function ($rootScope, $q, AjaxService, $ocLazyLoad) {
    
    var h = {
        Load: function (option) {

            //$ocLazyLoad.load('fileLoad').then(function () {
                var me = h;
                me.precetMethod = option.onProcent;
                me.type = option.type || 'binary';//binary,buffer,url,text
                me.encode = option.encode || 'utf-8';
                me.onComplete = option.onComplete;
                me.onSliceData = option.onProgress;
                me.onProcent = option.onProcent;
                //每次读取128k
                me.step = 1024 * 1024;
                me.loaded = 0;
                me.times = 0;
                me.result = '';
            
                var d = $q.defer();
                var file = me.file = option.file;
                var reader = me.reader = new FileReader();
                //
                me.total = file.size;

                reader.onloadstart = me.onLoadStart;
                reader.onprogress = me.onProgress;
                reader.onabort = me.onAbort;
                reader.onerror = me.onerror;
                reader.onload = me.onLoad;
                reader.onloadend = me.onLoadEnd;
                //读取第一块
                me.readBlob(file, me.loaded);
                me.result = me.result + reader.result;
            //})
        },
        onLoadStart: function () {
            var me = h;
        },
        onProgress: function (e) {
            var me = h;
            if (me.onProcent) {
                me.onProcent((me.loaded / me.total) * 100);
            }
        },
        onAbort: function () {
            var me = h;
        },
        onError: function () {
            var me = h;
        },
        onLoad: function (e) {
            var me = h;
            if (me.onSliceData) {
                me.onSliceData(e.target.result)
            }

            if (me.loaded < me.total) {
                me.result = me.result + e.target.result;
                me.readBlob(me.loaded);
                //下次读取
                me.loaded += me.step;
            } else {
                me.loaded = me.total;
                me.result = me.result + e.target.result;
                if (me.onComplete) {
                    me.onComplete(me.result);
                }
            }
            //console.log(me.result.length);
        },
        onLoadEnd: function () {
            var me = h;
        },
        readBlob: function (start) {
            var me = h;
            var blob, file = me.file;
            me.times += 1;
            if (file.slice) {
                blob = file.slice(start, start + me.step);
            } else {
                blob = file;
            }
            switch (me.type) {
                case 'binary': me.reader.readAsBinaryString(blob); break;
                case 'buffer': me.reader.readAsArrayBuffer(blob); break;
                case 'url': me.reader.readAsDataURL(blob); break;
                case 'text': me.reader.readAsText(blob, me.encode); break;
            }
        },
        abortHandler: function () {
            var me = h;
            if (me.reader) {
                me.reader.abort();
            }
        }
    };

    return h;
}
])