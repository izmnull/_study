const path = require("path");
// @see https://www.npmjs.com/package/sass
const DartSass = require("sass");
// @see https://webpack.js.org/plugins/mini-css-extract-plugin/
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// @see https://webpack.js.org/plugins/html-webpack-plugin/
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
  paths.dist.common.css = path.resolve(paths.dist.common.root, "./css");

  paths.src = {};
  paths.src.root = path.resolve(__dirname, "./src");
  paths.src.script = path.resolve(paths.src.root, "./script");
  paths.src.html = path.resolve(paths.src.root, "./html");

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

    // モジュールの解決方法
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".pug", ".scss"],
      alias: {
        "~": paths.src.root
      }
    },

    // ファイル監視オプション
    watchOptions: {
      ignored: "**/node_modules"
    },

    // ローカルサーバー構成
    devServer: {
      host: "local-ip", // "localhost" | "local-ip"
      // port: "3030", // NOTE: 指定しなければ自動
      static: {
        directory: paths.dist.root
      },
      open: true,
      liveReload: true,
      hot: true,
      devMiddleware: {
        // NOTE: 静的ビルドしたファイルを参照する
        writeToDisk: (filePath) => {
          // NOTE: この書式によりキャッシュファイルが大量に生成されるのを停止する
          return !/hot-update/i.test(filePath);
        }
      }
    },

    // モジュール
    module: {
      rules: [
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            // "style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                // NOTE: CSS内`url()`ファイルの取り込みを行わない
                url: false,
                // NOTE: 開発環境でソースマップを出力する
                sourceMap: isDevMode ? true : false
              }
            },
            {
              loader: "sass-loader",
              options: {
                implementation: DartSass,
                sourceMap: isDevMode ? true : false,
                sassOptions: {
                  outputStyle: isDevMode ? "expanded" : "compressed"
                }
              }
            }
          ]
        }
      ]
    },

    // プラグイン
    plugins: [
      new MiniCssExtractPlugin({
        // output.path からの相対パスで記述する必要がある
        // [name]はエントリーポイントのkey値
        filename: path.join(
          path.relative(paths.dist.common.js, paths.dist.common.css),
          "/[name].css"
        )
      }),

      // NOTE: テンプレートを用いることで、ビルド時の自動的なファイルパスの記述はできなくなったが、ルート相対パスで記述できるようになった
      new HtmlWebpackPlugin({
        filename: path.join(path.relative(paths.dist.common.js, paths.dist.root), "/index.html"),
        template: path.resolve(paths.src.html, "./index.html"),
        inject: false,
        minify: isDevMode ? true : false
      })
    ]
  };
};
