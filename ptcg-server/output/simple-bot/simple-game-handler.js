"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGameHandler = void 0;
const simple_tactics_ai_1 = require("./simple-tactics-ai");
const config_1 = require("../config");
class SimpleGameHandler {
    constructor(client, options, game, deckPromise) {
        this.client = client;
        this.options = options;
        this.game = game;
        this.changeInProgress = false;
        this.waitForDeck(deckPromise);
    }
    async onStateChange(state) {
        if (!this.ai || this.changeInProgress) {
            this.state = state;
            return;
        }
        this.state = undefined;
        this.changeInProgress = true;
        const action = this.ai.decodeNextAction(state);
        if (action) {
            await this.waitAndDispatch(action);
        }
        this.changeInProgress = false;
        // A state change was ignored, because we were processing
        if (this.state) {
            this.onStateChange(this.state);
        }
    }
    async waitForDeck(deckPromise) {
        let deck = null;
        try {
            deck = await deckPromise;
        }
        catch (error) {
            // continue regardless of error
        }
        this.ai = new simple_tactics_ai_1.SimpleTacticsAi(this.client, this.options, deck);
        // A state change was ignored, because we were loading the deck
        if (this.state) {
            this.onStateChange(this.state);
        }
    }
    waitAndDispatch(action) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this.game.dispatch(this.client, action);
                }
                catch (error) {
                    // continue regardless of error
                }
                resolve();
            }, config_1.config.bots.actionDelay);
        });
    }
}
exports.SimpleGameHandler = SimpleGameHandler;
