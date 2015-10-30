var gulp = require('gulp');
var browserSync = require('browser-sync');
var PORT = 3000;
gulp.task('watch', function() {
  browserSync({
    port: PORT,
    host: '192.168.33.20',
    open: true,
    server: {
      baseDir: './src'
    }
  });
  gulp.watch('./src/bundle.js', browserSync.reload);
  gulp.watch('./src/**/*.html', browserSync.reload);
});


gulp.task('watch:lint', function() {
  gulp.watch('src/js/*.js', ['lint']);
});
