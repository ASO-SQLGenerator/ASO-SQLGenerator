/**
 * gulp タスクから参照される設定です。
 * @type {Object}
 */
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
    dist: './public',
    src: ['./src/bundle.*']
  },


  /**
   * JavaScript ビルド。
   * この設定は js、js-release、watchify で共有されます。
   * @type {Object}
   */
  js: {
    src:       './src',
    dest:      './public',
    bundle:    'bundle.js',
    browserify: {
      debug:     true
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