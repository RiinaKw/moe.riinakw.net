const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // sass コンパイラ
const sourcemaps = require('gulp-sourcemaps'); // ***.css.map
const autoprefixer = require('gulp-autoprefixer'); // ベンダープレフィックス

// その他
const gulpif = require('gulp-if'); // 条件分岐を簡単にしてくれるやつ
const debug = require('gulp-debug'); // デバッグログ
const plumber = require('gulp-plumber'); // デスクトップ通知
const notify = require('gulp-notify');

// パスの設定
const paths = require('./paths');

// コマンドの引数
const arguments = require('./arguments');

/**
 * scss をコンパイル
 *
 * @return {gulp}
 */
const scssCompile = () => {
  return gulp.src(paths.scss.src)
      // エラーが起きたときにデスクトップへ通知する
      .pipe(plumber(notify.onError('Error: <%= error.message %>')))
      // ***.css.map の準備
      .pipe(sourcemaps.init())
      // 本番環境の場合はコンパイル後に圧縮
      .pipe(gulpif(
          arguments.env === 'production',
          sass.sync({
            outputStyle: 'compressed',
          }),
      ))
      // 開発環境の場合はコンパイルだけ
      .pipe(gulpif(
          arguments.env === 'development',
          sass.sync({
            outputStyle: 'expanded',
          }),
      ))
      // ベンダープレフィックス
      .pipe(autoprefixer())
      // ***.css.map を出力
      .pipe(sourcemaps.write('./maps'))
      // css を出力
      .pipe(gulp.dest(paths.scss.dist))
      // ログ出力
      .pipe(debug({title: 'scss :'}))
  ;
};
module.exports = scssCompile;
