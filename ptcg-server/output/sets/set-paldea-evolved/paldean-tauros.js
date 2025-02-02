"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaldeanTauros = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PaldeanTauros extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Raging Horns',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Blaze Dash',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.name = 'Paldean Tauros';
        this.fullName = 'Paldean Tauros PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += effect.player.active.damage;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
        }
        return state;
    }
}
exports.PaldeanTauros = PaldeanTauros;
