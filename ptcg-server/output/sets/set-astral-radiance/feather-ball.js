"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatherBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class FeatherBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Feather Ball';
        this.fullName = 'Feather Ball ASR';
        this.text = 'Search your deck for 1 Pokemon with no retreat cost, ' +
            'show it to your opponent, and put it into your hand. ' +
            'Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false }), (cards) => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                const pokemon = cards[0];
                player.deck.moveCardTo(pokemon, player.hand);
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, [
                    new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, [pokemon]),
                    new shuffle_prompt_1.ShuffleDeckPrompt(player.id)
                ], (results) => {
                    player.deck.applyOrder(results[1]);
                });
            });
        }
        return state;
    }
}
exports.FeatherBall = FeatherBall;
