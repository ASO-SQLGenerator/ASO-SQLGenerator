var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['release'], function() {
  return gulp.src('./public/**/*')
    .pipe(deploy());
});
