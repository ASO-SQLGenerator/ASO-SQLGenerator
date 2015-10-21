var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var onError = require('../util/error.js');
/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['release'], function() {
  return gulp.src('./public/**/*')
    .pipe(deploy({
      remoteUrl: 'https://' + process.env.GH_TOKEN + '@github.com:ASO-SQLGenerator/ASO-SQLGenerator.git'
    }))
    .on('error', onError);
});
