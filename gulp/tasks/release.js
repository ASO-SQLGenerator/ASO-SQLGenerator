var gulp = require('gulp');
var $    = require( 'gulp-load-plugins' )();

gulp.task('release',['clean', 'js:release', 'copy']);