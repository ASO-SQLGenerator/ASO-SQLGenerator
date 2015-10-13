var gulp = require('gulp');
var config = require('../config').js;
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src([config.src + '/js/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
