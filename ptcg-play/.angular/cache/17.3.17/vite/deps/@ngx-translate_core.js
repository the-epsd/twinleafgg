import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  Pipe,
  setClassMetadata,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵgetInheritedFactory,
  ɵɵinject
} from "./chunk-JWP5VVKN.js";
import "./chunk-4LDUOPTP.js";
import {
  defer,
  forkJoin,
  isObservable
} from "./chunk-L6WT4WHF.js";
import {
  concat,
  concatMap,
  map,
  of,
  shareReplay,
  switchMap,
  take
} from "./chunk-Q3Q6CVA2.js";
import "./chunk-24ZYNOED.js";
import {
  __publicField,
  __spreadValues
} from "./chunk-BT6DLQRC.js";

// node_modules/@ngx-translate/core/dist/fesm2022/ngx-translate-core.mjs
var TranslateLoader = class {
};
var _TranslateFakeLoader = class _TranslateFakeLoader extends TranslateLoader {
  getTranslation(lang) {
    return of({});
  }
};
__publicField(_TranslateFakeLoader, "ɵfac", /* @__PURE__ */ (() => {
  let ɵTranslateFakeLoader_BaseFactory;
  return function TranslateFakeLoader_Factory(t) {
    return (ɵTranslateFakeLoader_BaseFactory || (ɵTranslateFakeLoader_BaseFactory = ɵɵgetInheritedFactory(_TranslateFakeLoader)))(t || _TranslateFakeLoader);
  };
})());
__publicField(_TranslateFakeLoader, "ɵprov", ɵɵdefineInjectable({
  token: _TranslateFakeLoader,
  factory: _TranslateFakeLoader.ɵfac
}));
var TranslateFakeLoader = _TranslateFakeLoader;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateFakeLoader, [{
    type: Injectable
  }], null, null);
})();
var MissingTranslationHandler = class {
};
var _FakeMissingTranslationHandler = class _FakeMissingTranslationHandler {
  handle(params) {
    return params.key;
  }
};
__publicField(_FakeMissingTranslationHandler, "ɵfac", function FakeMissingTranslationHandler_Factory(t) {
  return new (t || _FakeMissingTranslationHandler)();
});
__publicField(_FakeMissingTranslationHandler, "ɵprov", ɵɵdefineInjectable({
  token: _FakeMissingTranslationHandler,
  factory: _FakeMissingTranslationHandler.ɵfac
}));
var FakeMissingTranslationHandler = _FakeMissingTranslationHandler;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FakeMissingTranslationHandler, [{
    type: Injectable
  }], null, null);
})();
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true;
  let t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == "object") {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) return false;
      if ((length = o1.length) == o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      keySet = /* @__PURE__ */ Object.create(null);
      for (key in o1) {
        if (!equals(o1[key], o2[key])) {
          return false;
        }
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) && typeof o2[key] !== "undefined") {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}
function isDefined(value) {
  return typeof value !== "undefined" && value !== null;
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {
            [key]: source[key]
          });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {
          [key]: source[key]
        });
      }
    });
  }
  return output;
}
var TranslateParser = class {
};
var _TranslateDefaultParser = class _TranslateDefaultParser extends TranslateParser {
  constructor() {
    super(...arguments);
    __publicField(this, "templateMatcher", /{{\s?([^{}\s]*)\s?}}/g);
  }
  interpolate(expr, params) {
    let result;
    if (typeof expr === "string") {
      result = this.interpolateString(expr, params);
    } else if (typeof expr === "function") {
      result = this.interpolateFunction(expr, params);
    } else {
      result = expr;
    }
    return result;
  }
  getValue(target, key) {
    let keys = typeof key === "string" ? key.split(".") : [key];
    key = "";
    do {
      key += keys.shift();
      if (isDefined(target) && isDefined(target[key]) && (typeof target[key] === "object" || !keys.length)) {
        target = target[key];
        key = "";
      } else if (!keys.length) {
        target = void 0;
      } else {
        key += ".";
      }
    } while (keys.length);
    return target;
  }
  interpolateFunction(fn, params) {
    return fn(params);
  }
  interpolateString(expr, params) {
    if (!params) {
      return expr;
    }
    return expr.replace(this.templateMatcher, (substring, b) => {
      let r = this.getValue(params, b);
      return isDefined(r) ? r : substring;
    });
  }
};
__publicField(_TranslateDefaultParser, "ɵfac", /* @__PURE__ */ (() => {
  let ɵTranslateDefaultParser_BaseFactory;
  return function TranslateDefaultParser_Factory(t) {
    return (ɵTranslateDefaultParser_BaseFactory || (ɵTranslateDefaultParser_BaseFactory = ɵɵgetInheritedFactory(_TranslateDefaultParser)))(t || _TranslateDefaultParser);
  };
})());
__publicField(_TranslateDefaultParser, "ɵprov", ɵɵdefineInjectable({
  token: _TranslateDefaultParser,
  factory: _TranslateDefaultParser.ɵfac
}));
var TranslateDefaultParser = _TranslateDefaultParser;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateDefaultParser, [{
    type: Injectable
  }], null, null);
})();
var TranslateCompiler = class {
};
var _TranslateFakeCompiler = class _TranslateFakeCompiler extends TranslateCompiler {
  compile(value, lang) {
    return value;
  }
  compileTranslations(translations, lang) {
    return translations;
  }
};
__publicField(_TranslateFakeCompiler, "ɵfac", /* @__PURE__ */ (() => {
  let ɵTranslateFakeCompiler_BaseFactory;
  return function TranslateFakeCompiler_Factory(t) {
    return (ɵTranslateFakeCompiler_BaseFactory || (ɵTranslateFakeCompiler_BaseFactory = ɵɵgetInheritedFactory(_TranslateFakeCompiler)))(t || _TranslateFakeCompiler);
  };
})());
__publicField(_TranslateFakeCompiler, "ɵprov", ɵɵdefineInjectable({
  token: _TranslateFakeCompiler,
  factory: _TranslateFakeCompiler.ɵfac
}));
var TranslateFakeCompiler = _TranslateFakeCompiler;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateFakeCompiler, [{
    type: Injectable
  }], null, null);
})();
var TranslateStore = class {
  constructor() {
    /**
     * The default lang to fallback when translations are missing on the current lang
     */
    __publicField(this, "defaultLang");
    /**
     * The lang currently used
     */
    __publicField(this, "currentLang", this.defaultLang);
    /**
     * a list of translations per lang
     */
    __publicField(this, "translations", {});
    /**
     * an array of langs
     */
    __publicField(this, "langs", []);
    /**
     * An EventEmitter to listen to translation change events
     * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
       *     // do something
       * });
     */
    __publicField(this, "onTranslationChange", new EventEmitter());
    /**
     * An EventEmitter to listen to lang change events
     * onLangChange.subscribe((params: LangChangeEvent) => {
       *     // do something
       * });
     */
    __publicField(this, "onLangChange", new EventEmitter());
    /**
     * An EventEmitter to listen to default lang change events
     * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
       *     // do something
       * });
     */
    __publicField(this, "onDefaultLangChange", new EventEmitter());
  }
};
var USE_STORE = new InjectionToken("USE_STORE");
var USE_DEFAULT_LANG = new InjectionToken("USE_DEFAULT_LANG");
var DEFAULT_LANGUAGE = new InjectionToken("DEFAULT_LANGUAGE");
var USE_EXTEND = new InjectionToken("USE_EXTEND");
var _TranslateService = class _TranslateService {
  /**
   *
   * @param store an instance of the store (that is supposed to be unique)
   * @param currentLoader An instance of the loader currently used
   * @param compiler An instance of the compiler currently used
   * @param parser An instance of the parser currently used
   * @param missingTranslationHandler A handler for missing translations.
   * @param useDefaultLang whether we should use default language translation when current language translation is missing.
   * @param isolate whether this service should use the store or not
   * @param extend To make a child module extend (and use) translations from parent modules.
   * @param defaultLanguage Set the default language using configuration
   */
  constructor(store, currentLoader, compiler, parser, missingTranslationHandler, useDefaultLang = true, isolate = false, extend = false, defaultLanguage) {
    __publicField(this, "store");
    __publicField(this, "currentLoader");
    __publicField(this, "compiler");
    __publicField(this, "parser");
    __publicField(this, "missingTranslationHandler");
    __publicField(this, "useDefaultLang");
    __publicField(this, "isolate");
    __publicField(this, "extend");
    __publicField(this, "loadingTranslations");
    __publicField(this, "pending", false);
    __publicField(this, "_onTranslationChange", new EventEmitter());
    __publicField(this, "_onLangChange", new EventEmitter());
    __publicField(this, "_onDefaultLangChange", new EventEmitter());
    __publicField(this, "_defaultLang");
    __publicField(this, "_currentLang");
    __publicField(this, "_langs", []);
    __publicField(this, "_translations", {});
    __publicField(this, "_translationRequests", {});
    this.store = store;
    this.currentLoader = currentLoader;
    this.compiler = compiler;
    this.parser = parser;
    this.missingTranslationHandler = missingTranslationHandler;
    this.useDefaultLang = useDefaultLang;
    this.isolate = isolate;
    this.extend = extend;
    if (defaultLanguage) {
      this.setDefaultLang(defaultLanguage);
    }
  }
  /**
   * An EventEmitter to listen to translation change events
   * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
     *     // do something
     * });
   */
  get onTranslationChange() {
    return this.isolate ? this._onTranslationChange : this.store.onTranslationChange;
  }
  /**
   * An EventEmitter to listen to lang change events
   * onLangChange.subscribe((params: LangChangeEvent) => {
     *     // do something
     * });
   */
  get onLangChange() {
    return this.isolate ? this._onLangChange : this.store.onLangChange;
  }
  /**
   * An EventEmitter to listen to default lang change events
   * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
     *     // do something
     * });
   */
  get onDefaultLangChange() {
    return this.isolate ? this._onDefaultLangChange : this.store.onDefaultLangChange;
  }
  /**
   * The default lang to fallback when translations are missing on the current lang
   */
  get defaultLang() {
    return this.isolate ? this._defaultLang : this.store.defaultLang;
  }
  set defaultLang(defaultLang) {
    if (this.isolate) {
      this._defaultLang = defaultLang;
    } else {
      this.store.defaultLang = defaultLang;
    }
  }
  /**
   * The lang currently used
   */
  get currentLang() {
    return this.isolate ? this._currentLang : this.store.currentLang;
  }
  set currentLang(currentLang) {
    if (this.isolate) {
      this._currentLang = currentLang;
    } else {
      this.store.currentLang = currentLang;
    }
  }
  /**
   * an array of langs
   */
  get langs() {
    return this.isolate ? this._langs : this.store.langs;
  }
  set langs(langs) {
    if (this.isolate) {
      this._langs = langs;
    } else {
      this.store.langs = langs;
    }
  }
  /**
   * a list of translations per lang
   */
  get translations() {
    return this.isolate ? this._translations : this.store.translations;
  }
  set translations(translations) {
    if (this.isolate) {
      this._translations = translations;
    } else {
      this.store.translations = translations;
    }
  }
  /**
   * Sets the default language to use as a fallback
   */
  setDefaultLang(lang) {
    if (lang === this.defaultLang) {
      return;
    }
    let pending = this.retrieveTranslations(lang);
    if (typeof pending !== "undefined") {
      if (this.defaultLang == null) {
        this.defaultLang = lang;
      }
      pending.pipe(take(1)).subscribe((res) => {
        this.changeDefaultLang(lang);
      });
    } else {
      this.changeDefaultLang(lang);
    }
  }
  /**
   * Gets the default language used
   */
  getDefaultLang() {
    return this.defaultLang;
  }
  /**
   * Changes the lang currently used
   */
  use(lang) {
    if (lang === this.currentLang) {
      return of(this.translations[lang]);
    }
    let pending = this.retrieveTranslations(lang);
    if (typeof pending !== "undefined") {
      if (!this.currentLang) {
        this.currentLang = lang;
      }
      pending.pipe(take(1)).subscribe((res) => {
        this.changeLang(lang);
      });
      return pending;
    } else {
      this.changeLang(lang);
      return of(this.translations[lang]);
    }
  }
  /**
   * Retrieves the given translations
   */
  retrieveTranslations(lang) {
    let pending;
    if (typeof this.translations[lang] === "undefined" || this.extend) {
      this._translationRequests[lang] = this._translationRequests[lang] || this.getTranslation(lang);
      pending = this._translationRequests[lang];
    }
    return pending;
  }
  /**
   * Gets an object of translations for a given language with the current loader
   * and passes it through the compiler
   */
  getTranslation(lang) {
    this.pending = true;
    const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(shareReplay(1), take(1));
    this.loadingTranslations = loadingTranslations.pipe(map((res) => this.compiler.compileTranslations(res, lang)), shareReplay(1), take(1));
    this.loadingTranslations.subscribe({
      next: (res) => {
        this.translations[lang] = this.extend && this.translations[lang] ? __spreadValues(__spreadValues({}, res), this.translations[lang]) : res;
        this.updateLangs();
        this.pending = false;
      },
      error: (err) => {
        this.pending = false;
      }
    });
    return loadingTranslations;
  }
  /**
   * Manually sets an object of translations for a given language
   * after passing it through the compiler
   */
  setTranslation(lang, translations, shouldMerge = false) {
    translations = this.compiler.compileTranslations(translations, lang);
    if ((shouldMerge || this.extend) && this.translations[lang]) {
      this.translations[lang] = mergeDeep(this.translations[lang], translations);
    } else {
      this.translations[lang] = translations;
    }
    this.updateLangs();
    this.onTranslationChange.emit({
      lang,
      translations: this.translations[lang]
    });
  }
  /**
   * Returns an array of currently available langs
   */
  getLangs() {
    return this.langs;
  }
  /**
   * Add available langs
   */
  addLangs(langs) {
    langs.forEach((lang) => {
      if (this.langs.indexOf(lang) === -1) {
        this.langs.push(lang);
      }
    });
  }
  /**
   * Update the list of available langs
   */
  updateLangs() {
    this.addLangs(Object.keys(this.translations));
  }
  /**
   * Returns the parsed result of the translations
   */
  getParsedResult(translations, key, interpolateParams) {
    let res;
    if (key instanceof Array) {
      let result = {}, observables = false;
      for (let k of key) {
        result[k] = this.getParsedResult(translations, k, interpolateParams);
        if (isObservable(result[k])) {
          observables = true;
        }
      }
      if (observables) {
        const sources = key.map((k) => isObservable(result[k]) ? result[k] : of(result[k]));
        return forkJoin(sources).pipe(map((arr) => {
          let obj = {};
          arr.forEach((value, index) => {
            obj[key[index]] = value;
          });
          return obj;
        }));
      }
      return result;
    }
    if (translations) {
      res = this.parser.interpolate(this.parser.getValue(translations, key), interpolateParams);
    }
    if (typeof res === "undefined" && this.defaultLang != null && this.defaultLang !== this.currentLang && this.useDefaultLang) {
      res = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], key), interpolateParams);
    }
    if (typeof res === "undefined") {
      let params = {
        key,
        translateService: this
      };
      if (typeof interpolateParams !== "undefined") {
        params.interpolateParams = interpolateParams;
      }
      res = this.missingTranslationHandler.handle(params);
    }
    return typeof res !== "undefined" ? res : key;
  }
  /**
   * Gets the translated value of a key (or an array of keys)
   * @returns the translated key, or an object of translated keys
   */
  get(key, interpolateParams) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    if (this.pending) {
      return this.loadingTranslations.pipe(concatMap((res) => {
        res = this.getParsedResult(res, key, interpolateParams);
        return isObservable(res) ? res : of(res);
      }));
    } else {
      let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
      return isObservable(res) ? res : of(res);
    }
  }
  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the translation changes.
   * @returns A stream of the translated key, or an object of translated keys
   */
  getStreamOnTranslationChange(key, interpolateParams) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    return concat(defer(() => this.get(key, interpolateParams)), this.onTranslationChange.pipe(switchMap((event) => {
      const res = this.getParsedResult(event.translations, key, interpolateParams);
      if (typeof res.subscribe === "function") {
        return res;
      } else {
        return of(res);
      }
    })));
  }
  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the language changes.
   * @returns A stream of the translated key, or an object of translated keys
   */
  stream(key, interpolateParams) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    return concat(defer(() => this.get(key, interpolateParams)), this.onLangChange.pipe(switchMap((event) => {
      const res = this.getParsedResult(event.translations, key, interpolateParams);
      return isObservable(res) ? res : of(res);
    })));
  }
  /**
   * Returns a translation instantly from the internal state of loaded translation.
   * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
   */
  instant(key, interpolateParams) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
    if (isObservable(res)) {
      if (key instanceof Array) {
        let obj = {};
        key.forEach((value, index) => {
          obj[key[index]] = key[index];
        });
        return obj;
      }
      return key;
    } else {
      return res;
    }
  }
  /**
   * Sets the translated value of a key, after compiling it
   */
  set(key, value, lang = this.currentLang) {
    this.translations[lang][key] = this.compiler.compile(value, lang);
    this.updateLangs();
    this.onTranslationChange.emit({
      lang,
      translations: this.translations[lang]
    });
  }
  /**
   * Changes the current lang
   */
  changeLang(lang) {
    this.currentLang = lang;
    this.onLangChange.emit({
      lang,
      translations: this.translations[lang]
    });
    if (this.defaultLang == null) {
      this.changeDefaultLang(lang);
    }
  }
  /**
   * Changes the default lang
   */
  changeDefaultLang(lang) {
    this.defaultLang = lang;
    this.onDefaultLangChange.emit({
      lang,
      translations: this.translations[lang]
    });
  }
  /**
   * Allows to reload the lang file from the file
   */
  reloadLang(lang) {
    this.resetLang(lang);
    return this.getTranslation(lang);
  }
  /**
   * Deletes inner translation
   */
  resetLang(lang) {
    this._translationRequests[lang] = void 0;
    this.translations[lang] = void 0;
  }
  /**
   * Returns the language code name from the browser, e.g. "de"
   */
  getBrowserLang() {
    if (typeof window === "undefined" || typeof window.navigator === "undefined") {
      return void 0;
    }
    let browserLang = window.navigator.languages ? window.navigator.languages[0] : null;
    browserLang = browserLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if (typeof browserLang === "undefined") {
      return void 0;
    }
    if (browserLang.indexOf("-") !== -1) {
      browserLang = browserLang.split("-")[0];
    }
    if (browserLang.indexOf("_") !== -1) {
      browserLang = browserLang.split("_")[0];
    }
    return browserLang;
  }
  /**
   * Returns the culture language code name from the browser, e.g. "de-DE"
   */
  getBrowserCultureLang() {
    if (typeof window === "undefined" || typeof window.navigator === "undefined") {
      return void 0;
    }
    let browserCultureLang = window.navigator.languages ? window.navigator.languages[0] : null;
    browserCultureLang = browserCultureLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    return browserCultureLang;
  }
};
__publicField(_TranslateService, "ɵfac", function TranslateService_Factory(t) {
  return new (t || _TranslateService)(ɵɵinject(TranslateStore), ɵɵinject(TranslateLoader), ɵɵinject(TranslateCompiler), ɵɵinject(TranslateParser), ɵɵinject(MissingTranslationHandler), ɵɵinject(USE_DEFAULT_LANG), ɵɵinject(USE_STORE), ɵɵinject(USE_EXTEND), ɵɵinject(DEFAULT_LANGUAGE));
});
__publicField(_TranslateService, "ɵprov", ɵɵdefineInjectable({
  token: _TranslateService,
  factory: _TranslateService.ɵfac
}));
var TranslateService = _TranslateService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateService, [{
    type: Injectable
  }], function() {
    return [{
      type: TranslateStore
    }, {
      type: TranslateLoader
    }, {
      type: TranslateCompiler
    }, {
      type: TranslateParser
    }, {
      type: MissingTranslationHandler
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [USE_DEFAULT_LANG]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [USE_STORE]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [USE_EXTEND]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [DEFAULT_LANGUAGE]
      }]
    }];
  }, null);
})();
var _TranslateDirective = class _TranslateDirective {
  constructor(translateService, element, _ref) {
    __publicField(this, "translateService");
    __publicField(this, "element");
    __publicField(this, "_ref");
    __publicField(this, "key");
    __publicField(this, "lastParams");
    __publicField(this, "currentParams");
    __publicField(this, "onLangChangeSub");
    __publicField(this, "onDefaultLangChangeSub");
    __publicField(this, "onTranslationChangeSub");
    this.translateService = translateService;
    this.element = element;
    this._ref = _ref;
    if (!this.onTranslationChangeSub) {
      this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe((event) => {
        if (event.lang === this.translateService.currentLang) {
          this.checkNodes(true, event.translations);
        }
      });
    }
    if (!this.onLangChangeSub) {
      this.onLangChangeSub = this.translateService.onLangChange.subscribe((event) => {
        this.checkNodes(true, event.translations);
      });
    }
    if (!this.onDefaultLangChangeSub) {
      this.onDefaultLangChangeSub = this.translateService.onDefaultLangChange.subscribe((event) => {
        this.checkNodes(true);
      });
    }
  }
  set translate(key) {
    if (key) {
      this.key = key;
      this.checkNodes();
    }
  }
  set translateParams(params) {
    if (!equals(this.currentParams, params)) {
      this.currentParams = params;
      this.checkNodes(true);
    }
  }
  ngAfterViewChecked() {
    this.checkNodes();
  }
  checkNodes(forceUpdate = false, translations) {
    let nodes = this.element.nativeElement.childNodes;
    if (!nodes.length) {
      this.setContent(this.element.nativeElement, this.key);
      nodes = this.element.nativeElement.childNodes;
    }
    for (let i = 0; i < nodes.length; ++i) {
      let node = nodes[i];
      if (node.nodeType === 3) {
        let key;
        if (forceUpdate) {
          node.lastKey = null;
        }
        if (isDefined(node.lookupKey)) {
          key = node.lookupKey;
        } else if (this.key) {
          key = this.key;
        } else {
          let content = this.getContent(node);
          let trimmedContent = content.trim();
          if (trimmedContent.length) {
            node.lookupKey = trimmedContent;
            if (content !== node.currentValue) {
              key = trimmedContent;
              node.originalContent = content || node.originalContent;
            } else if (node.originalContent) {
              key = node.originalContent.trim();
            } else if (content !== node.currentValue) {
              key = trimmedContent;
              node.originalContent = content || node.originalContent;
            }
          }
        }
        this.updateValue(key, node, translations);
      }
    }
  }
  updateValue(key, node, translations) {
    if (key) {
      if (node.lastKey === key && this.lastParams === this.currentParams) {
        return;
      }
      this.lastParams = this.currentParams;
      let onTranslation = (res) => {
        if (res !== key) {
          node.lastKey = key;
        }
        if (!node.originalContent) {
          node.originalContent = this.getContent(node);
        }
        node.currentValue = isDefined(res) ? res : node.originalContent || key;
        this.setContent(node, this.key ? node.currentValue : node.originalContent.replace(key, node.currentValue));
        this._ref.markForCheck();
      };
      if (isDefined(translations)) {
        let res = this.translateService.getParsedResult(translations, key, this.currentParams);
        if (isObservable(res)) {
          res.subscribe({
            next: onTranslation
          });
        } else {
          onTranslation(res);
        }
      } else {
        this.translateService.get(key, this.currentParams).subscribe(onTranslation);
      }
    }
  }
  getContent(node) {
    return isDefined(node.textContent) ? node.textContent : node.data;
  }
  setContent(node, content) {
    if (isDefined(node.textContent)) {
      node.textContent = content;
    } else {
      node.data = content;
    }
  }
  ngOnDestroy() {
    if (this.onLangChangeSub) {
      this.onLangChangeSub.unsubscribe();
    }
    if (this.onDefaultLangChangeSub) {
      this.onDefaultLangChangeSub.unsubscribe();
    }
    if (this.onTranslationChangeSub) {
      this.onTranslationChangeSub.unsubscribe();
    }
  }
};
__publicField(_TranslateDirective, "ɵfac", function TranslateDirective_Factory(t) {
  return new (t || _TranslateDirective)(ɵɵdirectiveInject(TranslateService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ChangeDetectorRef));
});
__publicField(_TranslateDirective, "ɵdir", ɵɵdefineDirective({
  type: _TranslateDirective,
  selectors: [["", "translate", ""], ["", "ngx-translate", ""]],
  inputs: {
    translate: "translate",
    translateParams: "translateParams"
  }
}));
var TranslateDirective = _TranslateDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateDirective, [{
    type: Directive,
    args: [{
      selector: "[translate],[ngx-translate]"
    }]
  }], function() {
    return [{
      type: TranslateService
    }, {
      type: ElementRef
    }, {
      type: ChangeDetectorRef
    }];
  }, {
    translate: [{
      type: Input
    }],
    translateParams: [{
      type: Input
    }]
  });
})();
var _TranslatePipe = class _TranslatePipe {
  constructor(translate, _ref) {
    __publicField(this, "translate");
    __publicField(this, "_ref");
    __publicField(this, "value", "");
    __publicField(this, "lastKey", null);
    __publicField(this, "lastParams", []);
    __publicField(this, "onTranslationChange");
    __publicField(this, "onLangChange");
    __publicField(this, "onDefaultLangChange");
    this.translate = translate;
    this._ref = _ref;
  }
  updateValue(key, interpolateParams, translations) {
    let onTranslation = (res) => {
      this.value = res !== void 0 ? res : key;
      this.lastKey = key;
      this._ref.markForCheck();
    };
    if (translations) {
      let res = this.translate.getParsedResult(translations, key, interpolateParams);
      if (isObservable(res.subscribe)) {
        res.subscribe(onTranslation);
      } else {
        onTranslation(res);
      }
    }
    this.translate.get(key, interpolateParams).subscribe(onTranslation);
  }
  transform(query, ...args) {
    if (!query || !query.length) {
      return query;
    }
    if (equals(query, this.lastKey) && equals(args, this.lastParams)) {
      return this.value;
    }
    let interpolateParams = void 0;
    if (isDefined(args[0]) && args.length) {
      if (typeof args[0] === "string" && args[0].length) {
        let validArgs = args[0].replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":').replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (typeof args[0] === "object" && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
    }
    this.lastKey = query;
    this.lastParams = args;
    this.updateValue(query, interpolateParams);
    this._dispose();
    if (!this.onTranslationChange) {
      this.onTranslationChange = this.translate.onTranslationChange.subscribe((event) => {
        if (this.lastKey && event.lang === this.translate.currentLang) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((event) => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }
    if (!this.onDefaultLangChange) {
      this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams);
        }
      });
    }
    return this.value;
  }
  /**
   * Clean any existing subscription to change events
   */
  _dispose() {
    if (typeof this.onTranslationChange !== "undefined") {
      this.onTranslationChange.unsubscribe();
      this.onTranslationChange = void 0;
    }
    if (typeof this.onLangChange !== "undefined") {
      this.onLangChange.unsubscribe();
      this.onLangChange = void 0;
    }
    if (typeof this.onDefaultLangChange !== "undefined") {
      this.onDefaultLangChange.unsubscribe();
      this.onDefaultLangChange = void 0;
    }
  }
  ngOnDestroy() {
    this._dispose();
  }
};
__publicField(_TranslatePipe, "ɵfac", function TranslatePipe_Factory(t) {
  return new (t || _TranslatePipe)(ɵɵdirectiveInject(TranslateService, 16), ɵɵdirectiveInject(ChangeDetectorRef, 16));
});
__publicField(_TranslatePipe, "ɵpipe", ɵɵdefinePipe({
  name: "translate",
  type: _TranslatePipe,
  pure: false
}));
__publicField(_TranslatePipe, "ɵprov", ɵɵdefineInjectable({
  token: _TranslatePipe,
  factory: _TranslatePipe.ɵfac
}));
var TranslatePipe = _TranslatePipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslatePipe, [{
    type: Injectable
  }, {
    type: Pipe,
    args: [{
      name: "translate",
      pure: false
      // required to update the value when the promise is resolved
    }]
  }], function() {
    return [{
      type: TranslateService
    }, {
      type: ChangeDetectorRef
    }];
  }, null);
})();
var _TranslateModule = class _TranslateModule {
  /**
   * Use this method in your root module to provide the TranslateService
   */
  static forRoot(config = {}) {
    return {
      ngModule: _TranslateModule,
      providers: [config.loader || {
        provide: TranslateLoader,
        useClass: TranslateFakeLoader
      }, config.compiler || {
        provide: TranslateCompiler,
        useClass: TranslateFakeCompiler
      }, config.parser || {
        provide: TranslateParser,
        useClass: TranslateDefaultParser
      }, config.missingTranslationHandler || {
        provide: MissingTranslationHandler,
        useClass: FakeMissingTranslationHandler
      }, TranslateStore, {
        provide: USE_STORE,
        useValue: config.isolate
      }, {
        provide: USE_DEFAULT_LANG,
        useValue: config.useDefaultLang
      }, {
        provide: USE_EXTEND,
        useValue: config.extend
      }, {
        provide: DEFAULT_LANGUAGE,
        useValue: config.defaultLanguage
      }, TranslateService]
    };
  }
  /**
   * Use this method in your other (non root) modules to import the directive/pipe
   */
  static forChild(config = {}) {
    return {
      ngModule: _TranslateModule,
      providers: [config.loader || {
        provide: TranslateLoader,
        useClass: TranslateFakeLoader
      }, config.compiler || {
        provide: TranslateCompiler,
        useClass: TranslateFakeCompiler
      }, config.parser || {
        provide: TranslateParser,
        useClass: TranslateDefaultParser
      }, config.missingTranslationHandler || {
        provide: MissingTranslationHandler,
        useClass: FakeMissingTranslationHandler
      }, {
        provide: USE_STORE,
        useValue: config.isolate
      }, {
        provide: USE_DEFAULT_LANG,
        useValue: config.useDefaultLang
      }, {
        provide: USE_EXTEND,
        useValue: config.extend
      }, {
        provide: DEFAULT_LANGUAGE,
        useValue: config.defaultLanguage
      }, TranslateService]
    };
  }
};
__publicField(_TranslateModule, "ɵfac", function TranslateModule_Factory(t) {
  return new (t || _TranslateModule)();
});
__publicField(_TranslateModule, "ɵmod", ɵɵdefineNgModule({
  type: _TranslateModule,
  declarations: [TranslatePipe, TranslateDirective],
  exports: [TranslatePipe, TranslateDirective]
}));
__publicField(_TranslateModule, "ɵinj", ɵɵdefineInjector({}));
var TranslateModule = _TranslateModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateModule, [{
    type: NgModule,
    args: [{
      declarations: [TranslatePipe, TranslateDirective],
      exports: [TranslatePipe, TranslateDirective]
    }]
  }], null, null);
})();
export {
  DEFAULT_LANGUAGE,
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateDirective,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslatePipe,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE
};
//# sourceMappingURL=@ngx-translate_core.js.map
