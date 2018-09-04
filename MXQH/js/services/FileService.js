(function () {
    angular.module('FileService', ['angularFileUpload']);

    angular.module('FileService').factory('FileService', FileService);

    FileService.$inject = ['FileUploader', 'FileServiceUrl', 'toastr'];

    function FileService(FileUploader, FileServiceUrl, toastr) {
        var file = {
            upLoad: function (option) {
                option = option || {};
                var me = file;
                me.List = [];
                option.maxFile = option.maxFile || 10;
                uploader = new FileUploader({
                    url:  FileServiceUrl + 'FileService.asmx/FileUpload'
                });
                // FILTERS
                uploader.filters.push({
                    name: 'maxFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < option.maxFile;
                    }
                });

                if (option.filter) {
                    uploader.filters.push({
                        name: 'FileFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return option.filter.indexOf(type) !== -1;
                        }
                    });
                }

                uploader.filters.push({
                    name: 'asyncFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                        setTimeout(deferred.resolve, 1e3);
                    }
                });
                // CALLBACKS
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                   
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.log(response);
                    toastr.error('文件上传失败');
                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response[0]) {
                        me.List.push(response[0])
                    }
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    
                };
                uploader.onCompleteAll = function () {
                    if (option.onComplete) {
                        option.onComplete(me.List);
                    }
                };
                return uploader;
            },
            
        };

        return file;
    }
})();