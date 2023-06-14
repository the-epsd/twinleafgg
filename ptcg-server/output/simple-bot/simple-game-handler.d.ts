import { State } from '../game';
import { Client } from '../game/client/client.interface';
import { Game } from '../game/core/game';
import { SimpleBotOptions } from './simple-bot-options';
export declare class SimpleGameHandler {
    private client;
    private options;
    game: Game;
    private ai;
    private state;
    private changeInProgress;
    constructor(client: Client, options: SimpleBotOptions, game: Game, deckPromise: Promise<string[]>);
    onStateChange(state: State): Promise<void>;
    private waitForDeck;
    private waitAndDispatch;
}
