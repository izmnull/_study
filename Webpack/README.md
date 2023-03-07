# README.md

## npm install

`npm pug-loader` が依存する `npm pug` のバージョンは 2.x ですが、2.x には脆弱性が存在するため、3.x を固定インストールします。
通常の `npm i` では依存に関係するエラーが出力されるため、3.x を強制的にインストールする `-f` オプションを使用します。

```
npm i -f
```