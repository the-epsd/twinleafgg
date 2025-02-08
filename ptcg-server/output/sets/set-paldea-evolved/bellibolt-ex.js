"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Belliboltex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Belliboltex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tadbulb';
        this.cardType = L;
        this.hp = 280;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Jumping Press',
                cost: [C, C],
                damage: 0,
                text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Paralyzing Bolt',
                cost: [L, L, C],
                damage: 160,
                text: 'You may discard 2 [L] Energy from this Pokémon to make your opponent\'s Active Pokémon Paralyzed.'
            }
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Bellibolt ex';
        this.fullName = 'Bellibolt ex PAL';
    }
    reduceEffect(store, state, effect) {
        // Jumping Press
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state);
        }
        // Paralyzing Bolt
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, L);
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Belliboltex = Belliboltex;
