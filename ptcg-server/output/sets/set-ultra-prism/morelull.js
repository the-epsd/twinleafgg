"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morelull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Morelull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flickering Spores',
                cost: [C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Ram',
                cost: [Y],
                damage: 10,
                text: ''
            }];
        this.set = 'UPR';
        this.name = 'Morelull';
        this.fullName = 'Morelull UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Morelull = Morelull;
