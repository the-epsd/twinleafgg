"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusclops = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
function* useAstonish(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // Opponent has no cards in the hand
    if (opponent.hand.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    opponent.hand.moveCardsTo(cards, opponent.deck);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
    });
}
class Dusclops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duskull';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Astonish',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Choose a random card from your opponent\'s hand. Your opponent ' +
                    'reveals that card and shuffles it into his or her deck.'
            }, {
                name: 'Psyshot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }];
        this.set = 'BCR';
        this.name = 'Dusclops';
        this.fullName = 'Dusclops BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAstonish(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Dusclops = Dusclops;
