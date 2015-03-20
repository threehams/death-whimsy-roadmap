'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var jadeify = require('jadeify');
var nodemon = require('nodemon');
var sass = require('gulp-sass');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var gzip = require('gulp-gzip');

gulp.task('clean', function (callback) {
  return del(['./dist'], callback);
});

gulp.task('sass', function() {
  return buildSass().pipe(gulp.dest('./dist/css/')).pipe(reload({stream: true}));
});

gulp.task('deploy-sass', function() {
  return buildSass().pipe(gzip()).pipe(gulp.dest('./dist/css/'));
});

function buildSass() {
  return gulp.src('./client/css/main.scss')
    .pipe(sass())
    .on('error', function(err) {
      // don't crash, just log the error!
      console.log('Error when processing CSS!');
      console.log(err);
      browserSync.notify('Error when processing CSS!');
      this.emit('end');
    })
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(concat('style.css'));

}

gulp.task('vendor', function() {
  return buildVendor().pipe(gulp.dest('./dist/js'));
});

gulp.task('deploy-vendor', function() {
  return buildVendor().pipe(streamify(uglify()))

    .pipe(gzip())
    .pipe(gulp.dest('./dist/js'));
});

function buildVendor() {
  return browserify()
    .require('lodash')
    .require('angular')
    .require('angular-route')
    .require('angular-animate')
    .require('angular-messages')
    .bundle()
    .pipe(source('vendor.js'));
}

gulp.task('deploy-bundle', function() {
  return browserify()
    .add('./client/js/main.js')
    .external('lodash')
    .external('angular')
    .external('angular-route')
    .external('angular-animate')
    .external('angular-messages')
    .transform(jadeify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function () {
  var bundler = watchify(browserify({ cache: {}, packageCache: {}, fullPaths: true, debug: true}));

  browserSync({
    proxy: 'localhost:8888',
    port: 8080,
    open: false
  });

  gulp.watch('client/**/*.scss', ['sass']);
  gulp.watch(['client/**/*.html', 'client/**/*.css', 'client/img/*.*'], ['copy-static-files']);
  gulp.watch('server/**/*.js', ['mocha']);

  bundler
    .add('./client/js/main.js')
    .external('lodash')
    .external('angular')
    .external('angular-route')
    .external('angular-animate')
    .external('angular-messages')
    .transform(jadeify)
    .on('update', rebundle);
  return rebundle();

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) {
        console.log('Browserify Error');
        console.log(err.message);
        console.log(err.stack);
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(reload({stream: true}));
  }
});
gulp.task('copy-static-files', function () {
  return gulp.src(['./client/**/*.html', './client/**/*.css', 'client/**/*.png', 'client/**/*.jpg'])
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream: true}));
});
gulp.task('connect-dist', function () {
  nodemon({
    script: 'server/index.js',
    env: {
      'PORT': 8888
    },
    nodeArgs: ['--harmony-generators']
  });
});

gulp.task('mocha', function() {
  var mocha = require('gulp-mocha-co');
  return gulp.src(['./server/test/**/*_test.js'])
    .pipe(mocha())
    .on('error', function() {
      this.emit('end'); // without this, can't start watching tests if one is broken
    });
});

gulp.task('karma', function() {
  var karma = require('karma');
  var root = path.resolve('./');
  return karma.server.start({
    basePath: root,
    configFile: path.join(root, './karma.conf.js')
  });
});

gulp.task('default', function() {
  runSequence('clean', 'build', 'mocha', 'karma');
});

gulp.task('build',
  ['vendor', 'watch', 'sass', 'copy-static-files', 'connect-dist']
);

gulp.task('deploy', function() {
    runSequence(
      'clean',
      ['deploy-vendor', 'deploy-bundle', 'deploy-sass', 'copy-static-files']
    );
  }
);