"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartlingMegaphone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StartlingMegaphone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FLF';
        this.name = 'Startling Megaphone';
        this.fullName = 'Startling Megaphone FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'Discard all Pokemon Tool cards attached to each of your ' +
            'opponent\'s Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonsWithTool = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tools.length !== 0) {
                    pokemonsWithTool.push(cardList);
                }
            });
            if (pokemonsWithTool.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            pokemonsWithTool.forEach(target => {
                for (const tool of target.tools) {
                    prefabs_1.REMOVE_TOOL(store, state, target, tool, game_1.SlotType.DISCARD);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.StartlingMegaphone = StartlingMegaphone;
