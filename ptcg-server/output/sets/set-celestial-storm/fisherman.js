"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fisherman = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    if (player.supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    let basicEnergies = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergies += 1;
        }
    });
    if (basicEnergies === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let min = 0;
    let max = 0;
    if (basicEnergies <= 4) {
        min = basicEnergies;
        max = basicEnergies;
    }
    else {
        min = 4;
        max = 4;
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let recovered = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min, max, allowCancel: false }), selected => {
        recovered = selected || [];
        next();
    });
    // Operation canceled by the user
    if (recovered.length === 0) {
        return state;
    }
    player.discard.moveCardsTo(recovered, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Fisherman extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CES';
        this.name = 'Fisherman';
        this.fullName = 'Fisherman CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.text = 'Put 4 basic Energy cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Fisherman = Fisherman;
