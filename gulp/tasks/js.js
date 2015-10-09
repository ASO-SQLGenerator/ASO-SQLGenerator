var gulp = require('gulp');

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 * このタスクは開発用で、JavaScript は Minify されません。
 * Minify するとデバッガで Source Maps を展開したとき、変数名を復元できず不便なので開発時はそのまま結合します。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'js', function() {
  return compile( false );
} );

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 * このタスクはリリース用で、JavaScript は Minify されます。
 *pretty-hrtime
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'js:release', function() {
  return compile( true );
} );

/**
 * JavaScript の変更を監視して差分コンパイルします。
 *
 * @return {Object} gulp ストリーム。
 */
gulp.task( 'watchify', function() {
  return compile( false, true );
} );

/**
 * JavaScript の依存関係を解決し、単一ファイルにコンパイルします。
 *
 * @param {Boolean} isRelease リリースファイル用を出力する場合は true。
 * @param {Boolean} isWatch  差分監視モードで実行する場合は true。
 *
 * @return {Object} gulp ストリーム。
 */
function compile( isRelease, isWatch ) {
  var $          = require( 'gulp-load-plugins' )();
  var config     = require( '../config.js' ).js;
  var errorUtil  = require( '../util/error' );
  var browserify = require( 'browserify' );
  var licensify = require('licensify');
  var source     = require( 'vinyl-source-stream' );
  var buffer     = require( 'vinyl-buffer' );
  var watchify   = require( 'watchify' );
  var glob       = require( 'glob' );
  var formatter  = require( 'pretty-hrtime' );
  var time       = process.hrtime();



  var bundler = null;
  var srcFiles = glob.sync(config.src + '/js/*.js');
  if( isWatch ) {
    var option = config.browserify;
    option.cache        = {};
    option.packageCache = {};
    option.fullPaths    = true;

    bundler = watchify( browserify( srcFiles, option ) );

  } else {
    bundler = browserify( srcFiles, config.browserify );
  }

  function bundle() {
    return bundler
      .plugin(licensify)
      .bundle()
      .on( 'error', errorUtil )
      .pipe( source( config.bundle ) )
      .pipe( buffer() )
      .pipe( $.if(!(isRelease),$.sourcemaps.init( { loadMaps: true } ) ) )
      .pipe( $.if( isRelease, $.uglify({preserveComments: 'some'}) ) )
      .pipe( $.if(!(isRelease),$.sourcemaps.write( '.' ) ) )
      .pipe( $.if( isRelease, gulp.dest( config.dest ), gulp.dest( config.src) ) )
      .on( 'end', function() {
        var taskTime = formatter( process.hrtime( time ) );
        $.util.log( 'Bundled', $.util.colors.green( 'bundle.js' ), 'in', $.util.colors.magenta( taskTime ) );
      } );
  }

  bundler.on( 'update', function () {
    $.util.log( $.util.colors.green('update event') );
    bundle()
  });

  return bundle();
}