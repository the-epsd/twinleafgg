import { json } from 'body-parser';
import * as express from 'express';

import { config } from '../config';
import { BotManager } from '../game/bots/bot-manager';
import { Core } from '../game/core/core';
import { Storage } from '../storage';
import { cors } from './services/cors';
import { WebSocketServer } from './socket/websocket-server';

import {
  Avatars,
  Cards,
  ControllerClass,
  Decks,
  Friends,
  Game,
  Login,
  Messages,
  Profile,
  Ranking,
  Replays,
  ResetPassword,
  BattlePass,
  Artworks,
} from './controllers';

export class App {

  private app: express.Application;
  private ws: WebSocketServer;
  private storage: Storage;
  private core: Core = new Core();

  constructor() {
    this.storage = new Storage();
    this.app = this.configureExpress();
    this.ws = this.configureWebSocket();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const core = this.core;
    const app = express();

    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage, core);
      instance.init();
    };

    app.use(json({ limit: 512 + config.backend.avatarFileSize * 4 }));
    app.use(cors());

    // Health check endpoint - must be first route
    app.get('/health', async (req, res) => {
      try {
        // Check database connection
        const dbStatus = await storage.checkConnection();
        res.status(200).json({
          status: 'ok',
          database: dbStatus ? 'connected' : 'disconnected',
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({
          status: 'error',
          database: 'error',
          error: error?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Static files
    if (config.sets.scansDir) {
      app.use('/scans', express.static(config.sets.scansDir));
    }
    app.use('/avatars', express.static(config.backend.avatarsDir));

    // API routes
    define('/v1/avatars', Avatars);
    define('/v1/cards', Cards);
    define('/v1/decks', Decks);
    define('/v1/friends', Friends);
    define('/v1/game', Game);
    define('/v1/login', Login);
    define('/v1/messages', Messages);
    define('/v1/profile', Profile);
    define('/v1/ranking', Ranking);
    define('/v1/replays', Replays);
    define('/v1/resetPassword', ResetPassword);
    define('/v1/battlepass', BattlePass);
    define('/v1/artworks', Artworks);

    app.use((err: any, req: any, res: any, next: any) => {
      // Handle request aborted errors
      if (err && (
        (err.type === 'request.aborted') ||
        (err.code === 'ECONNRESET') ||
        (err.status === 400 && err.message === 'request aborted')
      )) {
        console.log(`[HTTP] Request aborted by client: ${req.method} ${req.url}`);
        return;
      }

      // Log other errors
      console.error('[HTTP Error]', err.stack);

      // Only send response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).send('Something broke!');
      }
    });

    return app;
  }

  private configureWebSocket(): WebSocketServer {
    const ws = new WebSocketServer(this.core);

    ws.server?.on('error', (error) => {
      console.error(error);
    });

    return ws;
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public configureBotManager(botManager: BotManager): void {
    botManager.initBots(this.core);
  }

  public start(): void {
    const address = config.backend.address;
    const port = config.backend.port;

    const httpServer = this.app.listen(port, address, () => {
      console.log(`Server listening on ${address}:${port}.`);
    });

    this.ws.listen(httpServer);
  }

}
