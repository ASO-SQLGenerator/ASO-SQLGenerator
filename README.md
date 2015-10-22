# ASO-SQLGenerator

[![Build Status](https://travis-ci.org/ASO-SQLGenerator/ASO-SQLGenerator.svg?branch=master)](https://travis-ci.org/ASO-SQLGenerator/ASO-SQLGenerator)

ASO-SQLGenerator is sql generator that uses a Jquery.

web上で直感的にSQL文が作れるサイトです。

## DEMO
Go to http://aso-sqlgenerator.github.io

## Installing
```bash
git clone https://github.com/ASO-SQLGenerator/ASO-SQLGenerator.git
cd /ASO-SQLGenerator
npm install
npm start
```
また、localで動かすにはnode.jsのインストールが必要です。

  * MacOS Xの場合:
    * `python` (`v2.7` 推奨, `v3.x.x` は __*サポートされていません*__) (Mac OS Xはすでにinstallされています)
    * [Xcode](https://developer.apple.com/xcode/downloads/)
        * また、Xcodeの`Command Line Tools`をインストールする必要があります。[developer.apple.com]から最新版の`Command Line Tools`をインストールしてください。
    * [Node.js][Node.js] ([`v0.12.7`](https://nodejs.org/dist/v0.12.7/node-v0.12.7.pkg) 推奨)
    * Node.jsのバージョン管理をしたい場合は、[nvm]または、[nodebrew]がおすすめです。
  * Windowsの場合:
    * [Python][windows-python] ([`v2.7.3`][windows-python-v2.7.10] 推奨, `v3.x.x` は __*サポートされていません*__ )
        * [インストール手順](http://qiita.com/maisuto/items/404e5803372a44419d60)
    * [Node.js][Node.js] (`v0.12.7` 推奨, [32bit][windows32-node-v0.12.7], [64bit][windows64-node-v0.12.7])
        * Node.jsのバージョン管理をしたい場合は、[nvm-windows][nvm-windows] ([Download][nvm-windows-zip])がおすすめです。
    * Windows XP/Vista/7:
        * Microsoft Visual Studio C++ 2013 ([Express][msvc2013])
        * インストールが失敗した場合は、最初にインストールされている任意のC++ 2010のx64&amp;x86の再配布をアンインストールしてみてください
        * 64ビットのコンパイラがインストールされていないことでエラーが発生した場合、あなたは[WindowsのSDK7.1のコンパイラ更新]をする必要があるかもしれません
    * Windows 7/8:
        * Microsoft Visual Studio C++ 2013 for Windows Desktop ([Express][msvc2013])
        
## Usage
* `npm start`: webサーバーを起動して、`/src`フォルダの変更を監視します。
* `npm test`: lintとchromeを使ったテストをします。
* `npm run lint`: `/src`フォルダのjsファイルをlintします。
* `npm run watch:lint`: コードを変更した時に自動的にlintをします。
* `npm run release`: `/src` フォルダ下のファイルをリリース用に変更して`public`フォルダに配置します。
* `npm run js:release`: `/src`フォルダ下のjsファイルをbundleして`public`フォルダに配置します。
* `npm run clean`: `/src`フォルダの`bundle.js`と`public`フォルダを削除します。


## Contribution
1. Fork it ( https://github.com/ASO-SQLGenerator/ASO-SQLGenerator.git )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

### Code Style
[Javacript-style-guide][Javacript-style-guide]をベースに独自のルールを`.eslintrc`に追記しています。
個別のルールの詳細は[ESlintのDocument](http://eslint.org/docs/rules/)、[日本語訳](http://qiita.com/M-ISO/items/4cd183e2496c2937a53e)があるのでそちらをご覧下さい。

* コードチェックの仕方
    * コードスタイルをチェックするにはコードを`/src`フォルダにおいて`npm run lint`でチェックできます。
      また常時チェックしたい場合は,`npm run watch:lint`をするとコードを変更した時に自動的にチェックをします。

## LICENCE
[MIT](https://github.com/ASO-SQLGenerator/ASO-SQLGenerator/blob/master/LICENSE)

[Node.js]:https://nodejs.org/en/
[windows32-node-v0.12.7]:https://nodejs.org/dist/v0.12.7/node-v0.12.7-x86.msi
[windows64-node-v0.12.7]:https://nodejs.org/dist/v0.12.7/x64/node-v0.12.7-x64.msi
[Javacript-style-guide]:http://mitsuruog.github.io/javacript-style-guide/
[windows-python]: http://www.python.org/getit/windows
[windows-python-v2.7.10]: http://www.python.org/download/releases/2710#download
[msvc2013]: https://www.microsoft.com/ja-jp/download/details.aspx?id=40784
[WindowsのSDK7.1のコンパイラ更新]: http://www.microsoft.com/en-us/download/details.aspx?id=4422
[nvm-windows]: https://github.com/coreybutler/nvm-windows
[nvm-windows-zip]: https://github.com/coreybutler/nvm-windows/releases
[developer.apple.com]: https://developer.apple.com/downloads/?name=for%20Xcode
[nvm]: https://github.com/creationix/nvm
[nodebrew]: https://github.com/hokaccha/nodebrew
