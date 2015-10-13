var gulp = require('gulp');
var config = require('../config.js').clean;
var del = require('del');

gulp.task( 'clean:release', function() {
  return del(config.dest);
});

gulp.task( 'clean:dev', function() {
  return del(config.src);
});

gulp.task( 'clean', ['clean:release', 'clean:dev']);
