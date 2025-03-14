import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  try {
    const rateLimit = RateLimit.getInstance();
    const token: string = socket.handshake.query && socket.handshake.query.token as string;
    console.log('Auth middleware - Processing token:', token ? 'present' : 'missing');

    const userId = validateToken(token);
    const ipAddress: string = socket.request.connection.remoteAddress || '0.0.0.0';

    if (rateLimit.isLimitExceeded(ipAddress, 'websocket')) {
      const retryAfter = rateLimit.getRetryAfter(ipAddress, 'websocket');
      const error = new Error(ApiErrorEnum.REQUESTS_LIMIT_REACHED);
      (error as any).retryAfter = retryAfter;
      console.warn(`WebSocket rate limit exceeded for IP ${ipAddress}. Retry after: ${retryAfter}ms`);
      return next(error);
    }

    if (userId === 0) {
      console.log('Invalid token for IP:', ipAddress);
      rateLimit.increment(ipAddress, 'websocket');
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }

    const user = await User.findOne(userId);
    if (user === undefined) {
      console.log('User not found for ID:', userId);
      rateLimit.increment(ipAddress, 'websocket');
      return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
    }

    (socket as any).user = user;
    console.log('Auth successful for user:', user.name);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
}
