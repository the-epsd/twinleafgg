"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TownStore = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    else {
        // handle no open slots
        let cards = [];
        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 0, max: 1, allowCancel: true }), selectedCards => {
            cards = selectedCards || [];
            // Operation canceled by the user
            if (cards.length === 0) {
                return state;
            }
            cards.forEach((card, index) => {
                player.deck.moveCardTo(card, player.hand);
            });
            cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            if (cards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
            }
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                return state;
            });
        });
    }
}
class TownStore extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '196';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'OBF';
        this.name = 'Town Store';
        this.fullName = 'Town Store OBF';
        this.text = 'Once during each player\'s turn, that player may search their deck for a Pokémon Tool card, reveal it, and put it into their hand. Then, that player shuffles their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TownStore = TownStore;
