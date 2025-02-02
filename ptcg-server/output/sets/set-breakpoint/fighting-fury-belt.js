"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingFuryBelt = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class FightingFuryBelt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BKP';
        this.name = 'Fighting Fury Belt';
        this.fullName = 'Fighting Fury Belt BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'The Basic Pokémon this card is attached to gets +40 HP and its attacks do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.cards.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 10;
            }
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            if (card.stage === card_types_1.Stage.BASIC) {
                effect.hp += 40;
            }
        }
        return state;
    }
}
exports.FightingFuryBelt = FightingFuryBelt;
