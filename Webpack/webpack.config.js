/**
 * @param {*} env 環境変数
 * @param {*} argv 引数
 */
module.exports = (env, argv) => {
  const isDevMode = argv.mode === "development" ? true : false;
  const isStaging = !!env.STAGING;
  const isRelease = !!env.RELEASE;

  return {
    // 構成オプション: "none" | "development" | "production"
    mode: isDevMode ? "development" : "production",

    // ターゲット環境
    // @see https://webpack.js.org/configuration/target/
    // @example ["node"] | ["webworker"]
    target: ["web", "es5"],

    // エントリーポイント
    entry: {
      common: "./src/script/common.js"
    },

    // 出力する方法と場所
    // @see https://webpack.js.org/configuration/output/
    output: {
      filename: "./common/js/common.js"
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
