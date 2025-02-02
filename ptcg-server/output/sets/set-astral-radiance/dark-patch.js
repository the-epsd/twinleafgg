"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkPatch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class DarkPatch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Dark Patch';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.fullName = 'Dark Patch ASR';
        this.text = 'Attach a basic [D] Energy card from your discard pile to 1 of your ' +
            'Benched [D] Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.DARK);
            });
            if (!hasEnergyInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let hasDarkPokemonOnBench = false;
            const blockedTo = [];
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(bench);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.DARK)) {
                    hasDarkPokemonOnBench = true;
                }
                else {
                    const target = {
                        player: play_card_action_1.PlayerType.BOTTOM_PLAYER,
                        slot: play_card_action_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!hasDarkPokemonOnBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' }, { allowCancel: false, min: 1, max: 1, blockedTo }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.DarkPatch = DarkPatch;
