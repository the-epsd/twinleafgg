"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingambit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kingambit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bisharp';
        this.cardType = M;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Strike Down',
                cost: [M],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has 4 or more damage counters on it, that Pokémon is Knocked Out.'
            },
            {
                name: 'Massive Rend',
                cost: [M, C, C],
                damage: 140,
                text: ''
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.name = 'Kingambit';
        this.fullName = 'Kingambit OBF';
    }
    reduceEffect(store, state, effect) {
        // Strike Down
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            if (opponent.active.damage === 40) {
                const knockout = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                knockout.target = opponent.active;
                store.reduceEffect(state, knockout);
            }
        }
        return state;
    }
}
exports.Kingambit = Kingambit;
