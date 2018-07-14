// var imgURL = chrome.runtime.getURL("images/myimage.png");

import * as domLoaded from "dom-loaded";
import { injectInternalScript } from "./inject";

(async () => {
  console.log("Hello From Extension");
  await domLoaded;
  injectInternalScript("dom.js");
})();
