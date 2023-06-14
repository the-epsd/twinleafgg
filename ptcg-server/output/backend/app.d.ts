import { BotManager } from '../game/bots/bot-manager';
export declare class App {
    private app;
    private ws;
    private storage;
    private core;
    constructor();
    private configureExpress;
    private configureWebSocket;
    connectToDatabase(): Promise<void>;
    configureBotManager(botManager: BotManager): void;
    start(): void;
}
