"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regigigas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
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
        this.fullName = 'Regigigas SV8a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_1.CardTag.POKEMON_TERA))) {
                effect.damage += 230;
            }
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
