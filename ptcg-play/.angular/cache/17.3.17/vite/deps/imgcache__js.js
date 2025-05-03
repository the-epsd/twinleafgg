import {
  __commonJS
} from "./chunk-BT6DLQRC.js";

// node_modules/imgcache.js/js/imgcache.js
var require_imgcache = __commonJS({
  "node_modules/imgcache.js/js/imgcache.js"(exports, module) {
    var ImgCache = {
      version: "1.1.0",
      // options to override before using the library (but after loading this script!)
      options: {
        debug: false,
        /* call the log method ? */
        localCacheFolder: "imgcache",
        /* name of the cache folder */
        useDataURI: false,
        /* use src="data:.."? otherwise will use src="filesystem:.." */
        chromeQuota: 10 * 1024 * 1024,
        /* allocated cache space : here 10MB */
        usePersistentCache: true,
        /* false = use temporary cache storage */
        cacheClearSize: 0,
        /* size in MB that triggers cache clear on init, 0 to disable */
        headers: {},
        /* HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' } */
        withCredentials: false,
        /* indicates whether or not cross-site Access-Control requests should be made using credentials */
        skipURIencoding: false,
        /* enable if URIs are already encoded (skips call to sanitizeURI) */
        cordovaFilesystemRoot: null,
        /* if specified, use one of the Cordova File plugin's app directories for storage */
        timeout: 0
        /* timeout delay in ms for xhr request */
      },
      overridables: {
        hash: function(s) {
          function U(a, b, c) {
            while (0 < c--) a.push(b);
          }
          function L(a, b) {
            return a << b | a >>> 32 - b;
          }
          function P(a, b, c) {
            return a ^ b ^ c;
          }
          function A(a, b) {
            var c = (b & 65535) + (a & 65535), d = (b >>> 16) + (a >>> 16) + (c >>> 16);
            return (d & 65535) << 16 | c & 65535;
          }
          var B = "0123456789abcdef";
          return function(a) {
            var c = [], d = a.length * 4, e;
            for (var i = 0; i < d; i++) {
              e = a[i >> 2] >> (3 - i % 4) * 8;
              c.push(B.charAt(e >> 4 & 15) + B.charAt(e & 15));
            }
            return c.join("");
          }(function(a, b) {
            var c, d, e, f, g, h = a.length, v = 1732584193, w = 4023233417, x = 2562383102, y = 271733878, z = 3285377520, M = [];
            U(M, 1518500249, 20);
            U(M, 1859775393, 20);
            U(M, 2400959708, 20);
            U(M, 3395469782, 20);
            a[b >> 5] |= 128 << 24 - b % 32;
            a[(b + 65 >> 9 << 4) + 15] = b;
            for (var i = 0; i < h; i += 16) {
              c = v;
              d = w;
              e = x;
              f = y;
              g = z;
              for (var j = 0, O = []; j < 80; j++) {
                O[j] = j < 16 ? a[j + i] : L(O[j - 3] ^ O[j - 8] ^ O[j - 14] ^ O[j - 16], 1);
                var k = function(a2, b2, c2, d2, e2) {
                  var f2 = (e2 & 65535) + (a2 & 65535) + (b2 & 65535) + (c2 & 65535) + (d2 & 65535), g2 = (e2 >>> 16) + (a2 >>> 16) + (b2 >>> 16) + (c2 >>> 16) + (d2 >>> 16) + (f2 >>> 16);
                  return (g2 & 65535) << 16 | f2 & 65535;
                }(j < 20 ? function(t, a2, b2) {
                  return t & a2 ^ ~t & b2;
                }(d, e, f) : j < 40 ? P(d, e, f) : j < 60 ? function(t, a2, b2) {
                  return t & a2 ^ t & b2 ^ a2 & b2;
                }(d, e, f) : P(d, e, f), g, M[j], O[j], L(c, 5));
                g = f;
                f = e;
                e = L(d, 30);
                d = c;
                c = k;
              }
              v = A(v, c);
              w = A(w, d);
              x = A(x, e);
              y = A(y, f);
              z = A(z, g);
            }
            return [v, w, x, y, z];
          }(function(t) {
            var a = [], b = 255, c = t.length * 8;
            for (var i = 0; i < c; i += 8) {
              a[i >> 5] |= (t.charCodeAt(i / 8) & b) << 24 - i % 32;
            }
            return a;
          }(s).slice(), s.length * 8));
        },
        log: function(str, level) {
          "use strict";
          if (ImgCache.options.debug) {
            if (level === LOG_LEVEL_INFO) {
              str = "INFO: " + str;
            }
            if (level === LOG_LEVEL_WARNING) {
              str = "WARN: " + str;
            }
            if (level === LOG_LEVEL_ERROR) {
              str = "ERROR: " + str;
            }
            console.log(str);
          }
        }
      },
      ready: false,
      attributes: {}
    };
    var LOG_LEVEL_INFO = 1;
    var LOG_LEVEL_WARNING = 2;
    var LOG_LEVEL_ERROR = 3;
    (function($) {
      "use strict";
      var Helpers = {};
      Helpers.sanitizeURI = function(uri) {
        if (ImgCache.options.skipURIencoding) {
          return uri;
        } else {
          if (uri.length >= 2 && uri[0] === '"' && uri[uri.length - 1] === '"') {
            uri = uri.substr(1, uri.length - 2);
          }
          var encodedURI = encodeURI(uri);
          return encodedURI;
        }
      };
      Helpers.URI = function(str) {
        if (!str) {
          str = "";
        }
        var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/, result = str.match(parser);
        this.scheme = result[1] || null;
        this.authority = result[2] || null;
        this.path = result[3] || null;
        this.query = result[4] || null;
        this.fragment = result[5] || null;
      };
      Helpers.URIGetFileName = function(fullpath) {
        if (!fullpath) {
          return;
        }
        var idx = fullpath.lastIndexOf("/");
        if (!idx) {
          return;
        }
        return fullpath.substr(idx + 1).toLowerCase();
      };
      Helpers.URIGetPath = function(str) {
        if (!str) {
          return;
        }
        var uri = Helpers.URI(str);
        return uri.path.toLowerCase();
      };
      Helpers.fileGetExtension = function(filename) {
        if (!filename) {
          return "";
        }
        filename = filename.split("?")[0];
        var ext = filename.split(".").pop();
        if (!ext || ext.length > 4) {
          return "";
        }
        return ext;
      };
      Helpers.appendPaths = function(path1, path2) {
        if (!path2) {
          path2 = "";
        }
        if (!path1 || path1 === "") {
          return (path2.length > 0 && path2[0] == "/" ? "" : "/") + path2;
        }
        return path1 + (path1[path1.length - 1] == "/" || path2.length > 0 && path2[0] == "/" ? "" : "/") + path2;
      };
      Helpers.hasJqueryOrJqueryLite = function() {
        return ImgCache.jQuery || ImgCache.jQueryLite;
      };
      Helpers.isCordova = function() {
        return typeof cordova !== "undefined" || typeof phonegap !== "undefined";
      };
      Helpers.isCordovaAndroid = function() {
        return Helpers.isCordova() && device && device.platform && device.platform.toLowerCase().indexOf("android") >= 0;
      };
      Helpers.isCordovaWindowsPhone = function() {
        return Helpers.isCordova() && device && device.platform && (device.platform.toLowerCase().indexOf("win32nt") >= 0 || device.platform.toLowerCase().indexOf("windows") >= 0);
      };
      Helpers.isCordovaIOS = function() {
        return Helpers.isCordova() && device && device.platform && device.platform.toLowerCase() === "ios";
      };
      Helpers.isCordovaAndroidOlderThan3_3 = function() {
        return Helpers.isCordovaAndroid() && device.version && (device.version.indexOf("2.") === 0 || device.version.indexOf("3.0") === 0 || device.version.indexOf("3.1") === 0 || device.version.indexOf("3.2") === 0);
      };
      Helpers.isCordovaAndroidOlderThan4 = function() {
        return Helpers.isCordovaAndroid() && device.version && (device.version.indexOf("2.") === 0 || device.version.indexOf("3.") === 0);
      };
      Helpers.EntryToURL = function(entry) {
        if (Helpers.isCordovaAndroidOlderThan4() && typeof entry.toNativeURL === "function") {
          return entry.toNativeURL();
        } else if (typeof entry.toInternalURL === "function") {
          return entry.toInternalURL();
        } else {
          return entry.toURL();
        }
      };
      Helpers.EntryGetURL = function(entry) {
        return typeof entry.toURL === "function" ? Helpers.EntryToURL(entry) : entry.toURI();
      };
      Helpers.EntryGetPath = function(entry) {
        if (Helpers.isCordova()) {
          if (Helpers.isCordovaIOS()) {
            if (Helpers.isCordovaAndroidOlderThan3_3()) {
              return entry.fullPath;
            } else {
              return entry.nativeURL;
            }
          }
          return typeof entry.toURL === "function" ? Helpers.EntryToURL(entry) : entry.fullPath;
        } else {
          return entry.fullPath;
        }
      };
      Helpers.getCordovaStorageType = function(isPersistent) {
        if (typeof LocalFileSystem !== "undefined") {
          if (isPersistent && LocalFileSystem.hasOwnProperty("PERSISTENT")) {
            return LocalFileSystem.PERSISTENT;
          }
          if (!isPersistent && LocalFileSystem.hasOwnProperty("TEMPORARY")) {
            return LocalFileSystem.TEMPORARY;
          }
        }
        return isPersistent ? window.PERSISTENT : window.TEMPORARY;
      };
      var DomHelpers = {};
      DomHelpers.trigger = function(DomElement, eventName) {
        if (ImgCache.jQuery) {
          $(DomElement).trigger(eventName);
        } else {
          if (Helpers.isCordovaWindowsPhone() || !window.CustomEvent) {
            window.CustomEvent = function CustomEvent2(type, params) {
              var event;
              params = params || { bubbles: false, cancelable: false, detail: void 0 };
              try {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
              } catch (error) {
                event = document.createEvent("Event");
                event.initEvent(type, params.bubbles, params.cancelable);
                event.detail = params.detail;
              }
              return event;
            };
          }
          DomElement.dispatchEvent(new CustomEvent(eventName));
        }
      };
      DomHelpers.removeAttribute = function(element, attrName) {
        if (Helpers.hasJqueryOrJqueryLite()) {
          element.removeAttr(attrName);
        } else {
          element.removeAttribute(attrName);
        }
      };
      DomHelpers.setAttribute = function(element, attrName, value) {
        if (Helpers.hasJqueryOrJqueryLite()) {
          element.attr(attrName, value);
        } else {
          element.setAttribute(attrName, value);
        }
      };
      DomHelpers.getAttribute = function(element, attrName) {
        if (Helpers.hasJqueryOrJqueryLite()) {
          return element.attr(attrName);
        } else {
          return element.getAttribute(attrName);
        }
      };
      DomHelpers.getBackgroundImage = function(element) {
        if (Helpers.hasJqueryOrJqueryLite()) {
          return element.attr("data-old-background") ? "url(" + element.attr("data-old-background") + ")" : element.css("background-image");
        } else {
          var style = window.getComputedStyle(element, null);
          if (!style) {
            return;
          }
          return element.getAttribute("data-old-background") ? "url(" + element.getAttribute("data-old-background") + ")" : style.backgroundImage;
        }
      };
      DomHelpers.setBackgroundImage = function(element, styleValue) {
        if (Helpers.hasJqueryOrJqueryLite()) {
          element.css("background-image", styleValue);
        } else {
          element.style.backgroundImage = styleValue;
        }
      };
      var Private = { attributes: {} };
      Private.isImgCacheLoaded = function() {
        if (!ImgCache.attributes.filesystem || !ImgCache.attributes.dirEntry) {
          ImgCache.overridables.log("ImgCache not loaded yet! - Have you called ImgCache.init() first?", LOG_LEVEL_WARNING);
          return false;
        }
        return true;
      };
      Private.attributes.hasLocalStorage = false;
      Private.hasLocalStorage = function() {
        if (Private.attributes.hasLocalStorage) {
          return Private.attributes.hasLocalStorage;
        }
        try {
          var mod = ImgCache.overridables.hash("imgcache_test");
          localStorage.setItem(mod, mod);
          localStorage.removeItem(mod);
          Private.attributes.hasLocalStorage = true;
          return true;
        } catch (e) {
          ImgCache.overridables.log("Could not write to local storage: " + e.message, LOG_LEVEL_INFO);
          return false;
        }
      };
      Private.setCurrentSize = function(curSize) {
        ImgCache.overridables.log("current size: " + curSize, LOG_LEVEL_INFO);
        if (Private.hasLocalStorage()) {
          localStorage.setItem("imgcache:" + ImgCache.options.localCacheFolder, curSize);
        }
      };
      Private.getCachedFilePath = function(img_src) {
        return Helpers.appendPaths(ImgCache.options.localCacheFolder, Private.getCachedFileName(img_src));
      };
      Private.getCachedFileFullPath = function(img_src) {
        var local_root = Helpers.EntryGetPath(ImgCache.attributes.dirEntry);
        return Helpers.appendPaths(local_root, Private.getCachedFileName(img_src));
      };
      Private.getCachedFileName = function(img_src) {
        if (!img_src) {
          ImgCache.overridables.log("No source given to getCachedFileName", LOG_LEVEL_WARNING);
          return;
        }
        var hash = ImgCache.overridables.hash(img_src);
        var ext = Helpers.fileGetExtension(Helpers.URIGetFileName(img_src));
        return hash + (ext ? "." + ext : "");
      };
      Private.setNewImgPath = function($img, new_src, old_src) {
        DomHelpers.setAttribute($img, "src", new_src);
        DomHelpers.setAttribute($img, OLD_SRC_ATTR, old_src);
      };
      Private.createCacheDir = function(success_callback, error_callback) {
        if (!ImgCache.attributes.filesystem) {
          ImgCache.overridables.log("Filesystem instance was not initialised", LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
          return;
        }
        var _fail = function(error) {
          ImgCache.overridables.log("Failed to get/create local cache directory: " + error.code, LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
        };
        var _getDirSuccess = function(dirEntry) {
          ImgCache.attributes.dirEntry = dirEntry;
          ImgCache.overridables.log("Local cache folder opened: " + Helpers.EntryGetPath(dirEntry), LOG_LEVEL_INFO);
          if (Helpers.isCordovaAndroid()) {
            var _androidNoMediaFileCreated = function() {
              ImgCache.overridables.log(".nomedia file created.", LOG_LEVEL_INFO);
              if (success_callback) {
                success_callback();
              }
            };
            dirEntry.getFile(".nomedia", { create: true, exclusive: false }, _androidNoMediaFileCreated, _fail);
          } else if (!Helpers.isCordovaWindowsPhone()) {
            if (Helpers.isCordovaIOS() && dirEntry.setMetadata) {
              dirEntry.setMetadata(
                function() {
                  ImgCache.overridables.log("com.apple.MobileBackup metadata set", LOG_LEVEL_INFO);
                },
                function() {
                  ImgCache.overridables.log("com.apple.MobileBackup metadata could not be set", LOG_LEVEL_WARNING);
                },
                { "com.apple.MobileBackup": 1 }
                // 1=NO backup oddly enough..
              );
            }
            if (success_callback) {
              success_callback();
            }
          } else {
            if (success_callback) {
              success_callback();
            }
          }
          ImgCache.ready = true;
          DomHelpers.trigger(document, IMGCACHE_READY_TRIGGERED_EVENT);
        };
        ImgCache.attributes.filesystem.root.getDirectory(ImgCache.options.localCacheFolder, { create: true, exclusive: false }, _getDirSuccess, _fail);
      };
      Private.FileTransferWrapper = function(filesystem) {
        if (Helpers.isCordova()) {
          this.fileTransfer = new FileTransfer();
        }
        this.filesystem = filesystem;
      };
      Private.FileTransferWrapper.prototype.download = function(uri, localPath, success_callback, error_callback, on_progress) {
        var headers = ImgCache.options.headers || {};
        var isOnProgressAvailable = typeof on_progress === "function";
        if (this.fileTransfer) {
          if (isOnProgressAvailable) {
            this.fileTransfer.onprogress = on_progress;
          }
          return this.fileTransfer.download(uri, localPath, success_callback, error_callback, false, { "headers": headers });
        }
        var filesystem = this.filesystem;
        var _fail = function(str, level, error_callback2) {
          ImgCache.overridables.log(str, level);
          if (error_callback2) {
            error_callback2({ code: 0, source: uri, target: localPath });
          }
        };
        var xhr = new XMLHttpRequest();
        xhr.open("GET", uri, true);
        if (isOnProgressAvailable) {
          xhr.onprogress = on_progress;
        }
        if (ImgCache.options.withCredentials) {
          xhr.withCredentials = true;
        }
        xhr.timeout = ImgCache.options.timeout;
        xhr.responseType = "blob";
        for (var key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
        xhr.onload = function() {
          if (xhr.response && (xhr.status === 200 || xhr.status === 0)) {
            filesystem.root.getFile(localPath, { create: true }, function(fileEntry) {
              fileEntry.createWriter(function(writer) {
                writer.onerror = error_callback;
                writer.onwriteend = function() {
                  success_callback(fileEntry);
                };
                writer.write(xhr.response, error_callback);
              }, error_callback);
            }, error_callback);
          } else {
            _fail("Image " + uri + " could not be downloaded - status: " + xhr.status, 3, error_callback);
          }
        };
        xhr.onerror = function() {
          _fail("XHR error - Image " + uri + " could not be downloaded - status: " + xhr.status, 3, error_callback);
        };
        xhr.send();
      };
      Private.getBackgroundImageURL = function($div) {
        var backgroundImageProperty = DomHelpers.getBackgroundImage($div);
        if (!backgroundImageProperty) {
          return;
        }
        var regexp = /url\s?\((.+)\)/;
        var img_src = regexp.exec(backgroundImageProperty)[1];
        return img_src.replace(/(['"])/g, "");
      };
      Private.loadCachedFile = function($element, img_src, set_path_callback, success_callback, error_callback) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        if (!$element) {
          return;
        }
        var filename = Helpers.URIGetFileName(img_src);
        var _gotFileEntry = function(entry) {
          if (ImgCache.options.useDataURI) {
            var _win = function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                var base64content = e.target.result;
                if (!base64content) {
                  ImgCache.overridables.log("File in cache " + filename + " is empty", LOG_LEVEL_WARNING);
                  if (error_callback) {
                    error_callback($element);
                  }
                  return;
                }
                set_path_callback($element, base64content, img_src);
                ImgCache.overridables.log("File " + filename + " loaded from cache", LOG_LEVEL_INFO);
                if (success_callback) {
                  success_callback($element);
                }
              };
              reader.readAsDataURL(file);
            };
            var _fail2 = function(error) {
              ImgCache.overridables.log("Failed to read file " + error.code, LOG_LEVEL_ERROR);
              if (error_callback) {
                error_callback($element);
              }
            };
            entry.file(_win, _fail2);
          } else {
            var new_url = Helpers.EntryGetURL(entry);
            set_path_callback($element, new_url, img_src);
            ImgCache.overridables.log("File " + filename + " loaded from cache", LOG_LEVEL_INFO);
            if (success_callback) {
              success_callback($element);
            }
          }
        };
        var _fail = function() {
          ImgCache.overridables.log("File " + filename + " not in cache", LOG_LEVEL_INFO);
          if (error_callback) {
            error_callback($element);
          }
        };
        ImgCache.attributes.filesystem.root.getFile(Private.getCachedFilePath(img_src), { create: false }, _gotFileEntry, _fail);
      };
      var OLD_SRC_ATTR = "data-old-src", OLD_BACKGROUND_ATTR = "data-old-background", IMGCACHE_READY_TRIGGERED_EVENT = "ImgCacheReady";
      ImgCache.init = function(success_callback, error_callback) {
        ImgCache.jQuery = window.jQuery || window.Zepto ? true : false;
        ImgCache.jQueryLite = typeof window.angular !== "undefined" && window.angular.element ? true : false;
        ImgCache.attributes.init_callback = success_callback;
        ImgCache.overridables.log("ImgCache initialising", LOG_LEVEL_INFO);
        var _checkSize = function(callback) {
          if (ImgCache.options.cacheClearSize > 0) {
            var curSize = ImgCache.getCurrentSize();
            if (curSize > ImgCache.options.cacheClearSize * 1024 * 1024) {
              ImgCache.clearCache(callback, callback);
            } else {
              if (callback) {
                callback();
              }
            }
          } else {
            if (callback) {
              callback();
            }
          }
        };
        var _gotFS = function(filesystem) {
          ImgCache.overridables.log("LocalFileSystem opened", LOG_LEVEL_INFO);
          ImgCache.attributes.filesystem = filesystem;
          Private.createCacheDir(function() {
            _checkSize(ImgCache.attributes.init_callback);
          }, error_callback);
        };
        var _fail = function(error) {
          ImgCache.overridables.log("Failed to initialise LocalFileSystem " + error.code, LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
        };
        if (Helpers.isCordova() && window.requestFileSystem) {
          if (ImgCache.options.cordovaFilesystemRoot) {
            try {
              window.resolveLocalFileSystemURL(
                ImgCache.options.cordovaFilesystemRoot,
                function(dirEntry) {
                  _gotFS({ root: dirEntry });
                },
                _fail
              );
            } catch (e) {
              _fail({ code: e.message });
            }
          } else {
            window.requestFileSystem(Helpers.getCordovaStorageType(ImgCache.options.usePersistentCache), 0, _gotFS, _fail);
          }
        } else {
          var savedFS = window.requestFileSystem || window.webkitRequestFileSystem;
          window.storageInfo = window.storageInfo || (ImgCache.options.usePersistentCache ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage);
          if (!window.storageInfo) {
            ImgCache.overridables.log("Your browser does not support the html5 File API", LOG_LEVEL_WARNING);
            if (error_callback) {
              error_callback();
            }
            return;
          }
          var quota_size = ImgCache.options.chromeQuota;
          window.storageInfo.requestQuota(
            quota_size,
            function() {
              var persistence = ImgCache.options.usePersistentCache ? window.storageInfo.PERSISTENT : window.storageInfo.TEMPORARY;
              savedFS(persistence, quota_size, _gotFS, _fail);
            },
            function(error) {
              ImgCache.overridables.log("Failed to request quota: " + error.message, LOG_LEVEL_ERROR);
              if (error_callback) {
                error_callback();
              }
            }
          );
        }
      };
      ImgCache.getCurrentSize = function() {
        if (Private.hasLocalStorage()) {
          var curSize = localStorage.getItem("imgcache:" + ImgCache.options.localCacheFolder);
          if (curSize === null) {
            return 0;
          }
          return parseInt(curSize, 10);
        } else {
          return 0;
        }
      };
      ImgCache.cacheFile = function(img_src, success_callback, error_callback, on_progress) {
        if (!Private.isImgCacheLoaded() || !img_src) {
          return;
        }
        img_src = Helpers.sanitizeURI(img_src);
        var filePath = Private.getCachedFileFullPath(img_src);
        var fileTransfer = new Private.FileTransferWrapper(ImgCache.attributes.filesystem);
        fileTransfer.download(
          img_src,
          filePath,
          function(entry) {
            entry.getMetadata(function(metadata) {
              if (metadata && "size" in metadata) {
                ImgCache.overridables.log("Cached file size: " + metadata.size, LOG_LEVEL_INFO);
                Private.setCurrentSize(ImgCache.getCurrentSize() + parseInt(metadata.size, 10));
              } else {
                ImgCache.overridables.log("No metadata size property available", LOG_LEVEL_INFO);
              }
            });
            ImgCache.overridables.log("Download complete: " + Helpers.EntryGetPath(entry), LOG_LEVEL_INFO);
            if (entry.setMetadata) {
              entry.setMetadata(
                function() {
                  ImgCache.overridables.log("com.apple.MobileBackup metadata set", LOG_LEVEL_INFO);
                },
                function() {
                  ImgCache.overridables.log("com.apple.MobileBackup metadata could not be set", LOG_LEVEL_WARNING);
                },
                { "com.apple.MobileBackup": 1 }
                // 1=NO backup oddly enough..
              );
            }
            if (success_callback) {
              success_callback(entry.toURL());
            }
          },
          function(error) {
            if (error.source) {
              ImgCache.overridables.log("Download error source: " + error.source, LOG_LEVEL_ERROR);
            }
            if (error.target) {
              ImgCache.overridables.log("Download error target: " + error.target, LOG_LEVEL_ERROR);
            }
            ImgCache.overridables.log("Download error code: " + error.code, LOG_LEVEL_ERROR);
            if (error_callback) {
              error_callback();
            }
          },
          on_progress
        );
      };
      ImgCache.getCachedFile = function(img_src, response_callback) {
        if (!Private.isImgCacheLoaded() || !response_callback) {
          return;
        }
        var original_img_src = img_src;
        img_src = Helpers.sanitizeURI(img_src);
        var path = Private.getCachedFilePath(img_src);
        if (Helpers.isCordovaAndroid()) {
          if (path.indexOf("file://") === 0) {
            path = path.substr(7);
          }
        }
        ImgCache.attributes.filesystem.root.getFile(
          path,
          { create: false },
          function(file_entry) {
            response_callback(img_src, file_entry);
          },
          function() {
            response_callback(original_img_src, null);
          }
        );
      };
      ImgCache.getCachedFileURL = function(img_src, success_callback, error_callback) {
        var _getURL = function(img_src2, entry) {
          if (!entry) {
            if (error_callback) {
              error_callback(img_src2);
            }
          } else {
            success_callback(img_src2, Helpers.EntryGetURL(entry));
          }
        };
        ImgCache.getCachedFile(img_src, _getURL);
      };
      ImgCache.isCached = function(img_src, response_callback) {
        ImgCache.getCachedFile(img_src, function(src, file_entry) {
          response_callback(src, file_entry !== null);
        });
      };
      ImgCache.useOnlineFile = function($img) {
        if (!Private.isImgCacheLoaded() || !$img) {
          return;
        }
        var prev_src = DomHelpers.getAttribute($img, OLD_SRC_ATTR);
        if (prev_src) {
          DomHelpers.setAttribute($img, "src", prev_src);
        }
        DomHelpers.removeAttribute($img, OLD_SRC_ATTR);
      };
      ImgCache.useCachedFile = function($img, success_callback, error_callback) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        Private.loadCachedFile($img, DomHelpers.getAttribute($img, "src"), Private.setNewImgPath, success_callback, error_callback);
      };
      ImgCache.useCachedFileWithSource = function($img, image_url, success_callback, error_callback) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        var img_url = Helpers.sanitizeURI(image_url);
        Private.loadCachedFile($img, img_url, Private.setNewImgPath, success_callback, error_callback);
      };
      ImgCache.clearCache = function(success_callback, error_callback) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        ImgCache.attributes.dirEntry.removeRecursively(
          function() {
            ImgCache.overridables.log("Local cache cleared", LOG_LEVEL_INFO);
            Private.setCurrentSize(0);
            Private.createCacheDir(success_callback, error_callback);
          },
          function(error) {
            ImgCache.overridables.log("Failed to remove directory or its contents: " + error.code, LOG_LEVEL_ERROR);
            if (error_callback) {
              error_callback();
            }
          }
        );
      };
      ImgCache.removeFile = function(img_src, success_callback, error_callback) {
        img_src = Helpers.sanitizeURI(img_src);
        var filePath = Private.getCachedFilePath(img_src);
        var _fail = function(error) {
          ImgCache.overridables.log("Failed to remove file due to " + error.code, LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
        };
        ImgCache.attributes.filesystem.root.getFile(filePath, { create: false }, function(fileEntry) {
          fileEntry.remove(
            function() {
              if (success_callback) {
                success_callback();
              }
            },
            _fail
          );
        }, _fail);
      };
      ImgCache.isBackgroundCached = function($div, response_callback) {
        var img_src = Private.getBackgroundImageURL($div);
        ImgCache.getCachedFile(img_src, function(src, file_entry) {
          response_callback(src, file_entry !== null);
        });
      };
      ImgCache.cacheBackground = function($div, success_callback, error_callback, on_progress) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        var img_src = Private.getBackgroundImageURL($div);
        if (!img_src) {
          ImgCache.overridables.log("No background to cache", LOG_LEVEL_WARNING);
          if (error_callback) {
            error_callback();
          }
          return;
        }
        ImgCache.overridables.log("Background image URL: " + img_src, LOG_LEVEL_INFO);
        ImgCache.cacheFile(img_src, success_callback, error_callback, on_progress);
      };
      ImgCache.useCachedBackground = function($div, success_callback, error_callback) {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        var img_src = Private.getBackgroundImageURL($div);
        if (!img_src) {
          ImgCache.overridables.log("No background to cache", LOG_LEVEL_WARNING);
          if (error_callback) {
            error_callback();
          }
          return;
        }
        var _setBackgroundImagePath = function($element, new_src, old_src) {
          DomHelpers.setBackgroundImage($element, 'url("' + new_src + '")');
          DomHelpers.setAttribute($element, OLD_BACKGROUND_ATTR, old_src);
        };
        Private.loadCachedFile($div, img_src, _setBackgroundImagePath, success_callback, error_callback);
      };
      ImgCache.useBackgroundOnlineFile = function($div) {
        if (!$div) {
          return;
        }
        var prev_src = DomHelpers.getAttribute($div, OLD_BACKGROUND_ATTR);
        if (prev_src) {
          DomHelpers.setBackgroundImage($div, 'url("' + prev_src + '")');
        }
        DomHelpers.removeAttribute($div, OLD_BACKGROUND_ATTR);
      };
      ImgCache.getCacheFolderURI = function() {
        if (!Private.isImgCacheLoaded()) {
          return;
        }
        return Helpers.EntryGetURL(ImgCache.attributes.dirEntry);
      };
      ImgCache.helpers = Helpers;
      ImgCache.domHelpers = DomHelpers;
      ImgCache.private = Private;
      if (typeof define === "function" && define.amd) {
        define("imgcache", [], function() {
          return ImgCache;
        });
      } else if (typeof module === "object" && module.exports) {
        module.exports = ImgCache;
      } else {
        window.ImgCache = ImgCache;
      }
    })(window.jQuery || window.Zepto || function() {
      throw "jQuery is not available";
    });
  }
});
export default require_imgcache();
/*! Bundled license information:

imgcache.js/js/imgcache.js:
  (*! imgcache.js
     Copyright 2012-2017 Christophe BENOIT
  
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
  
         http://www.apache.org/licenses/LICENSE-2.0
  
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  *)
*/
//# sourceMappingURL=imgcache__js.js.map
