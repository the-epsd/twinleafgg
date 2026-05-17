import { Server, Socket } from 'socket.io';
import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { CoreSocket } from './core-socket';
import { GameSocket } from './game-socket';
import { SocketCache } from './socket-cache';
import { SocketWrapper } from './socket-wrapper';

export class SocketClient implements Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public games: Game[] = [];
  public core: Core;
  public socket: SocketWrapper;
  private cache: SocketCache = new SocketCache();
  private coreSocket: CoreSocket;
  private gameSocket: GameSocket;

  constructor(user: User, core: Core, io: Server, socket: Socket) {
    this.user = user;
    this.name = user.name;
    this.socket = new SocketWrapper(io, socket);
    this.core = core;
    this.coreSocket = new CoreSocket(this, this.socket, core, this.cache);
    this.gameSocket = new GameSocket(this, this.socket, core, this.cache);
  }

  public onConnect(client: Client): void {
    this.coreSocket.onConnect(client);
  }

  public onDisconnect(client: Client): void {
    this.coreSocket.onDisconnect(client);
  }

  public onGameAdd(game: Game): void {
    this.coreSocket.onGameAdd(game);
  }

  public onGameDelete(game: Game): void {
    this.coreSocket.onGameDelete(game);
  }

  public onUsersUpdate(users: User[]): void {
    this.coreSocket.onUsersUpdate(users);
  }

  public onStateChange(game: Game, state: State): void {
    this.coreSocket.onStateChange(game, state);
    this.gameSocket.onStateChange(game, state);
  }

  public onGameJoin(game: Game, client: Client): void {
    this.gameSocket.onGameJoin(game, client);
  }

  public onGameLeave(game: Game, client: Client): void {
    this.gameSocket.onGameLeave(game, client);
  }

  public onTimerUpdate(game: Game, playerStats: any[]): void {
    this.gameSocket.onTimerUpdate(game, playerStats);
  }

  public attachListeners(): void {
    this.socket.attachListeners();
  }

  public dispose(): void {
    this.coreSocket.dispose();
    this.gameSocket.dispose();
  }
}
