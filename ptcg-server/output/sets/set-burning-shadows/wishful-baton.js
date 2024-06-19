"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBaton = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const state_1 = require("../../game/store/state/state");
class WishfulBaton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BUS';
        this.name = 'Wishful Baton';
        this.fullName = 'Wishful Baton BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.text = 'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.';
        this.EXP_SHARE_MARKER = 'EXP_SHARE_MARKER';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && state_utils_1.StateUtils.getOpponent(state, effect.player).active.tool === this &&
            (effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)) {
            this.damageDealt = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.damageDealt = false;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active && effect.target.tool === this && this.damageDealt) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            // Make copy of the active pokemon cards,
            // because they will be transfered to discard shortly
            const activeCopy = new pokemon_card_list_1.PokemonCardList();
            activeCopy.cards = player.active.cards.slice();
            const energyCards = activeCopy.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            const max = Math.min(energyCards.length, 3);
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, activeCopy, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.WishfulBaton = WishfulBaton;
