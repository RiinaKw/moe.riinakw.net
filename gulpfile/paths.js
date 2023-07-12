
// 各種ファイルの変換元・変換先の定義
exports.html = {
  src: 'src/html/**/*.html',
  dist: 'dist',
};
exports.scss = {
  src: 'src/scss/**/*.{scss,css}',
  dist: 'dist/css',
};
exports.ts = {
  src: 'src/js/**/*.{ts,js}',
  dist: 'dist/js',
};
exports.vendor = {
  src: 'src/vendor/**/*',
  dist: 'dist/vendor',
};
exports.image = {
  src: 'src/images/**/*',
  dist: 'dist/images',
};
exports.favicon = {
  src: 'src/favicon.ico',
  dist: 'dist',
};
