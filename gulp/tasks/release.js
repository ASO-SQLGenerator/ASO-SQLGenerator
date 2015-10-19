var gulp = require('gulp');

gulp.task('release', ['js:release', 'copy']);
gulp.task('release:clean', ['clean', 'release']);
