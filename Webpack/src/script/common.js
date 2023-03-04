import "~/style/common.scss";
import { Module, ModuleText } from "~/script/modules/Module";

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
