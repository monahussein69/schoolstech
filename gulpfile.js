'use strict';

// sass compile
var gulp = require('gulp');
var sass = require('gulp-sass');
var prettify = require('gulp-prettify');
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rtlcss = require("gulp-rtlcss");
var connect = require('gulp-connect');

//*** SASS compiler task
gulp.task('sass', function () {
  // bootstrap compilation
	gulp.src('./src/client/sass/bootstrap.scss').pipe(sass()).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

  // select2 compilation using bootstrap variables
	gulp.src('./src/client/assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({outputStyle: 'compressed'})).pipe(gulp.dest('./assets/global/plugins/select2/css/'));

  // global theme stylesheet compilation
	gulp.src('./src/client/sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./assets/global/css'));
	gulp.src('./src/client/sass/apps/*.scss').pipe(sass()).pipe(gulp.dest('./assets/apps/css'));
	gulp.src('./src/client/sass/pages/*.scss').pipe(sass()).pipe(gulp.dest('./assets/pages/css'));

  // theme layouts compilation
	gulp.src('./src/client/sass/layouts/layout/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css'));
  gulp.src('./src/client/sass/layouts/layout/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css/themes'));

  gulp.src('./src/client/src/client/sass/layouts/layout2/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout2/css'));
  gulp.src('./src/client/sass/layouts/layout2/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout2/css/themes'));

  gulp.src('./src/client/sass/layouts/layout3/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout3/css'));
  gulp.src('./src/client/sass/layouts/layout3/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout3/css/themes'));

  gulp.src('./src/client/sass/layouts/layout4/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout4/css'));
  gulp.src('./src/client/sass/layouts/layout4/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout4/css/themes'));

  gulp.src('./src/client/sass/layouts/layout5/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout5/css'));

  gulp.src('./src/client/sass/layouts/layout6/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout6/css'));

  gulp.src('./src/client/sass/layouts/layout7/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout7/css'));
});

//*** SASS watch(realtime) compiler task
gulp.task('sass:watch', function () {
	gulp.watch('./src/client/sass/**/*.scss', ['sass']);
});

//*** CSS & JS minify task
gulp.task('minify', function () {
    // css minify 
    gulp.src(['./src/client/assets/apps/css/*.css', '!./src/client/assets/apps/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/apps/css/'));

    gulp.src(['./src/client/assets/global/css/*.css','!./assets/global/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/global/css/'));
    gulp.src(['./src/client/assets/pages/css/*.css','!./assets/pages/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/pages/css/'));
    
    gulp.src(['./src/client/assets/layouts/**/css/*.css','!./assets/layouts/**/css/*.min.css']).pipe(rename({suffix: '.min'})).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));
    gulp.src(['./src/client/assets/layouts/**/css/**/*.css','!./assets/layouts/**/css/**/*.min.css']).pipe(rename({suffix: '.min'})).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));

    gulp.src(['./src/client/assets/global/plugins/bootstrap/css/*.css','!./assets/global/plugins/bootstrap/css/*.min.css']).pipe(minifyCss()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    //js minify
    gulp.src(['./src/client/assets/apps/scripts/*.js','!./assets/apps/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/apps/scripts/'));
    gulp.src(['./src/client/assets/global/scripts/*.js','!./assets/global/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/global/scripts'));
    gulp.src(['./src/client/assets/pages/scripts/*.js','!./assets/pages/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/pages/scripts'));
    gulp.src(['./src/client/assets/layouts/**/scripts/*.js','!./assets/layouts/**/scripts/*.min.js']).pipe(uglify()).pipe(rename({suffix: '.min'})).pipe(gulp.dest('./assets/layouts/'));
});

//*** RTL convertor task
gulp.task('rtlcss', function () {

  gulp
    .src(['./src/client/assets/apps/css/*.css', '!./src/client/assets/apps/css/*-rtl.min.css', '!./src/client/assets/apps/css/*-rtl.css', '!./src/client/assets/apps/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./src/client/assets/apps/css'));

  gulp
    .src(['./src/client/assets/pages/css/*.css', '!./src/client/assets/pages/css/*-rtl.min.css', '!./src/client/assets/pages/css/*-rtl.css', '!./src/client/assets/pages/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/pages/css'));

  gulp
    .src(['./src/client/assets/global/css/*.css', '!./src/client/assets/global/css/*-rtl.min.css', '!./src/client/assets/global/css/*-rtl.css', '!./src/client/assets/global/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/css'));

  gulp
    .src(['./src/client/assets/layouts/**/css/*.css', '!./src/client/assets/layouts/**/css/*-rtl.css', '!./src/client/assets/layouts/**/css/*-rtl.min.css', '!./src/client/assets/layouts/**/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp
    .src(['./src/client/assets/layouts/**/css/**/*.css', '!./src/client/assets/layouts/**/css/**/*-rtl.css', '!./src/client/assets/layouts/**/css/**/*-rtl.min.css', '!./src/client/assets/layouts/**/css/**/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp
    .src(['./src/client/assets/global/plugins/bootstrap/css/*.css', '!./src/client/assets/global/plugins/bootstrap/css/*-rtl.css', '!./src/client/assets/global/plugins/bootstrap/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/plugins/bootstrap/css')); 
});

//*** HTML formatter task
gulp.task('prettify', function() {
  	
  	gulp.src('./**/*.html').
  	  	pipe(prettify({
    		indent_size: 4, 
    		indent_inner_html: true,
    		unformatted: ['pre', 'code']
   		})).
   		pipe(gulp.dest('./'));
});


gulp.task('connect', function() {
    connect.server({
        root : './src/client/app/',
        port:8080
    });
});

gulp.task('default', ['prettify', 'rtlcss', 'minify', 'sass', 'sass:watch','connect']);
//gulp.task('default', ['connect']);