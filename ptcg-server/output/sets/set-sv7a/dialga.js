"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useTimeControl(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const deckTop = new game_1.CardList();
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 2, max: 2, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, deckTop);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
            if (order === null) {
                return state;
            }
            deckTop.applyOrder(order);
            deckTop.moveToTopOfDestination(player.deck);
        });
    });
}
class Dialga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Time Control',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for 2 cards. Shuffle the rest of your deck and place those two cards on top of your deck in any order.'
            },
            {
                name: 'Buster Tail',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            },
        ];
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Dialga';
        this.fullName = 'Dialga SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useTimeControl(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Dialga = Dialga;
