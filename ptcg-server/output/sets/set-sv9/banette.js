"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Banette extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cursed Speech',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Your opponent shuffles 3 cards from their hand into their deck.'
            },
            {
                name: 'Spooky Shot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Banette';
        this.fullName = 'Banette SV9';
    }
    reduceEffect(store, state, effect) {
        // Cursed Speech
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            const cardsToShuffle = Math.min(3, opponent.hand.cards.length);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: cardsToShuffle, max: cardsToShuffle }), cards => {
                cards = cards || [];
                opponent.hand.moveCardsTo(cards, opponent.deck);
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Banette = Banette;
