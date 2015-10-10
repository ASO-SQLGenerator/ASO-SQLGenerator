var gulp = require('gulp');
var config = require('../config').copy;

gulp.task( 'copy', function() {
  return gulp.src([config.html, config.css],
    {base: config.src})
    .pipe(gulp.dest(config.dest));
});