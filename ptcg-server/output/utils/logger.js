"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const config_1 = require("../config");
class Logger {
    log(message) {
        if (!config_1.config.core.debug) {
            return;
        }
        console.log(message);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
