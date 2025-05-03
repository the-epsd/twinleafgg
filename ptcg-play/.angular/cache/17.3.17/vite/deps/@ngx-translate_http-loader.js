import {
  __publicField
} from "./chunk-BT6DLQRC.js";

// node_modules/@ngx-translate/http-loader/dist/fesm2022/ngx-translate-http-loader.mjs
var TranslateHttpLoader = class {
  constructor(http, prefix = "/assets/i18n/", suffix = ".json") {
    __publicField(this, "http");
    __publicField(this, "prefix");
    __publicField(this, "suffix");
    this.http = http;
    this.prefix = prefix;
    this.suffix = suffix;
  }
  /**
   * Gets the translations from the server
   */
  getTranslation(lang) {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
};
export {
  TranslateHttpLoader
};
//# sourceMappingURL=@ngx-translate_http-loader.js.map
