import { BotClient } from './bot-client';
export declare class BotGamesTask {
    private bots;
    constructor(bots: BotClient[]);
    startBotGames(): void;
    private getRandomBotsForGame;
}
