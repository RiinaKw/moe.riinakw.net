const gulp = require('gulp');

// その他
const debug = require('gulp-debug'); // デバッグログ
const plumber = require('gulp-plumber'); // デスクトップ通知
const notify = require('gulp-notify');

// パスの設定
const paths = require('./paths');

/**
 * 画像をコピー
 *
 * @return {gulp}
 */
const imageCopy = () => {
  return gulp.src(paths.image.src)
  // エラーが起きたときにデスクトップへ通知する
      .pipe(plumber(notify.onError('Error: <%= error.message %>')))
      // そのまま出力
      .pipe(gulp.dest(paths.image.dist))
      // ログ出力
      .pipe(debug({title: 'image :'}))
  ;
};
module.exports = imageCopy;
