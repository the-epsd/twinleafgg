"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
const config_1 = require("../../config");
function cors() {
    return function (req, res, next) {
        const allowedHeaders = [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Auth-Token'
        ];
        if (config_1.config.backend.allowCors) {
            res.header('Access-Control-Allow-Origin', '*');
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
        res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
        next();
    };
}
exports.cors = cors;
