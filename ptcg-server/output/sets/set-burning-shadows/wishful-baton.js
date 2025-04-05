"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBaton = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const state_utils_1 = require("../../game/store/state-utils");
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
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const target = effect.target;
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            // Get all cards from the target
            const allCards = [...target.cards];
            // Filter out basic energy cards
            const basicEnergy = allCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC);
            // If there are basic energy cards, prompt to attach them
            if (basicEnergy.length > 0) {
                const energyToAttach = new game_1.CardList();
                energyToAttach.cards = basicEnergy;
                // Remove the energy cards from the target so they don't get moved to discard/lost zone
                target.cards = target.cards.filter(c => !(c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC));
                // Remove the Wishful Baton from both the cards array and the tool property
                target.cards = target.cards.filter(c => c !== this);
                target.tool = undefined;
                // Prevent the default knockout behavior since we're handling the energy cards
                effect.preventDefault = true;
                return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, energyToAttach, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, sameTarget: true }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        // If no transfers were made, move all energy to discard
                        state = prefabs_1.MOVE_CARDS(store, state, energyToAttach, player.discard, { cards: energyToAttach.cards });
                        return state;
                    }
                    for (const transfer of transfers) {
                        const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                        energyToAttach.moveCardTo(transfer.card, target);
                    }
                    // Move any remaining energy to discard
                    if (energyToAttach.cards.length > 0) {
                        state = prefabs_1.MOVE_CARDS(store, state, energyToAttach, player.discard, { cards: energyToAttach.cards });
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.WishfulBaton = WishfulBaton;
