const minimist = require('minimist');

// コマンドの引数を解析
module.exports = minimist(process.argv.slice(2), {
  string: 'env',
  default: {
    env: 'development', // 引数の指定がなかったときのデフォルト値
  },
});
