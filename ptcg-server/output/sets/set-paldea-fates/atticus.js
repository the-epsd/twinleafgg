"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atticus = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
class Atticus extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.set = 'PAF';
        this.name = 'Atticus';
        this.fullName = 'Atticus PAF';
        this.text = 'You can use this card only if your opponent\'s Active Pokémon is Poisoned.' +
            '' +
            'Shuffle your hand into your deck, then draw 7 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const isPoisoned = opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED);
            if (!isPoisoned) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (cards.length > 0) {
                player.hand.moveCardsTo(cards, player.deck);
                store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            player.deck.moveTo(player.hand, 7);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.Atticus = Atticus;
