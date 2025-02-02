import { BotClient } from './bot-client';
import { Core } from '../core/core';
export declare class BotManager {
    private static instance;
    private bots;
    private botGameArranger;
    static getInstance(): BotManager;
    registerBot(bot: BotClient): void;
    initBots(core: Core): Promise<void>;
    getBot(botName: string): BotClient;
    private findOrCreateUser;
}
