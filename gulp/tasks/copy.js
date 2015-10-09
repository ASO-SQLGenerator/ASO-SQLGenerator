var gulp = require('gulp');
var config = require('../config').copy;

gulp.task( 'copy', function() {
  gulp.src([config.html, config.css],
    {base: 'src'})
    .pipe(gulp.dest())
});