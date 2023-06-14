"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotGamesTask = void 0;
const scheduler_1 = require("../../utils/scheduler");
const config_1 = require("../../config");
class BotGamesTask {
    constructor(bots) {
        this.bots = [];
        this.bots = bots;
    }
    startBotGames() {
        const scheduler = scheduler_1.Scheduler.getInstance();
        scheduler.run(async () => {
            const botsForGame = await this.getRandomBotsForGame();
            // Create the game if successfuly selected two bots
            if (botsForGame !== undefined) {
                const { bot1, bot2, deck } = botsForGame;
                bot1.createGame(deck, undefined, bot2);
            }
        }, config_1.config.bots.botGamesIntervalCount);
    }
    async getRandomBotsForGame() {
        const allBots = this.bots.slice();
        const bots = [];
        const decks = [];
        // Try to select two random bots for the game
        while (bots.length < 2 && allBots.length > 0) {
            const botIndex = Math.round(Math.random() * (allBots.length - 1));
            const bot = allBots[botIndex];
            allBots.splice(botIndex, 1);
            try {
                const deck = await bot.loadDeck();
                bots.push(bot);
                decks.push(deck);
            }
            catch (_a) {
                // continue regardless of error
            }
        }
        // Successfuly selected two bots
        if (bots.length === 2) {
            return { bot1: bots[0], bot2: bots[1], deck: decks[0] };
        }
    }
}
exports.BotGamesTask = BotGamesTask;
