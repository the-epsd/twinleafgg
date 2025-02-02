"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cyclizar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cyclizar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Driving Buddy',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: '+',
                text: 'If you played a Supporter card from your hand during this turn, this attack does 70 more damage.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Cyclizar';
        this.fullName = 'Cyclizar PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.supporterTurn >= 1) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Cyclizar = Cyclizar;
