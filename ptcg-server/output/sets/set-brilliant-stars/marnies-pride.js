"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesPride = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class MarniesPride extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.regulationMark = 'F';
        this.name = 'Marnie\'s Pride';
        this.fullName = 'Marnie\'s Pride BRS';
        this.text = 'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (!player.discard.cards.some(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.MarniesPride = MarniesPride;
