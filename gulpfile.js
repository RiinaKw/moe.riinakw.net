const gulp = require('gulp');

// 開発サーバ
const browserSync = require('browser-sync');

// パスの設定
const paths = require('./gulpfile/paths');

// 引数の読み込み
const arguments = require('./gulpfile/arguments');

// 動作している環境変数を表示
console.log('\x1b[36m');
console.log('****************');
console.log('*');
console.info(`* mode : ${arguments.env}`);
console.log('*');
console.log('****************');
console.log('\x1b[0m');

// 4つのメインコマンド
const htmlCopy = require('./gulpfile/html-copy');
const scssCompile = require('./gulpfile/scss-compile');
const jsCopy = require('./gulpfile/js-copy');
const vendorCopy = require('./gulpfile/vendor-copy');
const imageCopy = require('./gulpfile/image-copy');

exports.html = htmlCopy;
exports.scss = scssCompile;
exports.ts = jsCopy;
exports.vendor = vendorCopy;
exports.image = imageCopy;

// ファイル更新を監視してブラウザをリロード
exports.serve = () => {
  browserSync.init({
    open: false,
    startPath: '',
    reloadDelay: 100,
    once: true,
    notify: true,
    ghostMode: false,
    server: {
      baseDir: 'dist/',
    },
  });

  // html が更新されたらファイルをコピー
  gulp.watch(paths.html.src, {usePolling: true})
      .on('change', gulp.series(
          htmlCopy,
          () => {
            browserSync.reload();
          },
      ));

  // scss が更新されたら css にコンパイル
  gulp.watch(paths.scss.src, {usePolling: true})
      .on('change', gulp.series(
          scssCompile,
          () => {
            browserSync.reload();
          },
      ));

  // ts が更新されたら js にコンパイル
  gulp.watch(paths.ts.src, {usePolling: true})
      .on('change', gulp.series(
          jsCopy,
          () => {
            browserSync.reload();
          },
      ));

  // vendor が更新されたらファイルをコピー
  gulp.watch(paths.vendor.src, {usePolling: true})
      .on('change', gulp.series(
          vendorCopy,
          () => {
            browserSync.reload();
          },
      ));

  // images が更新されたらファイルをコピー
  gulp.watch(paths.image.src, {usePolling: true})
      .on('change', gulp.series(
          imageCopy,
          () => {
            browserSync.reload();
          },
      ));
};

// デフォルトコマンドは4種変換を非同期で行なう
exports.default = gulp.parallel(
    htmlCopy,
    scssCompile,
    jsCopy,
    vendorCopy,
    imageCopy,
);
