var gulp = require('gulp');
var config = require('../config.js').clean;
var del = require('del');

gulp.task( 'clean:release' , del.bind(null,config.dest));

gulp.task( 'clean:dev' , del.bind(null,config.src));

gulp.task( 'clean', ['clean:release', 'clean:dev']);