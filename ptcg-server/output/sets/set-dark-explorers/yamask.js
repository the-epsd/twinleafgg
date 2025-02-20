"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yamask = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useAstonish(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
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
class Yamask extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Astonish',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, choose a card at random from your opponent\'s hand. ' +
                    'Your opponent reveals that card and shuffles it into his or her deck.'
            }];
        this.set = 'DEX';
        this.name = 'Yamask';
        this.fullName = 'Yamask DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Opponent has no cards in the hand
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (!result) {
                    return state;
                }
                const generator = useAstonish(() => generator.next(), store, state, effect);
                return generator.next().value;
            });
        }
        return state;
    }
}
exports.Yamask = Yamask;
