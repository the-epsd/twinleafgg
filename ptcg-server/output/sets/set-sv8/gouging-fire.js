"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GougingFireex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GougingFireex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Knock Down',
                cost: [card_types_1.CardType.FIRE],
                damage: 30,
                text: ''
            },
            {
                name: 'Blazing Assault',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent has 4 or fewer prizes left, this attack does 70 more damage.'
            }
        ];
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Gouging Fire';
        this.fullName = 'Gouging Fire SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentPrizes = opponent.prizes.length;
            if (opponentPrizes <= 4) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.GougingFireex = GougingFireex;
