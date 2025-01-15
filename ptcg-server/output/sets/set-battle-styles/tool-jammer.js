"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolJammer = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ToolJammer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Tool Jammer';
        this.fullName = 'Tool Jammer BST';
        this.text = 'As long as the Pokémon this card is attached to is in the Active Spot, Pokémon Tools attached to your opponent\'s Active Pokémon have no effect, except for Tool Jammer.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const opponentActivePokemon = opponent.active;
            if (opponentActivePokemon && opponentActivePokemon.tool) {
                opponentActivePokemon.tool.reduceEffect = () => state;
            }
            return state;
        }
        return state;
    }
}
exports.ToolJammer = ToolJammer;
