var gulp = require('gulp');
var replace = require('gulp-replace');
var config = require('../config').copy;

gulp.task( 'copy:html', function() {
  return gulp.src([config.html],
    {base: config.src})
    .pipe(replace('./bundle.js', './bundle.min.js'))
    .pipe(gulp.dest(config.dest));
});

gulp.task( 'copy:css', function() {
  return gulp.src([config.css],
    {base: config.src})
    .pipe(gulp.dest(config.dest));
});

gulp.task( 'copy:vendor', function() {
  return gulp.src([config.vendor],
    {base: config.src})
    .pipe(gulp.dest(config.dest));
});
gulp.task( 'copy:img', function() {
  return gulp.src([config.img],
    {base: config.src})
    .pipe(gulp.dest(config.dest));
});

gulp.task( 'copy', ['copy:html', 'copy:css', 'copy:vendor', 'copy:img']);
