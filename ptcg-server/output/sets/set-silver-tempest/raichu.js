"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ambushing Spark',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                damageCalculation: '+',
                text: 'If your opponent has used their VSTAR Power during this game, this attack does 100 more damage.'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Raichu';
        this.fullName = 'Raichu SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.usedVSTAR == true) {
                effect.damage += 100;
            }
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;
