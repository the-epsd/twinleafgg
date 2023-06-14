"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotManager = void 0;
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const storage_1 = require("../../storage");
const config_1 = require("../../config");
const md5_1 = require("../../utils/md5");
const bot_games_task_1 = require("./bot-games-task");
class BotManager {
    constructor() {
        this.bots = [];
        this.botGameArranger = new bot_games_task_1.BotGamesTask(this.bots);
    }
    static getInstance() {
        if (!BotManager.instance) {
            BotManager.instance = new BotManager();
        }
        return BotManager.instance;
    }
    registerBot(bot) {
        this.bots.push(bot);
    }
    async initBots(core) {
        const registered = Date.now();
        for (let i = 0; i < this.bots.length; i++) {
            const bot = this.bots[i];
            const user = await this.findOrCreateUser(bot.name, registered);
            bot.user = user;
            core.connect(bot);
        }
        this.botGameArranger.startBotGames();
    }
    getBot(botName) {
        const bot = this.bots.find(bot => bot.user.name === botName);
        if (bot === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_BOT_NOT_FOUND);
        }
        return bot;
    }
    async findOrCreateUser(name, registered) {
        let user = await storage_1.User.findOne({ name });
        if (user === undefined) {
            user = new storage_1.User();
            user.name = name;
            user.registered = registered;
            if (config_1.config.bots.defaultPassword) {
                user.password = md5_1.Md5.init(config_1.config.bots.defaultPassword);
            }
            await storage_1.User.insert(user);
        }
        return user;
    }
}
exports.BotManager = BotManager;
