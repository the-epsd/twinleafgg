"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RebootPod = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class RebootPod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.name = 'Reboot Pod';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.fullName = 'Reboot Pod TEF';
        this.text = 'Attach a Basic Energy card from your discard pile to each of your Future Pokémon in play.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let hasEnergyInDiscard = 0;
            player.discard.cards.forEach((c, index) => {
                const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                if (isBasicEnergy) {
                    hasEnergyInDiscard += 1;
                }
            });
            // Player does not have correct cards in discard
            if (hasEnergyInDiscard === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.FUTURE)) {
                    blocked2.push(target);
                }
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: hasEnergyInDiscard, blockedTo: blocked2, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    player.supporter.moveCardTo(this, player.discard);
                    return;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                    player.supporter.moveCardTo(this, player.discard);
                }
            });
        }
        return state;
    }
}
exports.RebootPod = RebootPod;
