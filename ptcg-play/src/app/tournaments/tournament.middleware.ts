import { Socket } from 'socket.io';

import { SessionService } from '../shared/session/session.service';
import { UserInfo } from 'ptcg-server';
import { TournamentPlayer } from './model/tournament.model';
import { TournamentService } from './service/tournament.service';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}

export class TournamentMiddleware {
  constructor(
    private tournamentService: TournamentService,
    private sessionService: SessionService
  ) { }

  auth() {
    return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
      const token = socket.handshake.query.token as string;

      if (!token || token !== this.sessionService.session.authToken) {
        return next(new Error('Authentication missing'));
      }

      const userId = this.sessionService.session.loggedUserId;
      const user = this.sessionService.session.users[userId];

      // Set user info from session
      socket.user = {
        id: userId.toString(), // Convert number to string
        username: user?.name || ''
      };

      next();
    };
  }

  tournamentAccess() {
    return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
      socket.on('tournament:join', async (tournamentId: number) => {
        try {
          const tournament = await this.tournamentService.getTournamentById(tournamentId).toPromise();

          if (!tournament) {
            socket.emit('error', { message: 'Tournament not found' });
            return;
          }

          // Check if user is participant or organizer
          const isParticipant = tournament.players?.some(
            (p: TournamentPlayer) => p.userId === socket.user?.id
          );
          const isOrganizer = socket.user?.username === 'TheEPSD';

          if (!isParticipant && !isOrganizer) {
            socket.emit('error', { message: 'Not authorized to join tournament room' });
            return;
          }

          socket.join(`tournament:${tournamentId}`);
          socket.emit('tournament:joined', { tournamentId });

        } catch (error) {
          socket.emit('error', { message: 'Error joining tournament room' });
        }
      });

      next();
    };
  }

  rateLimit() {
    const connections = new Map<string, number>();
    const LIMIT = 60; // requests per minute
    const WINDOW = 60000; // 1 minute in milliseconds

    return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
      const userId = socket.user?.id || socket.id;

      const currentTime = Date.now();
      const userConnections = connections.get(userId) || 0;

      if (userConnections >= LIMIT) {
        return next(new Error('Rate limit exceeded'));
      }

      connections.set(userId, userConnections + 1);

      setTimeout(() => {
        const count = connections.get(userId);
        if (count) {
          connections.set(userId, count - 1);
        }
      }, WINDOW);

      next();
    };
  }
}