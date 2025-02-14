"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errors_1 = require("../common/errors");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const auth_token_1 = require("../services/auth-token");
async function authMiddleware(socket, next) {
    var _a;
    try {
        const rateLimit = rate_limit_1.RateLimit.getInstance();
        // Validate token exists
        const token = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
        // Get IP address with fallback
        const ipAddress = socket.handshake.headers['x-forwarded-for'] ||
            socket.request.connection.remoteAddress ||
            '0.0.0.0';
        // Check rate limit before any DB operations
        if (rateLimit.isLimitExceeded(ipAddress)) {
            return next(new Error(errors_1.ApiErrorEnum.REQUESTS_LIMIT_REACHED));
        }
        // Validate token and get userId
        const userId = auth_token_1.validateToken(token);
        if (!userId) {
            rateLimit.increment(ipAddress);
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
        // Find user with timeout
        const userPromise = storage_1.User.findOne(userId);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000);
        });
        const user = await Promise.race([userPromise, timeoutPromise]);
        if (!user) {
            rateLimit.increment(ipAddress);
            return next(new Error(errors_1.ApiErrorEnum.AUTH_TOKEN_INVALID));
        }
        // Type-safe way to add user to socket
        socket.user = user;
        next();
    }
    catch (error) {
        // Log error and return generic error to client
        console.error('Auth middleware error:', error);
        return next(new Error(errors_1.ApiErrorEnum.INTERNAL_SERVER_ERROR));
    }
}
exports.authMiddleware = authMiddleware;
