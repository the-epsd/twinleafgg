"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Levincia = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
class Levincia extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SV9';
        this.name = 'Levincia';
        this.fullName = 'Levincia SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.text = 'Once during each player’s turn, that player may put up to 2 Basic [L] Energy cards from their discard pile into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            let hasCardsInDiscard = false;
            player.discard.cards.forEach((c) => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.LIGHTNING)) {
                    hasCardsInDiscard = true;
                }
            });
            if (hasCardsInDiscard === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: 2 }), selected => {
                selected = selected || [];
                player.discard.moveCardsTo(selected, player.hand);
            });
        }
        return state;
    }
}
exports.Levincia = Levincia;
