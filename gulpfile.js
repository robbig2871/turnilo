'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');

var laborer = require('laborer');

gulp.task('style', laborer.taskStyle());
gulp.task('icons', laborer.taskIcons());

gulp.task('client:tsc', laborer.taskClientTypeScript({ declaration: true }));
gulp.task('server:tsc', laborer.taskServerTypeScript({ declaration: true }));

gulp.task('client:test', laborer.taskClientTest());
gulp.task('server:test', laborer.taskServerTest());

gulp.task('client:bundle', laborer.taskClientPack({ showStats: true }));

gulp.task('clean', laborer.taskClean());

gulp.task('all', function(cb) {
  runSequence(
    'clean' ,
    ['style', 'icons'],
    ['server:tsc', 'client:tsc'],
    'client:bundle',
    cb
  );
});

gulp.task('watch', ['all'], function() {
  watch('./src/client/**/*.scss', function() {
    gulp.start('style');
  });

  watch('./src/client/**/*.svg', function() {
    gulp.start('icons');
  });

  watch(['./src/common/**/*.ts', './src/client/**/*.ts', './assets/icons/**'], function() {
    runSequence('client:tsc', 'client:bundle');
  });

  watch(['./src/common/**/*.ts', './src/server/**'], function() {
    gulp.start('server:tsc');
  });
});

gulp.task('default', ['all']);
