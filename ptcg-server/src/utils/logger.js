"use strict";
exports.__esModule = true;
exports.logger = exports.Logger = void 0;
var config_1 = require("../config");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.log = function (message) {
        if (!config_1.config.core.debug) {
            return;
        }
        console.log(message);
    };
    return Logger;
}());
exports.Logger = Logger;
exports.logger = new Logger();
