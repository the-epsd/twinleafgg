"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanMeowth = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanMeowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spoil the Fun',
                cost: [],
                damage: 10,
                damageCalculation: '+',
                text: 'If you go second, this attack does 60 more damage during your first turn.'
            }
        ];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Alolan Meowth';
        this.fullName = 'Alolan Meowth LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (state.turn === 2) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.AlolanMeowth = AlolanMeowth;
