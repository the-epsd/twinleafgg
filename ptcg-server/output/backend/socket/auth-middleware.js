"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const auth_token_1 = require("../services/auth-token");
async function authMiddleware(socket, next) {
    const rateLimit = rate_limit_1.RateLimit.getInstance();
    const token = socket.handshake.query && socket.handshake.query.token;
    const userId = auth_token_1.validateToken(token);
    const ipAddress = socket.request.connection.remoteAddress || '0.0.0.0';
    if (rateLimit.isLimitExceeded(ipAddress)) {
        return next(new Error(errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED));
    }
    if (userId === 0) {
        rateLimit.increment(ipAddress);
        return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
    }
    const user = await storage_1.User.findOne(userId);
    if (user === undefined) {
        rateLimit.increment(ipAddress);
        return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
    }
    socket.user = user;
    next();
}
exports.authMiddleware = authMiddleware;
