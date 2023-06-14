import { BotClient } from '../game/bots/bot-client';
import { Client } from '../game/client/client.interface';
import { Game } from '../game/core/game';
import { SimpleGameHandler } from './simple-game-handler';
import { State } from '../game/store/state/state';
import { User, Message } from '../storage';
import { SimpleBotOptions } from './simple-bot-options';
export declare class SimpleBot extends BotClient {
    protected gameHandlers: SimpleGameHandler[];
    private options;
    constructor(name: string, options?: Partial<SimpleBotOptions>);
    onConnect(client: Client): void;
    onDisconnect(client: Client): void;
    onUsersUpdate(users: User[]): void;
    onMessage(from: Client, message: Message): void;
    onMessageRead(user: User): void;
    onGameJoin(game: Game, client: Client): void;
    onGameLeave(game: Game, client: Client): void;
    onGameAdd(game: Game): void;
    onGameDelete(game: Game): void;
    onStateChange(game: Game, state: State): void;
    protected addGameHandler(game: Game): SimpleGameHandler;
    protected deleteGameHandler(gameHandler: SimpleGameHandler): void;
}
