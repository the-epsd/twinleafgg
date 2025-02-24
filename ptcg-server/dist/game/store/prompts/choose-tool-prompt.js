"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseToolPrompt = exports.ChooseToolPromptType = void 0;
const prompt_1 = require("./prompt");
const state_utils_1 = require("../state-utils");
const pokemon_card_list_1 = require("../state/pokemon-card-list");
exports.ChooseToolPromptType = 'Choose tool';
class ChooseToolPrompt extends prompt_1.Prompt {
    constructor(playerId, message, tools, options) {
        super(playerId);
        this.message = message;
        this.tools = tools;
        this.type = exports.ChooseToolPromptType;
        // Default options
        this.options = Object.assign({}, {
            min: 1,
            max: 1,
            allowCancel: true,
            blocked: [],
        }, options);
    }
    decode(result) {
        if (result === null) {
            return null;
        }
        const tools = this.tools;
        return result.map(index => tools[index]);
    }
    validate(result, state) {
        if (result === null || result.length === 0) {
            return this.options.allowCancel;
        }
        if (result.length > this.options.max || result.length < this.options.min || result.some(card => !(this.tools.includes(card)))) {
            return false;
        }
        for (const tool of result) {
            const cardList = state_utils_1.StateUtils.findCardList(state, tool);
            if (!(cardList instanceof pokemon_card_list_1.PokemonCardList) || (cardList.tools.includes(tool))) {
                return false;
            }
        }
        return true;
    }
}
exports.ChooseToolPrompt = ChooseToolPrompt;
