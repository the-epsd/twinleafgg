import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  try {
    const rateLimit = RateLimit.getInstance();

    // Validate token exists
    const token: string = socket.handshake.query?.token as string;
    if (!token) {
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }

    // Get IP address with fallback
    const ipAddress: string =
      socket.handshake.headers['x-forwarded-for'] as string ||
      socket.request.connection.remoteAddress ||
      '0.0.0.0';

    // Check rate limit before any DB operations
    if (rateLimit.isLimitExceeded(ipAddress)) {
      return next(new Error(ApiErrorEnum.REQUESTS_LIMIT_REACHED));
    }

    // Validate token and get userId
    const userId = validateToken(token);
    if (!userId) {
      rateLimit.increment(ipAddress);
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }

    // Find user with timeout
    const userPromise = User.findOne(userId);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000);
    });

    const user = await Promise.race([userPromise, timeoutPromise]);
    if (!user) {
      rateLimit.increment(ipAddress);
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }

    // Type-safe way to add user to socket
    (socket as Socket & { user: typeof user }).user = user;
    next();
  } catch (error) {
    // Log error and return generic error to client
    console.error('Auth middleware error:', error);
    return next(new Error(ApiErrorEnum.INTERNAL_SERVER_ERROR));
  }
}
