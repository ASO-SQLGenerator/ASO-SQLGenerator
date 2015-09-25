var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
  browserify('./src/js/app.js', { debug: true })
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('default',['browserify']);