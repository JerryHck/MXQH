var gulp = require('gulp'),
    concat = require('gulp-concat'),//文件合并
    uglify = require('gulp-uglify'),//js压缩
    cleanCss = require('gulp-clean-css'),//css压缩
    htmlmin = require('gulp-htmlmin'),//html 压缩
    rev = require('gulp-rev'),//对文件名加MD5后缀
    clean = require('gulp-clean'),//清理
    revCollector = require('gulp-rev-collector'),//路径替换;//路径替换
    less = require('gulp-less'),//less 编译
    imagemin = require('gulp-imagemin'),//图片压缩
    pngquant = require('imagemin-pngquant'),
    jshint = require('gulp-jshint'),        //js验证
    //stylish = require('jshint-stylish'),
    order = require('gulp-order'),         //文件排序
    gulpSequence = require('gulp-sequence'), //执行顺序
    connect = require('gulp-connect');//livereload

var path = "MXQH/MXQH/";
//var target = '../IIS/MXQH'
var target = 'MXQH_App/';

var plugin = [
    path + "Scripts/jquery-3.0.0.min.js",
    //path + "Scripts/jquery/jquery.min.js",
    path + "Scripts/angular/angular.min.js",
    path + "Scripts/angular/angular-messages.min.js",
    path + "Scripts/angular/angular-toastr.tpls.min.js",
    path + "Scripts/angular/angular-busy.min.js",
    path + "Scripts/angular/angular-ui-router.min.js",
    path + "Scripts/angular/angular-animate/angular-animate.min.js",
    path + "Scripts/angular/angular-cookies/angular-cookies.min.js",
    path + "Scripts/angular/angular-resource/angular-resource.min.js",
    path + "Scripts/angular/angular-sanitize/angular-sanitize.min.js",
    path + "Scripts/angular/angular-touch/angular-touch.js",
    path + "Scripts/angular/ngstorage/ngStorage.js",
    path + "Scripts/angular/angular-file-upload/angular-file-upload.min.js",
    path + "Scripts/bootstrap/bootstrap.min.js",
    path + "Scripts/angular-ui/bootstrap-switch.min.js",
    path + "Scripts/angular-ui/angular-toggle-switch.js",
    path + "Scripts/angular-ui/ui-bootstrap.min.js",
    path + "Scripts/angular-ui/ui-bootstrap-tpls.min.js",
    path + "Scripts/angular-ui/angular-locale_zh-cn.js",
    path + "Scripts/oclazyload/ui-router-require-polyfill.js",
    path + "Scripts/oclazyload/ocLazyLoad.min.js",
    path + "Scripts/angular/angular-translate/angular-translate.min.js",
    path + "Scripts/angular/angular-translate/loader-static-files.js",
    path + "Scripts/angular/angular-translate/storage-cookie.js",
    path + "Scripts/angular/angular-translate/storage-local.js",
    path + "Scripts/sweetalert.js",
    //path + "Scripts/sweetalert.min.js",
    //path + "Scripts/angular/angular-sweetalert/SweetAlert.min.js",
    path + "Scripts/jquery/ystep/ystep.js",
    //path + "Scripts/textAngular/textAngular-sanitize.min.js",
    //path + "Scripts/textAngular/textAngular.min.js",
    //path + "Scripts/ui-grid.js"
];

var access = [
    path + "js/services/AjaxServiceModule.js",
    path + "js/services/AjaxServiceMethod.js",
    path + "js/services/FileService.js",
    path + "js/directives/MyDirective.js",
    path + "js/Access.js",
];

