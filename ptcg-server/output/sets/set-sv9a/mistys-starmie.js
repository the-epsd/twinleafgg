"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysStarmie = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysStarmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.MISTYS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Misty\'s Staryu';
        this.regulationMark = 'I';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sudden Flash',
                cost: [W],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon evolved from Misty\'s Staryu during this turn, this attack does 80 more damage.'
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Misty\'s Starmie';
        this.fullName = 'Misty\'s Starmie SV9a';
    }
    reduceEffect(store, state, effect) {
        // Sudden Flash
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.active.pokemonPlayedTurn === state.turn) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.MistysStarmie = MistysStarmie;
