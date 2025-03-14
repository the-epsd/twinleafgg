"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const auth_token_1 = require("../services/auth-token");
async function authMiddleware(socket, next) {
    try {
        const rateLimit = rate_limit_1.RateLimit.getInstance();
        const token = socket.handshake.query && socket.handshake.query.token;
        console.log('Auth middleware - Processing token:', token ? 'present' : 'missing');
        const userId = auth_token_1.validateToken(token);
        const ipAddress = socket.request.connection.remoteAddress || '0.0.0.0';
        if (rateLimit.isLimitExceeded(ipAddress, 'websocket')) {
            const retryAfter = rateLimit.getRetryAfter(ipAddress, 'websocket');
            const error = new Error(errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED);
            error.retryAfter = retryAfter;
            console.warn(`WebSocket rate limit exceeded for IP ${ipAddress}. Retry after: ${retryAfter}ms`);
            return next(error);
        }
        if (userId === 0) {
            console.log('Invalid token for IP:', ipAddress);
            rateLimit.increment(ipAddress, 'websocket');
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
        const user = await storage_1.User.findOne(userId);
        if (user === undefined) {
            console.log('User not found for ID:', userId);
            rateLimit.increment(ipAddress, 'websocket');
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
        socket.user = user;
        console.log('Auth successful for user:', user.name);
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        next(error);
    }
}
exports.authMiddleware = authMiddleware;
