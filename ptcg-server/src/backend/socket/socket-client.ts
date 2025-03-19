import { Server, Socket } from 'socket.io';
import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
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
  private socket: SocketWrapper;
  private cache: SocketCache = new SocketCache();
  private coreSocket: CoreSocket;
  private gameSocket: GameSocket;
  private messageSocket: MessageSocket;
  private matchmakingSocket: MatchmakingSocket;
  private _isDisposed: boolean = false;

  constructor(user: User, core: Core, io: Server, socket: Socket) {
    this.id = Math.floor(Math.random() * 1000000); // Generate a unique client ID
    this.user = user;
    this.name = user.name;
    this.socket = new SocketWrapper(io, socket);
    this.core = core;

    console.log(`[Socket] Creating socket client for user ${user.name} (${user.id}) with client ID ${this.id}`);

    // Initialize socket components
    this.coreSocket = new CoreSocket(this, this.socket, core, this.cache);
    this.gameSocket = new GameSocket(this, this.socket, core, this.cache);
    this.messageSocket = new MessageSocket(this, this.socket, core);
    this.matchmakingSocket = new MatchmakingSocket(this, this.socket, core);
  }

  public onConnect(client: Client): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onConnect(client);
    } catch (error: any) {
      console.error(`[Socket] Error in onConnect for client ${this.name}: ${error.message || error}`);
    }
  }

  public onDisconnect(client: Client): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onDisconnect(client);
    } catch (error: any) {
      console.error(`[Socket] Error in onDisconnect for client ${this.name}: ${error.message || error}`);
    }
  }

  public onGameAdd(game: Game): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onGameAdd(game);
    } catch (error: any) {
      console.error(`[Socket] Error in onGameAdd for client ${this.name}: ${error.message || error}`);
    }
  }

  public onGameDelete(game: Game): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onGameDelete(game);
    } catch (error: any) {
      console.error(`[Socket] Error in onGameDelete for client ${this.name}: ${error.message || error}`);
    }
  }

  public onUsersUpdate(users: User[]): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onUsersUpdate(users);
    } catch (error: any) {
      console.error(`[Socket] Error in onUsersUpdate for client ${this.name}: ${error.message || error}`);
    }
  }

  public onStateChange(game: Game, state: State): void {
    try {
      if (this._isDisposed) return;
      this.coreSocket.onStateChange(game, state);
      this.gameSocket.onStateChange(game, state);
    } catch (error: any) {
      console.error(`[Socket] Error in onStateChange for client ${this.name}: ${error.message || error}`);
    }
  }

  public onGameJoin(game: Game, client: Client): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onGameJoin(game, client);
    } catch (error: any) {
      console.error(`[Socket] Error in onGameJoin for client ${this.name}: ${error.message || error}`);
    }
  }

  public onGameLeave(game: Game, client: Client): void {
    try {
      if (this._isDisposed) return;
      this.gameSocket.onGameLeave(game, client);
    } catch (error: any) {
      console.error(`[Socket] Error in onGameLeave for client ${this.name}: ${error.message || error}`);
    }
  }

  public onJoinQueue(from: Client, message: Message): void {
    try {
      if (this._isDisposed) return;
      this.matchmakingSocket.onJoinQueue(from, message);
    } catch (error: any) {
      console.error(`[Socket] Error in onJoinQueue for client ${this.name}: ${error.message || error}`);
    }
  }

  public onLeaveQueue(): void {
    try {
      if (this._isDisposed) return;
      this.matchmakingSocket.onLeaveQueue();
    } catch (error: any) {
      console.error(`[Socket] Error in onLeaveQueue for client ${this.name}: ${error.message || error}`);
    }
  }

  public onMessage(from: Client, message: Message): void {
    try {
      if (this._isDisposed) return;
      this.messageSocket.onMessage(from, message);
    } catch (error: any) {
      console.error(`[Socket] Error in onMessage for client ${this.name}: ${error.message || error}`);
    }
  }

  public onMessageRead(user: User): void {
    try {
      if (this._isDisposed) return;
      this.messageSocket.onMessageRead(user);
    } catch (error: any) {
      console.error(`[Socket] Error in onMessageRead for client ${this.name}: ${error.message || error}`);
    }
  }

  public attachListeners(): void {
    try {
      if (this._isDisposed) return;
      this.socket.attachListeners();
    } catch (error: any) {
      console.error(`[Socket] Error attaching listeners for client ${this.name}: ${error.message || error}`);
    }
  }

  public dispose(): void {
    try {
      if (this._isDisposed) {
        console.warn(`[Socket] Client ${this.name} (${this.id}) already disposed`);
        return;
      }

      console.log(`[Socket] Disposing client ${this.name} (${this.id})`);
      this._isDisposed = true;

      // Clean up matchmaking
      if (this.matchmakingSocket) {
        this.matchmakingSocket.dispose();
      }

      // Clear games
      this.games = [];

      // Clear cache references
      if (this.cache) {
        this.cache.gameInfoCache = {};
        this.cache.lastLogIdCache = {};
      }
    } catch (error: any) {
      console.error(`[Socket] Error disposing client ${this.name}: ${error.message || error}`);
    }
  }

  public get isDisposed(): boolean {
    return this._isDisposed;
  }
}