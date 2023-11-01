"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.',
                effect: (store, state, effect) => {
                    attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
                }
            }
        ];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '1';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur MEW 001';
    }
}
exports.Bulbasaur = Bulbasaur;
