"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireCrystal = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Player has no Fire Energy in the discard pile
    let energyInDiscard = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof energy_card_1.EnergyCard
            && c.energyType === card_types_1.EnergyType.BASIC
            && c.provides.includes(card_types_1.CardType.FIRE)) {
            energyInDiscard += 1;
        }
    });
    if (energyInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const max = Math.min(3, energyInDiscard);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: max, max, allowCancel: true }), selected => {
        if (selected && selected.length > 0) {
            // Discard trainer only when user selected some cards
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            // Recover discarded energies
            player.discard.moveCardsTo(selected, player.hand);
        }
    });
}
class FireCrystal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SSH';
        this.name = 'Fire Crystal';
        this.fullName = 'Fire Crystal UNB';
        this.text = 'Put 3 R Energy cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FireCrystal = FireCrystal;
