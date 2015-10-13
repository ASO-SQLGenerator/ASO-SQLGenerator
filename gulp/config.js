/**
 * gulp タスクから参照される設定です。
 * @type {Object}
 */
var path = {
  src: './src',
  dest: './public'
};

module.exports = {
  /**
   * 開発用ビルド。
   * @type {Object}
   */
  build: {
    depends: [ 'js', 'css' ]
  },

  /**
   * リリース用ビルド。
   * @type {Object}
   */
  release: {
    depends: [ 'copy', 'useref' ]
  },

  /**
   * リリース用ディレクトリの削除。
   * @type {Object}
   */
  clean: {
    src: [path.src + '/bundle.*'],
    dest: path.dest
  },

  copy: {
    src:  path.src,
    dest: path.dest,
    html: path.src + '/*.html',
    css:  path.src + '/css/*.css'
  },

  /**
   * JavaScript ビルド。
   * この設定は js、js-release、watchify で共有されます。
   * @type {Object}
   */
  js: {
    src:    path.src,
    dest:   path.dest,
    bundle: 'bundle.js',
    browserify: {
      debug:  true
    }
  },

  /**
   * 既定タスク。
   * @type {Object}
   */
  default: {
    depends: [ 'watchify' ]
  }
};