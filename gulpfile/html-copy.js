const gulp = require('gulp');

// その他
const debug = require('gulp-debug'); // デバッグログ
const plumber = require('gulp-plumber'); // デスクトップ通知
const notify = require('gulp-notify');

// パスの設定
const paths = require('./paths');

/**
 * html をコピー
 *
 * @return {gulp}
 */
const htmlCopy = () => {
  return gulp.src(paths.html.src)
  // エラーが起きたときにデスクトップへ通知する
      .pipe(plumber(notify.onError('Error: <%= error.message %>')))
      // そのまま出力
      .pipe(gulp.dest(paths.html.dist))
      // ログ出力
      .pipe(debug({title: 'html :'}))
  ;
};
module.exports = htmlCopy;
