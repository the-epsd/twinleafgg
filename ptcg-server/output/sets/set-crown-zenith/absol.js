"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class Absol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slash',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                text: ''
            },
            {
                name: 'Lost Claw',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'Put a random card from your opponent\'s hand in the Lost Zone.'
            }
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Absol';
        this.fullName = 'Absol CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length == 0) {
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(opponent.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.lostzone);
            });
        }
        return state;
    }
}
exports.Absol = Absol;
