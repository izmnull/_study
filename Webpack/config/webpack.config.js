/**
 * NOTE:
 * 以下のTODOリストはオプションとして解決することを前提とします。
 * 現状のWebpackの構成段階でnode_modulesは40MBあり、npmは9つ使用しています。
 * 新しいnpmを追加するのは非常に容易ですが、使用するモジュールが多くなるほど、
 * npm自体のメンテナンス、及び、依存関係の切り離しが非常に難しくなります。
 * ※要は何でも対応できる便利な物なんてねぇよ
 * 　脳死してないで目的毎に対応できるスキルを付けろし
 *
 * TODO:
 * - JS
 *   - フレームワークが使用できない
 *   - TypeScriptが使用できない
 * - CSS
 *   - CSSのソートができない
 * - Webpack
 *   - ビルドの速度が遅い
 * - ASSET
 *   - 画像などのアセットファイルが参照できない
 *   - 画像ファイルを圧縮したい
 */
const path = require("path");
const { execSync } = require("child_process");
// @see https://www.npmjs.com/package/sass
const DartSass = require("sass");
// @see https://webpack.js.org/plugins/mini-css-extract-plugin/
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// @see https://webpack.js.org/plugins/html-webpack-plugin/
const HtmlWebpackPlugin = require("html-webpack-plugin");
// @see https://webpack.js.org/plugins/terser-webpack-plugin/
const TerserPlugin = require("terser-webpack-plugin");
// @see https://www.npmjs.com/package/glob
const glob = require("glob");
// @see https://www.npmjs.com/package/fs-extra
const FsExtra = require("fs-extra");

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
  paths.dist.root = path.resolve(__dirname, "../dist");
  paths.dist.common = {};
  paths.dist.common.root = path.resolve(paths.dist.root, "./common");
  paths.dist.common.js = path.resolve(paths.dist.common.root, "./js");
  paths.dist.common.css = path.resolve(paths.dist.common.root, "./css");

  paths.src = {};
  paths.src.root = path.resolve(__dirname, "../src");
  paths.src.script = path.resolve(paths.src.root, "./script");
  paths.src.html = path.resolve(paths.src.root, "./html");
  paths.src.pug = path.resolve(paths.src.root, "./pug");

  // NOTE: ビルド前に出力ディレクトリを空にする
  if (!isDevMode) {
    FsExtra.emptyDirSync(paths.dist.root);
    console.log(`LOG: Clear Dist Dir: ${paths.dist.root}`);
  }

  return {
    // 構成オプション: "none" | "development" | "production"
    mode: isDevMode ? "development" : "production",

    // ターゲット環境
    // @see https://webpack.js.org/configuration/target/
    // @example ["node"] | ["webworker"]
    target: ["web", "es5"],
    devtool: isDevMode ? "inline-source-map" : false,

    // エントリーポイント
    entry: {
      common: path.resolve(paths.src.script, "./common.js"),
      // 上記commonのようなkey値であればそのままcommon.jsとして出力する（outputの[name]に相当）
      // key値をパスに指定することで特定のディレクトリに出力もできる
      // CSSも合わせて読み込んでいる（CSSの出力もこの位置からの相対パスになる点に注意）
      "../../unique/p-unique": path.resolve(paths.src.script, "./p-unique.js")
    },

    // 出力する方法と場所
    // @see https://webpack.js.org/configuration/output/
    output: {
      path: paths.dist.common.js,
      filename: "[name].js"
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

    optimization: {
      minimize: true,
      minimizer: [
        // NOTE: 圧縮するコードによっては問題が出る可能性もある
        new TerserPlugin({
          parallel: 4,
          terserOptions: {
            compress: {
              drop_console: true
              // NOTE: ステージング環境ではコンソールを出力する
              // drop_console: isStaging ? false : true
            },
            mangle: true
          }
        })
      ]
    },

    // ローカルサーバー構成
    devServer: {
      host: "localhost", // "localhost" | "local-ip"
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
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: {
                pretty: true,
                root: path.resolve(__dirname, "src")
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
        filename: path.join(path.relative(paths.dist.common.js, paths.dist.common.css), "/[name].css")
      }),

      // 静的HTML/PUGをビルド
      ...((generateHtmlWebpackPlugin) => {
        return [
          ...generateHtmlWebpackPlugin({
            globPath: "**/*.html",
            ignore: "**/_*/*.html",
            targetDir: paths.src.html
          }),

          ...generateHtmlWebpackPlugin({
            globPath: "**/*.pug",
            ignore: "**/_*/*.pug",
            targetDir: paths.src.pug,
            isPug: true
          })
        ];
      })((config) => {
        let htmlWebpackPluginArray = [];
        let globFiles = glob.globSync(config.globPath, {
          ignore: config.ignore,
          cwd: config.targetDir
        });

        for (let i = 0; i < globFiles.length; i++) {
          htmlWebpackPluginArray.push(
            new HtmlWebpackPlugin({
              filename: () => {
                let relativeFileName = path.join(path.relative(paths.dist.common.js, paths.dist.root), globFiles[i]);

                // NOTE: PUGの場合は拡張子をHTMLに変換する
                if (config.isPug) {
                  return relativeFileName.replace(".pug", ".html");
                }

                return relativeFileName;
              },
              template: path.resolve(config.targetDir, "./" + globFiles[i]),
              inject: false,
              minify: isDevMode ? false : true
            })
          );
        }

        return htmlWebpackPluginArray;
      }),

      // NOTE: コンパイラフック用にプラグインを作成し、コンパイル時にPrettierを起動する
      // ※ファイル数が多くなると毎回のビルドが遅くなる点に注意
      new (class CompilerHooksWatchRun {
        processPrettier() {
          console.log("LOG: Prettier format start.");
          execSync(`npx prettier --config ./config/.prettierrc.json --write ${paths.src.root}`);
          console.log("LOG: Prettier format end.");
        }

        apply(compiler) {
          compiler.hooks.beforeRun.tap("CompilerHooksWatchRun", () => {
            this.processPrettier();
          });

          compiler.hooks.watchRun.tapPromise("CompilerHooksWatchRun", async (compilation) => {
            this.processPrettier();
          });
        }
      })()
    ]
  };
};
