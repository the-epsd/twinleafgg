"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigAirBalloon = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class BigAirBalloon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'MEW';
        this.name = 'Big Air Balloon';
        this.fullName = 'Big Air Balloon MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.regulationMark = 'G';
        this.text = 'The Stage 2 Pokémon this card is attached to has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            const card = effect.player.active.getPokemonCard();
            if (card instanceof game_1.PokemonCard && card.stage === card_types_1.Stage.STAGE_2)
                effect.cost = [];
        }
        return state;
    }
}
exports.BigAirBalloon = BigAirBalloon;
