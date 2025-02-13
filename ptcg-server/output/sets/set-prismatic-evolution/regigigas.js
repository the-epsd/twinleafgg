"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regigigas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regigigas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Jewel Breaker',
                cost: [C, C, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Tera Pokémon, this attack does 230 more damage.',
            }
        ];
        this.set = 'PRE';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas PRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 230, card_types_1.CardTag.POKEMON_TERA);
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
