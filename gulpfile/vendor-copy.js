const gulp = require('gulp');

// その他
const debug = require('gulp-debug'); // デバッグログ
const plumber = require('gulp-plumber'); // デスクトップ通知
const notify = require('gulp-notify');

// パスの設定
const paths = require('./paths');

/**
 * vendor をコピー
 *
 * @return {gulp}
 */
const vendorCopy = () => {
  return gulp.src(paths.vendor.src)
  // エラーが起きたときにデスクトップへ通知する
      .pipe(plumber(notify.onError('Error: <%= error.message %>')))
      // そのまま出力
      .pipe(gulp.dest(paths.vendor.dist))
      // ログ出力
      .pipe(debug({title: 'vendor :'}))
  ;
};
module.exports = vendorCopy;
