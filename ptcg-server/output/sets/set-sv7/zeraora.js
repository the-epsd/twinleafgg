"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zeraora = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zeraora extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Combat Thunder',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
            }
        ];
        this.set = 'SCR';
        this.name = 'Zeraora';
        this.fullName = 'Zeraora SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Get number of benched pokemon
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = opponentBenched;
            effect.damage = 20 + (totalBenched * 20);
        }
        return state;
    }
}
exports.Zeraora = Zeraora;
