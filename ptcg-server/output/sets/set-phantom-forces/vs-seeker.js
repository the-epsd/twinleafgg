"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VsSeeker = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const hasSupporter = player.discard.cards.some(c => {
        return c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
    });
    if (!hasSupporter) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        player.hand.moveCardTo(self, player.discard);
        player.discard.moveCardsTo(cards, player.hand);
    }
    player.supporter.moveCardTo(self, player.discard);
    return state;
}
class VsSeeker extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PHF';
        this.name = 'VS Seeker';
        this.fullName = 'VS Seeker PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.text = 'Put a Supporter card from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.VsSeeker = VsSeeker;
