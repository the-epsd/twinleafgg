"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mountain Mashing',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Machop';
        this.fullName = 'Machop MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length > 0) {
                opponent.deck.moveCardTo(opponent.deck.cards[0], opponent.discard);
            }
        }
        return state;
    }
}
exports.Machop = Machop;
