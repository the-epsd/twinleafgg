import { Request, Response } from 'express';
import { MatchmakingService } from '../services/matchmaking.service';
import { Controller } from './controller';
import { Server } from 'socket.io';
import { Core } from '../../game/core/core';

export class MatchmakingController extends Controller {
  private matchmakingService: MatchmakingService;
  private io: Server;

  constructor(path: string, router: any, authMiddleware: any, validator: any, io: Server, core: Core) {
    super(path, router, authMiddleware, validator);
    this.matchmakingService = new MatchmakingService(core);
    this.io = io;
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.io.on('connection', (socket) => {
      socket.on('joinQueue', async (data, callback) => {
        try {
          const userId = (socket as any).user?.id;
          await this.matchmakingService.addToQueue(userId, data.format);
          callback({ success: true });
        } catch (error) {
          if (error instanceof Error) {
            callback({ success: false, error: error.message });
          } else {
            callback({ success: false, error: 'An unknown error occurred' });
          }
        }
      });

      socket.on('leaveQueue', () => {
        const userId = (socket as any).user?.id;
        console.log(`WebSocket: User ${userId} attempting to leave queue`);
        this.matchmakingService.removeFromQueue(userId);
      });
    });

    this.matchmakingService.queueUpdates.on('lobbyUpdate', (data) => {
      console.log('Emitting lobby update:', data);
      this.io.emit('queueUpdate', data);
    });

    this.matchmakingService.queueUpdates.on('gameStarted', (data) => {
      console.log('Emitting game started:', data);
      this.io.to(data.players[0]).to(data.players[1]).emit('gameStarted', { gameId: data.gameId });
    });
  }

  public joinQueue = (req: Request & { user?: { id: string } }, res: Response) => {
    const { format } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    this.matchmakingService.addToQueue(userId, format);
    res.status(200).json({ message: 'Joined queue successfully' });
  };

  public leaveQueue = (req: Request & { user?: { id: string } }, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    this.matchmakingService.removeFromQueue(userId);
    res.status(200).json({ message: 'Left queue successfully' });
  };
}