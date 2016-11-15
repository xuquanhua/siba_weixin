/**
 * 组件安装
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    replace = require('gulp-replace'), //字符串替换
    uglify = require('gulp-uglify'), //js压缩
    gulpSequence = require('gulp-sequence'),
    fs = require('fs'),
    path = require('path'),
    gulpif = require('gulp-if'),
    cheerio = require('gulp-cheerio'),
    run = require('gulp-run'),
    through2 = require('through2');
md5 = require('gulp-md5-plus');
var srcDst = './src/';
var verDst = './ver/';
var relDst = './dist/';
var opts;
var nestedSrc = function() {
    var temp = false;
    if (process.argv.indexOf('--uglify') !== -1) {
        temp = true;
    }
    return temp
};
// HTML处理
gulp.task('html', function() {
    var Src = [srcDst + 'html/**/*.html'],
        Dst = relDst + 'html/';
    return gulp.src(Src)
        .pipe(modify(replaceOpts))
        .pipe(cheerio({
            run: function($) {
                var replace = $('script[compress]').remove();
                var tempArray = [];
                var tempStr;
                for (var i = 0, length = replace.length; i < length; i++) {
                    tempStr = $(replace[i]).attr('compress');
                    console.log(tempStr);
                    if (tempArray.indexOf(tempStr) === -1) {
                        $('body').append('<script src="' + tempStr + '"></script>');
                        tempArray.push(tempStr);
                    }
                }
            },
            parserOptions: {
                decodeEntities: false
            }
        }))
        .pipe(gulp.dest(Dst));
});
// 样式处理
gulp.task('css', function() {
    var Src = srcDst + 'css/**/*.*',
        Dst = relDst + 'css/';
    return gulp.src(Src)
        .pipe(gulp.dest(Dst));
});
gulp.task('images', function() {
    var Src = srcDst + 'images/**/*.*',
        Dst = relDst + 'images/';
    return gulp.src(Src)
        .pipe(gulp.dest(Dst));
});
//js部分处理
gulp.task('jsBase', function() {
    var jsBaseSrc = [srcDst + 'js/base/**/*.js'],
        jsBaseDst = relDst + 'js/';
    return gulp.src(jsBaseSrc)
        .pipe(modify(replaceOpts))
        .pipe(concat('base.js'))
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(jsBaseDst));
});
gulp.task('jsCard', function() {
    var jsCardSrc = [srcDst + 'js/card/**/*.js'],
        jsCardDst = relDst + 'js/';
    return gulp.src(jsCardSrc)
        .pipe(modify(replaceOpts))
        .pipe(concat('card.js'))
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(jsCardDst));
});
gulp.task('jsVoucher', function() {
    var jsVoucherSrc = [srcDst + 'js/voucher/**/*.js'],
        jsVoucherDst = relDst + 'js/';
    return gulp.src(jsVoucherSrc)
        .pipe(modify(replaceOpts))
        .pipe(concat('voucher.js'))
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(jsVoucherDst));
});
gulp.task('jsLog', function() {
    var jsLogSrc = [srcDst + 'js/log/**/*.js'],
        jsLogDst = relDst + 'js/log/';
    return gulp.src(jsLogSrc)
        .pipe(modify(replaceOpts))
        .pipe(gulpif(nestedSrc, uglify()))
        .pipe(gulp.dest(jsLogDst));
});
gulp.task('lib', function() {
    var Src = [srcDst + 'js/lib/**/*.js'],
        Dst = relDst + 'js/lib/';
    return gulp.src(Src)
        .pipe(gulp.dest(Dst));
});
gulp.task('md5:js', function(done) {
    gulp.src([relDst + 'js/**/*.js', '!' + relDst + 'js/log/**/*.js'])
        .pipe(md5(10, relDst + 'html/**/*.html'))
        .pipe(gulp.dest(relDst+ 'js/'))
        .on('end', done);
});
gulp.task('md5:css', function(done) {
    gulp.src(relDst + 'css/**/*.css')
        .pipe(md5(10, relDst + 'html/**/*.html'))
        .pipe(gulp.dest(relDst+ 'css/'))
        .on('end', done);
});
// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src([relDst], { read: false })
        .pipe(clean({ force: true }));
});

//自定义插件替换方法
function replaceOpts(stream) {
    var temp = [],
        str;
    for (var i = 0, length = opts.length; i < length; i++) {
        if (opts[i] !== "" && opts[i].indexOf("=") > -1) {
            temp = opts[i].replace(/\s/g, "").replace('=', '#===#').split('#===#');
            str = eval('/\\#\\[' + temp[0] + '\\]\\#/g');
            stream = stream.replace(str, temp[1]);
        }
    }
    return stream;
};
//自定义插件modify
function modify(modifier) {
    return through2.obj(function(file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
};
//获取配置文件
gulp.task('getOptsDev', function() {
    getOpts('./profile/env.properties.dev');
});
gulp.task('getOptsIdc', function() {
    getOpts('./profile/env.properties.idc_product');
});
gulp.task('getOptsTest', function() {
    getOpts('./profile/env.properties.test');
});

function getOpts(src) {
    //console.log("src" + src);
    opts = fs.readFileSync(src, 'utf8').replace(/[\r]/g, "").split("\n");
    //console.log(opts);
};
gulp.task('default', gulpSequence("getOptsIdc", "clean", 'lib', 'images', 'css', 'jsBase', 'jsCard', 'jsVoucher', 'jsLog', 'html', 'md5:css', 'md5:js'));
gulp.task('dev', gulpSequence("getOptsDev", "clean", 'lib', 'images', 'css', 'jsBase', 'jsCard', 'jsVoucher', 'jsLog', 'html', 'md5:css', 'md5:js'));
gulp.task('idc_product', gulpSequence("getOptsIdc", "clean", 'lib', 'images', 'css', 'jsBase', 'jsCard', 'jsVoucher', 'jsLog', 'html', 'md5:css', 'md5:js'));
gulp.task('test', gulpSequence("getOptsTest", "clean", 'lib', 'images', 'css', 'jsBase', 'jsCard', 'jsVoucher', 'jsLog', 'html', 'md5:css', 'md5:js'));
