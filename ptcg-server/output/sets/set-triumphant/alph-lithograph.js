"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlphLithograph = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const prizes = player.prizes.filter(p => p.isSecret);
    const cards = [];
    prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
    // All prizes are face-up
    if (cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Make prizes no more secret, before displaying prompt
    prizes.forEach(p => { p.isSecret = false; });
    yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_EFFECT, cards), () => { next(); });
    // Prizes are secret once again.
    prizes.forEach(p => { p.isSecret = true; });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class AlphLithograph extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TM';
        this.name = 'Alph Lithograph';
        this.fullName = 'Alph Lithograph TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'FOUR';
        this.text = 'Look at all of your face down prize cards!';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.AlphLithograph = AlphLithograph;
