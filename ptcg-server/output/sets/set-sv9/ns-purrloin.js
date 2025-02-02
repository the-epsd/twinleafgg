"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsPurrloin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsPurrloin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pilfer',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Your opponent reveals their hand. Put a card you find there on the bottom of their deck.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'N\'s Purrloin';
        this.fullName = 'N\'s Purrloin SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Opponent has no cards in the hand
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.deck);
            });
        }
        return state;
    }
}
exports.NsPurrloin = NsPurrloin;