var app = [
    path + "js/services/AjaxServiceModule.js",
    path + "js/services/AjaxServiceMethod.js",
    path + "js/directives/MyDirective.js",
    path + "js/FileLoad.js",
    path + "js/services/FileService.js",
    path + "js/services/ui-load.js",
    path + "js/app.js",
    path + "js/config.js",
    path + "js/config.lazyload.js",
    path + "js/config.router.js",
    path + "js/Dialog.js",
    path + "js/main.js",
    path + "js/Router.js",
    path + "js/directives/setnganimate.js",
    path + "js/directives/ui-butterbar.js",
    path + "js/directives/ui-focus.js",
    path + "js/directives/ui-fullscreen.js",
    path + "js/directives/ui-jq.js",
    path + "js/directives/ui-module.js",
    path + "js/directives/ui-nav.js",
    path + "js/directives/ui-scroll.js",
    path + "js/directives/ui-shift.js",
    path + "js/directives/ui-toggleclass.js",
    path + "js/directives/ui-validate.js",
    path + "js/filters/app-filter.js",
    path + "js/filters/fromNow.js",
];

var css = [
    path + "css/bootstrap.css",
    path + "Content/angular-busy.min.css",
    path + "css/animate.css",
    path + "css/font-awesome.min.css",
    path + "css/simple-line-icons.css",
    path + "css/font.css",
    path + "Content/ui-grid.css",
    path + "Content/ui-bootstrap-csp.css",
    path + "Content/angular-toastr.css",
    path + "Content/sweetalert.css",
    path + "Content/bootstrap-switch/bootstrap-switch.min.css",
    path + "Content/angular-toggle-switch/angular-toggle-switch.css",
    path + "Scripts/jquery/ystep/css/ystep.css",
];
//版本
var ver = [
        path + 'css/plugin.css', path + 'css/app.css', path + 'appData.js',
        path + 'appData.js', path + 'js/dobefore.min.js', path + 'js/mxqh.min.js', path + 'js/plugin.min.js',
        path + 'Basic/*.html', path + 'Basic/*/*.html'];

//初始化
gulp.task('init', function (cb) {
    gulpSequence('clean', ['toCss', 'concat-plugin', 'concat-app', 'concat-css', 'rev'], cb)
})

//监测任务
gulp.task('watch', function () {
    //less 编译
    gulp.watch([path + 'css/app.less', path + 'css/less/*.less'], ['toCss']);

    //插件 合并压缩
    gulp.watch(plugin, ['concat-plugin']);
    //app js 合并压缩
    gulp.watch(app, ['concat-app']);

    //css 插件 合并压缩
    gulp.watch(css, ['concat-css']);

    //版本更新检测
    return gulp.watch(ver, ['rev']);
})


//js插件压缩合并
gulp.task('concat-plugin', function () {
    console.log('js 合并 plugin' + new Date());
    //js 插件 文件
    return gulp.src(plugin)
        .pipe(concat("plugin.js"))
        .pipe(gulp.dest(path + "/js"))//写入命令
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: false
        }))
        .on('error', swallowError)
        .pipe(concat("plugin.min.js"))
        .pipe(gulp.dest(path + "/js"));//写入命令
});

//js合并
gulp.task('concat-app', function () {
    console.log('js 合并 app'+ new Date());
    gulp.src(app)
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: false
            //mangle: { except: ['require', 'exports', 'module', '$'] }//排除混淆关键字
        }))
        .on('error', swallowError)
        .pipe(concat("mxqh.min.js"))
        .pipe(gulp.dest(path + "/js"));//写入命令
    //dobefore
   return gulp.src(access)
        .pipe(uglify({ mangle: false }))
        .pipe(concat("dobefore.min.js"))
        .pipe(gulp.dest(path + "/js"));//写入命令
});
//Css less 编译
gulp.task('toCss', function () {
    console.log('less to css' + new Date());
    //less 编译
    return gulp.src(path + "css/app.less")
        .pipe(less())
        .pipe(cleanCss())
        //.pipe(rev())
        .on('error', swallowError)
        .pipe(gulp.dest(path + "/css"))//
        .pipe(rev.manifest())
        .pipe(gulp.dest(target + "/css"));
});

//less 编译
gulp.task('concat-css', function () {
    return gulp.src(css)
        .on('error', swallowError)
        .pipe(cleanCss())
        .pipe(concat("plugin.css"))
        .pipe(gulp.dest(path + "/css"));//写入命令
});

gulp.task('rev', function (cb) {
    gulpSequence('rev-version', ['rev-main', 'rev-basic'], cb);
});

