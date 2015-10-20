var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['release'], function() {
  return gulp.src('./public/**/*')
    .pipe(deploy({
      remoteUrl: 'https://' + process.env.ITHUB_ACCESS_TOKEN + process.env.GH-RHF
    }));
});
