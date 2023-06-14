import { Client } from '../client/client.interface';
import { Game } from '../core/game';
import { User, Message } from '../../storage';
import { Core } from '../core/core';
import { State } from '../store/state/state';
import { GameSettings } from '../core/game-settings';
export declare abstract class BotClient implements Client {
    id: number;
    name: string;
    user: User;
    core: Core | undefined;
    games: Game[];
    constructor(name: string);
    abstract onConnect(client: Client): void;
    abstract onDisconnect(client: Client): void;
    abstract onUsersUpdate(users: User[]): void;
    abstract onGameAdd(game: Game): void;
    abstract onGameDelete(game: Game): void;
    abstract onGameJoin(game: Game, client: Client): void;
    abstract onGameLeave(game: Game, client: Client): void;
    abstract onStateChange(game: Game, state: State): void;
    abstract onMessage(from: Client, message: Message): void;
    abstract onMessageRead(user: User): void;
    createGame(deck: string[], gameSettings?: GameSettings, invited?: Client): Game;
    loadDeck(): Promise<string[]>;
    private validateDeck;
}
