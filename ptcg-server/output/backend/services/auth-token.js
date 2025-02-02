"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = exports.validateToken = exports.generateToken = void 0;
const errors_1 = require("../common/errors");
const md5_1 = require("../../utils/md5");
const rate_limit_1 = require("../common/rate-limit");
const config_1 = require("../../config");
function generateToken(userId, expire) {
    if (expire === undefined) {
        expire = Math.floor(Date.now() / 1000) + config_1.config.backend.tokenExpire;
    }
    const hash = md5_1.Md5.init(process.env.secret + userId + expire);
    return `${userId},${expire},${hash}`;
}
exports.generateToken = generateToken;
function validateToken(token) {
    if (typeof token !== 'string') {
        return 0;
    }
    const [userId, expire] = token.split(',').map(x => parseInt(x, 10) || 0);
    if (token !== generateToken(userId, expire)) {
        return 0;
    }
    if (expire < Math.floor(Date.now() / 1000)) {
        return 0; // token expired
    }
    return userId;
}
exports.validateToken = validateToken;
function AuthToken() {
    const TOKEN_HEADER = 'Auth-Token';
    const rateLimit = rate_limit_1.RateLimit.getInstance();
    return function (target, propertyKey, descriptor) {
        const handler = descriptor.value;
        if (handler === undefined) {
            return;
        }
        descriptor.value = function (req, res) {
            const token = req.header(TOKEN_HEADER) || '';
            const userId = validateToken(token);
            if (rateLimit.isLimitExceeded(req.ip)) {
                res.status(400);
                res.send({ error: errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED });
                return;
            }
            if (!userId) {
                rateLimit.increment(req.ip);
                res.statusCode = 403;
                res.send({ error: errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID });
                return;
            }
            Object.assign(req.body, { userId });
            return handler.apply(this, arguments);
        };
    };
}
exports.AuthToken = AuthToken;
