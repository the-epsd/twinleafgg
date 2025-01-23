import { Client } from '../client/client.interface';
import { Game } from './game';
import { GameSettings } from './game-settings';
import { Messager } from './messager';
export declare class Core {
    clients: Client[];
    games: Game[];
    messager: Messager;
    constructor();
    connect(client: Client): Client;
    disconnect(client: Client): void;
    createGame(client: Client, deck: string[], gameSettings?: GameSettings, invited?: Client): Game;
    createGameWithDecks(client: Client, deck: string[], gameSettings: GameSettings | undefined, client2: Client, deck2: string[]): Game;
    joinGame(client: Client, game: Game): void;
    deleteGame(game: Game): void;
    leaveGame(client: Client, game: Game): void;
    emit(fn: (client: Client) => void): void;
    private startRankingDecrease;
}
