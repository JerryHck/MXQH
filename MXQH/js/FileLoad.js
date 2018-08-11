'use strict'
angular.module('app').factory('FileLoad', ['$rootScope', '$q', 'AjaxService',
function ($rootScope, $q, AjaxService) {

    var h = {
        Load: function (option) {
            var me = h;
            me.precetMethod = option.onProcent;
            me.type = option.type || 'binary';//binary,buffer,url,text
            me.onComplete = option.onComplete;
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
            me.readBlob(file, 0);
        },
        onLoadStart: function () {
            var me = h;
        },
        onProgress: function (e) {
            var me = h;
            me.loaded += e.loaded;
            if (me.precetMethod) {
                me.precetMethod((me.loaded / me.total) * 100);
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
            console.log(me.result.length + "   + " + e.target.result.length)
            me.result = me.result + e.target.result;
            console.log(me.result.length);
            console.log(me.loaded);
            if (me.loaded < me.total) {
                console.log(1)
                me.readBlob(me.loaded);
            } else {
                me.loaded = me.total;
                console.log(2)
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
                blob = file.slice(start, (start + me.step + 1));
            } else {
                blob = file;
            }

            switch (me.type) {
                case 'binary': me.reader.readAsBinaryString(blob); break;
                case 'buffer': me.reader.readAsArrayBuffer(blob); break;
                case 'url': me.reader.readAsDataURL(blob); break;
                case 'text': me.reader.readAsText(blob); break;
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