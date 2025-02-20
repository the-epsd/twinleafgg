"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolScrapper = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ToolScrapper extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DRX';
        this.name = 'Tool Scrapper';
        this.fullName = 'Tool Scrapper DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.text = 'Choose up to 2 Pokemon Tool cards attached to Pokemon in play (yours or ' +
            'your opponent\'s) and discard them.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let allTools = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                allTools.push(cardList.tools);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                allTools.push(cardList.tools);
            });
            if (allTools.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            state = prefabs_1.DISCARD_TOOLS_FROM_ALL_POKEMON(store, state, player, 0, 2);
            player.supporter.moveCardTo(this, player.discard);
            return state;
        }
        return state;
    }
}
exports.ToolScrapper = ToolScrapper;
