"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Slugma extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.hp = 80;
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hot Magma',
                cost: [R, C],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Slugma';
        this.fullName = 'Slugma TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Slugma = Slugma;