//生成文件hash编码并生成rev-manifest.json文件名对照映射
gulp.task('rev-version', function () {
    return gulp.src(ver)
        .pipe(rev())
        .pipe(rev.manifest())
        .on('error', swallowError)
        .pipe(gulp.dest(target + 'rev'));
});

//版本更新检测--首页更新
gulp.task('rev-main', function () {
    //不加return 时异步执行，
    var arr = [
        target + 'rev/**/*.json',
        path + 'index.html',
        path + 'Access.html',
    ];
   return gulp.src(arr)
        .pipe(revCollector({
            replaceReved: true
        }))
       .on('error', swallowError)
       .pipe(gulp.dest(path));//写入命令
});

//版本更新检测--首页更新
gulp.task('rev-basic', function () {
    var arr2 = [
    target + 'rev/**/*.json',
    path + 'Basic/*.html',
    path + 'Basic/*/*.html'
    ];
    return gulp.src(arr2)
        .pipe(revCollector({
            replaceReved: true
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(path + "Basic"));//写入命令
})


//清理文件
gulp.task('clean', function () {
   return gulp.src([target], { read: false })
        .pipe(clean());
});

//发布时压缩html
gulp.task('publish-htmlMin', function () {
    var options = {
        collapseWhitespace: true,  //从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大。
        collapseBooleanAttributes: true,  //省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>。
        removeComments: true,  //清除html中注释的部分，我们应该减少html页面中的注释。
        removeEmptyAttributes: true,  //清除所有的空属性。
        removeScriptTypeAttributes: true,  //清除所有script标签中的type="text/javascript"属性。
        removeStyleLinkTypeAttributes: true,  //清楚所有Link标签上的type属性。
        minifyJS: true,  //压缩html中的javascript代码。
        minifyCSS: true  //压缩html中的css代码。
    };
    var htmlSrc = [
        path + '/*.html',
        path + '/!(obj)/*.html',
        path + '/!(obj)/**/*.html',
    ];
    return gulp.src(htmlSrc)
     .pipe(htmlmin(options))
     .on('error', swallowError)
     .pipe(gulp.dest(target));
});
//发布时文件移动
gulp.task('publish-move', function () {
    //移动项目并压缩
    var s = '(*.css|*.ashx|*.json|*.json|*.dll|*.exe*|Web.config|Web.config|packages.config|*.woff|*.eot|*.svg|*.ttf|*.otf)'
    gulp.src([path + "/*" + s, path + "/!(obj)/**/*" + s, path + "/*(js|Scripts|l10n)/**/*.js"])
        .on('error', swallowError)
        .pipe(gulp.dest(target));
    return gulp.src([path + "/l10n/*.js"])
        .on('error', swallowError)
        .pipe(gulp.dest(target + "/l10n"));
});

//图片处理，
gulp.task('publish-image', function () {
    var s = '(*.jpg|*.png|*.gif|)'
  return  gulp.src([path + "/*" + s, path + "/!(obj)/**/*" + s])
        .pipe(imagemin())
        .pipe(gulp.dest(target))
        .on('error', swallowError)
});

// 建立js任务，进行代码检查
gulp.task('publish-jshnit', function () {
   return gulp.src(path + "/!(obj|js|Scripts|l10n|bin)/**/*.js")
    //gulp.src(path + "/*(Access|Basic|MESFun|PLMFun|MESFun|SystemFun)/**/*.js")
        //.pipe(jshint())       // 进行检查
        //.pipe(jshint.reporter('default'))  // 对代码进行报错提示
        //压缩文件
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: false
        }))
        .pipe(gulp.dest(target));//写入命令
});

//自动刷新
gulp.task('connect', function () {
    connect.server({
        livereload: true
    });
});

function swallowError(error) {
    // If you want details of the error in the console
    console.error(error.toString())
    this.emit('end')
}

//版本生成与基本文件压缩
gulp.task('default', function (cb) {
    gulpSequence('clean', 'init', cb)
})

gulp.task('publish', function (cb) {
    gulpSequence('clean', ['publish-htmlMin', 'publish-move', 'publish-jshnit', 'publish-image'], cb)
})

