var gulp = require('gulp'),
    concat = require('gulp-concat'),//�ļ��ϲ�
    uglify = require('gulp-uglify'),//jsѹ��
    cleanCss = require('gulp-clean-css'),//cssѹ��
    htmlmin = require('gulp-htmlmin'),//html ѹ��
    rev = require('gulp-rev'),//���ļ�����MD5��׺
    clean = require('gulp-clean'),//����
    revCollector = require('gulp-rev-collector'),//·���滻;//·���滻
    less = require('gulp-less'),//less ����
    imagemin = require('gulp-imagemin'),//ͼƬѹ��
    pngquant = require('imagemin-pngquant'),
    jshint = require('gulp-jshint'),        //js��֤
    //stylish = require('jshint-stylish'),
    order = require('gulp-order'),         //�ļ�����
    gulpSequence = require('gulp-sequence'), //ִ��˳��
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
//�汾
var ver = [
        path + 'css/plugin.css', path + 'css/app.css', path + 'appData.js',
        path + 'appData.js', path + 'js/dobefore.min.js', path + 'js/mxqh.min.js', path + 'js/plugin.min.js',
        path + 'Basic/*.html', path + 'Basic/*/*.html'];

//��ʼ��
gulp.task('init', function (cb) {
    gulpSequence('clean', ['toCss', 'concat-plugin', 'concat-app', 'concat-css', 'rev'], cb)
})

//�������
gulp.task('watch', function () {
    //less ����
    gulp.watch([path + 'css/app.less', path + 'css/less/*.less'], ['toCss']);

    //��� �ϲ�ѹ��
    gulp.watch(plugin, ['concat-plugin']);
    //app js �ϲ�ѹ��
    gulp.watch(app, ['concat-app']);

    //css ��� �ϲ�ѹ��
    gulp.watch(css, ['concat-css']);

    //�汾���¼��
    return gulp.watch(ver, ['rev']);
})


//js���ѹ���ϲ�
gulp.task('concat-plugin', function () {
    console.log('js �ϲ� plugin' + new Date());
    //js ��� �ļ�
    return gulp.src(plugin)
        .pipe(concat("plugin.js"))
        .pipe(gulp.dest(path + "/js"))//д������
        .pipe(uglify({
            //mangle: true,//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
            mangle: false
        }))
        .on('error', swallowError)
        .pipe(concat("plugin.min.js"))
        .pipe(gulp.dest(path + "/js"));//д������
});

//js�ϲ�
gulp.task('concat-app', function () {
    console.log('js �ϲ� app'+ new Date());
    gulp.src(app)
        .pipe(uglify({
            //mangle: true,//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
            mangle: false
            //mangle: { except: ['require', 'exports', 'module', '$'] }//�ų������ؼ���
        }))
        .on('error', swallowError)
        .pipe(concat("mxqh.min.js"))
        .pipe(gulp.dest(path + "/js"));//д������
    //dobefore
   return gulp.src(access)
        .pipe(uglify({ mangle: false }))
        .pipe(concat("dobefore.min.js"))
        .pipe(gulp.dest(path + "/js"));//д������
});
//Css less ����
gulp.task('toCss', function () {
    console.log('less to css' + new Date());
    //less ����
    return gulp.src(path + "css/app.less")
        .pipe(less())
        .pipe(cleanCss())
        //.pipe(rev())
        .on('error', swallowError)
        .pipe(gulp.dest(path + "/css"))//
        .pipe(rev.manifest())
        .pipe(gulp.dest(target + "/css"));
});

//less ����
gulp.task('concat-css', function () {
    return gulp.src(css)
        .on('error', swallowError)
        .pipe(cleanCss())
        .pipe(concat("plugin.css"))
        .pipe(gulp.dest(path + "/css"));//д������
});

gulp.task('rev', function (cb) {
    gulpSequence('rev-version', ['rev-main', 'rev-basic'], cb);
});

//�����ļ�hash���벢����rev-manifest.json�ļ�������ӳ��
gulp.task('rev-version', function () {
    return gulp.src(ver)
        .pipe(rev())
        .pipe(rev.manifest())
        .on('error', swallowError)
        .pipe(gulp.dest(target + 'rev'));
});

//�汾���¼��--��ҳ����
gulp.task('rev-main', function () {
    //����return ʱ�첽ִ�У�
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
       .pipe(gulp.dest(path));//д������
});

//�汾���¼��--��ҳ����
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
        .pipe(gulp.dest(path + "Basic"));//д������
})


//�����ļ�
gulp.task('clean', function () {
   return gulp.src([target], { read: false })
        .pipe(clean());
});

//����ʱѹ��html
gulp.task('publish-htmlMin', function () {
    var options = {
        collapseWhitespace: true,  //��������˼Ӧ�ÿ��Կ�����������ո�ѹ��html����һ���Ƚ���Ҫ�����ñȽϴ�����ĸı�ѹ����Ҳ�ر��
        collapseBooleanAttributes: true,  //ʡ�Բ������Ե�ֵ�����磺<input checked="checked"/>,��ô����������Ժ󣬾ͻ��� <input checked/>��
        removeComments: true,  //���html��ע�͵Ĳ��֣�����Ӧ�ü���htmlҳ���е�ע�͡�
        removeEmptyAttributes: true,  //������еĿ����ԡ�
        removeScriptTypeAttributes: true,  //�������script��ǩ�е�type="text/javascript"���ԡ�
        removeStyleLinkTypeAttributes: true,  //�������Link��ǩ�ϵ�type���ԡ�
        minifyJS: true,  //ѹ��html�е�javascript���롣
        minifyCSS: true  //ѹ��html�е�css���롣
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
//����ʱ�ļ��ƶ�
gulp.task('publish-move', function () {
    //�ƶ���Ŀ��ѹ��
    var s = '(*.css|*.ashx|*.json|*.json|*.dll|*.exe*|Web.config|Web.config|packages.config|*.woff|*.eot|*.svg|*.ttf|*.otf)'
    gulp.src([path + "/*" + s, path + "/!(obj)/**/*" + s, path + "/*(js|Scripts|l10n)/**/*.js"])
        .on('error', swallowError)
        .pipe(gulp.dest(target));
    return gulp.src([path + "/l10n/*.js"])
        .on('error', swallowError)
        .pipe(gulp.dest(target + "/l10n"));
});

//ͼƬ����
gulp.task('publish-image', function () {
    var s = '(*.jpg|*.png|*.gif|)'
  return  gulp.src([path + "/*" + s, path + "/!(obj)/**/*" + s])
        .pipe(imagemin())
        .pipe(gulp.dest(target))
        .on('error', swallowError)
});

// ����js���񣬽��д�����
gulp.task('publish-jshnit', function () {
   return gulp.src(path + "/!(obj|js|Scripts|l10n|bin)/**/*.js")
    //gulp.src(path + "/*(Access|Basic|MESFun|PLMFun|MESFun|SystemFun)/**/*.js")
        //.pipe(jshint())       // ���м��
        //.pipe(jshint.reporter('default'))  // �Դ�����б�����ʾ
        //ѹ���ļ�
        .pipe(uglify({
            //mangle: true,//���ͣ�Boolean Ĭ�ϣ�true �Ƿ��޸ı�����
            mangle: false
        }))
        .pipe(gulp.dest(target));//д������
});

//�Զ�ˢ��
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

//�汾����������ļ�ѹ��
gulp.task('default', function (cb) {
    gulpSequence('clean', 'init', cb)
})

gulp.task('publish', function (cb) {
    gulpSequence('clean', ['publish-htmlMin', 'publish-move', 'publish-jshnit', 'publish-image'], cb)
})

