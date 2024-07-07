"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dartrix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dartrix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rowlet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'United Wings',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Pokémon in your ' +
                    'in your discard pile that have the United Wings attack.'
            },
            {
                name: 'Cutting Wind',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Dartrix';
        this.fullName = 'Dartrix SV6a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(20, c => c.attacks.some(a => a.name === 'United Wings'), effect);
        }
        return state;
    }
}
exports.Dartrix = Dartrix;
