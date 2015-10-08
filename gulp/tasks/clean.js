var gulp = require('gulp');
var config = require('../config.js').clean;

gulp.task( 'clean:release' , del.bind(null,config.dist));

gulp.task( 'clean:dev' , del.bind(null,config.src));

gulp.task( 'clean', ['clean:release', 'clean:dev']);