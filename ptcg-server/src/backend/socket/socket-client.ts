import { Server, Socket } from 'socket.io';
import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Message, User } from '../../storage';
import { CoreSocket } from './core-socket';
import { GameSocket } from './game-socket';
import { MessageSocket } from './message-socket';
import { SocketCache } from './socket-cache';
import { SocketWrapper } from './socket-wrapper';
import { MatchmakingSocket } from './matchmaking-socket';

export class SocketClient implements Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public games: Game[] = [];
  public core: Core;
  public socket: Socket;
  private socketWrapper: SocketWrapper;
  private cache: SocketCache = new SocketCache();
  private coreSocket: CoreSocket;
  private gameSocket: GameSocket;
  private messageSocket: MessageSocket;
  private matchmakingSocket: MatchmakingSocket;
  private _isDisposed: boolean = false;

  constructor(user: User, core: Core, io: Server, socket: Socket) {
    // First check if this user is already in any active games
    const activeGames = core.games.filter(game =>
      game.state.players.some(player => player.name === user.name)
    );

    if (activeGames.length > 0) {
      // If user is in active games, use their player ID from the game
      const player = activeGames[0].state.players.find(p => p.name === user.name);
      if (player) {
        this.id = player.id;
        console.log(`[Socket] Reusing existing player ID ${this.id} for ${user.name}`);
      } else {
        this.id = Math.floor(Math.random() * 1000000);
      }
    } else {
      // If not in any active games, generate new ID
      this.id = Math.floor(Math.random() * 1000000);
    }

    this.user = user;
    this.name = user.name;
    this.socket = socket;
    this.socketWrapper = new SocketWrapper(io, socket);
    this.core = core;

    console.log(`[Socket] Client created: ${user.name} [${this.id}]`);

    this.coreSocket = new CoreSocket(this, this.socketWrapper, core, this.cache);
    this.gameSocket = new GameSocket(this, this.socketWrapper, core, this.cache);
    this.messageSocket = new MessageSocket(this, this.socketWrapper, core);
    this.matchmakingSocket = new MatchmakingSocket(this, this.socketWrapper, core);
  }

  public onConnect(client: Client): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onConnect(client);
    } catch (error: any) {
      console.error(`[Socket] Connect error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onDisconnect(client: Client): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onDisconnect(client);
    } catch (error: any) {
      console.error(`[Socket] Disconnect error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onGameAdd(game: Game): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onGameAdd(game);
    } catch (error: any) {
      console.error(`[Socket] Game add error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onGameDelete(game: Game): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onGameDelete(game);
    } catch (error: any) {
      console.error(`[Socket] Game delete error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onUsersUpdate(users: User[]): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onUsersUpdate(users);
    } catch (error: any) {
      console.error(`[Socket] Users update error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onStateChange(game: Game, state: State): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onStateChange(game, state);
      this.gameSocket.onStateChange(game, state);
    } catch (error: any) {
      console.error(`[Socket] State change error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onGameJoin(game: Game, client: Client): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onGameJoin(game, client);
    } catch (error: any) {
      console.error(`[Socket] Game join error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onGameLeave(game: Game, client: Client): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onGameLeave(game, client);
    } catch (error: any) {
      console.error(`[Socket] Game leave error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onJoinQueue(from: Client, message: Message): void {
    try {
      if (this._isDisposed) return;
      this.matchmakingSocket.onJoinQueue(from, message);
    } catch (error: any) {
      console.error(`[Socket] Queue join error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onLeaveQueue(): void {
    try {
      if (this._isDisposed) return;
      this.matchmakingSocket.onLeaveQueue();
    } catch (error: any) {
      console.error(`[Socket] Queue leave error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onMessage(from: Client, message: Message): void {
    try {
      if (this._isDisposed) return;
      this.messageSocket.onMessage(from, message);
    } catch (error: any) {
      console.error(`[Socket] Message error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onMessageRead(user: User): void {
    try {
      if (this._isDisposed) return;
      this.messageSocket.onMessageRead(user);
    } catch (error: any) {
      console.error(`[Socket] Message read error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onPlayerDisconnect(game: Game, player: Player): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onPlayerDisconnect(game, player);
    } catch (error: any) {
      console.error(`[Socket] Player disconnect error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public onPlayerReconnect(game: Game, player: Player): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onPlayerReconnect(game, player);
    } catch (error: any) {
      console.error(`[Socket] Player reconnect error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public attachListeners(): void {
    try {
      if (this._isDisposed) return;
      this.socketWrapper.attachListeners();
    } catch (error: any) {
      console.error(`[Socket] Listener attach error: ${this.name} [${this.id}] - ${error.message}`);
    }
  }

  public dispose(): void {
    try {
      if (this._isDisposed) return;

      console.log(`[Socket] Disposing client: ${this.name} [${this.id}]`);

      if (this.socket) {
        this.socket.removeAllListeners();
      }

      if (this.matchmakingSocket) {
        this.matchmakingSocket.dispose();
      }

      if (this.gameSocket) {
        for (const game of this.games) {
          try {
            this.core.leaveGame(this, game);
          } catch (error: any) {
            console.error(`[Socket] Game leave error: ${this.name} [${this.id}] - Game ${game.id} - ${error.message}`);
          }
        }
      }
      if (this.coreSocket) {
        this.core.disconnect(this);
      }

      this.games = [];

      if (this.cache) {
        this.cache.gameInfoCache = {};
        this.cache.lastLogIdCache = {};
      }

      this._isDisposed = true;

      console.log(`[Socket] Client disposed: ${this.name} [${this.id}]`);
    } catch (error: any) {
      console.error(`[Socket] Disposal error: ${this.name} [${this.id}] - ${error.message}`);
      this._isDisposed = true;
    }
  }

  public get isDisposed(): boolean {
    return this._isDisposed;
  }
}