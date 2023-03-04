const path = require("path");

/**
 * @param {*} env 環境変数
 * @param {*} argv 引数
 */
module.exports = (env, argv) => {
  const isDevMode = argv.mode === "development" ? true : false;
  const isStaging = !!env.STAGING;
  const isRelease = !!env.RELEASE;
  const paths = {};

  paths.dist = {};
  paths.dist.root = path.resolve(__dirname, "./dist");
  paths.dist.common = {};
  paths.dist.common.root = path.resolve(paths.dist.root, "./common");
  paths.dist.common.js = path.resolve(paths.dist.common.root, "./js");

  paths.src = {};
  paths.src.root = path.resolve(__dirname, "./src");
  paths.src.script = path.resolve(paths.src.root, "./script");

  return {
    // 構成オプション: "none" | "development" | "production"
    mode: isDevMode ? "development" : "production",

    // ターゲット環境
    // @see https://webpack.js.org/configuration/target/
    // @example ["node"] | ["webworker"]
    target: ["web", "es5"],

    // エントリーポイント
    entry: {
      common: path.resolve(paths.src.script, "./common.js")
    },

    // 出力する方法と場所
    // @see https://webpack.js.org/configuration/output/
    output: {
      path: paths.dist.common.js,
      filename: "common.js"
    },

    // ファイル監視オプション
    watchOptions: {
      ignored: "**/node_modules"
    },

    // モジュール
    module: {},

    // プラグイン
    plugins: []
  };
};
