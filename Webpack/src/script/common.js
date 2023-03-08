import "~/style/common.scss";
import { Module, ModuleText } from "~/script/modules/Module";

// JS上で使用する画像を明示的にimportする必要がある
import "~/image/145-536x354.jpg";
import "~/image/1050-536x354.jpg";
import "~/image/1069-536x354.jpg";

console.log(ModuleText);

/* TODO: build環境には不要なコメント１ */
let myNameIsLooooongNameObject = {
  LoooongKey: "value1"
};

myNameIsLooooongNameObject.LoooongKey = "value2";

// TODO: build環境には不要なコメント２
console.log(myNameIsLooooongNameObject.LoooongKey);

document.getElementById("js-insert").innerText = myNameIsLooooongNameObject.LoooongKey;

myNameIsLooooongNameObject.LoooongKey = "value3";

document.getElementById("js-insert").innerText = myNameIsLooooongNameObject.LoooongKey;
