"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oddish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
function* useFindAFriend(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Oddish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }, {
                name: 'Find a Friend',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a G Pokemon, ' +
                    'show it to your opponent, and put it into your hand. ' +
                    'Shuffle your deck afterward.'
            }];
        this.set = 'UD';
        this.name = 'Oddish';
        this.fullName = 'Oddish UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useFindAFriend(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Oddish = Oddish;
