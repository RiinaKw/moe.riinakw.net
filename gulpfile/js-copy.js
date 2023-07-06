const gulp = require('gulp');

// その他
const debug = require('gulp-debug'); // デバッグログ
const plumber = require('gulp-plumber'); // デスクトップ通知
const notify = require('gulp-notify');

// パスの設定
const paths = require('./paths');

/**
 * TypeScript をコンパイル
 *
 * @return {gulp}
 */
const tsCompile = () => {
  return gulp.src(paths.ts.src)
      // エラーが起きたときにデスクトップへ通知する
      .pipe(plumber(notify.onError('Error: <%= error.message %>')))
      // js を出力
      .pipe(gulp.dest(paths.ts.dist))
      // ログ出力
      .pipe(debug({title: 'ts :'}))
  ;
};
module.exports = tsCompile;
