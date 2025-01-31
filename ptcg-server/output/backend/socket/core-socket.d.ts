import { Client } from '../../game/client/client.interface';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { User } from '../../storage';
import { Core } from '../../game/core/core';
import { GameState, UserInfo } from '../interfaces/core.interface';
import { SocketCache } from './socket-cache';
import { SocketWrapper } from './socket-wrapper';
export declare class CoreSocket {
    private client;
    private socket;
    private core;
    private cache;
    constructor(client: Client, socket: SocketWrapper, core: Core, cache: SocketCache);
    onConnect(client: Client): void;
    onDisconnect(client: Client): void;
    onGameAdd(game: Game): void;
    onGameDelete(game: Game): void;
    onStateChange(game: Game, state: State): void;
    onUsersUpdate(users: User[]): void;
    private buildCoreInfo;
    private getCoreInfo;
    private createGame;
    static buildUserInfo(user: User, connected?: boolean): UserInfo;
    private static buildGameInfo;
    static buildGameState(game: Game): GameState;
}
