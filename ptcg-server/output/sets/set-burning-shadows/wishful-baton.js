"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBaton = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
            const cards = target.getPokemons();
            const removedCards = [];
            const pokemonIndices = effect.target.cards.map((card, index) => index);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            for (let i = pokemonIndices.length - 1; i >= 0; i--) {
                const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
                removedCards.push(removedCard);
                target.damage = 0;
            }
            const energyToAttach = new game_1.CardList();
            const toolCard = new game_1.CardList();
            toolCard.cards = removedCards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL);
            const lostZoned = new game_1.CardList();
            lostZoned.cards = cards;
            const specialEnergy = new game_1.CardList();
            specialEnergy.cards = removedCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
            const basicEnergy = new game_1.CardList();
            basicEnergy.cards = removedCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            lostZoned.moveTo(player.discard);
            toolCard.moveTo(player.discard);
            specialEnergy.moveTo(player.discard);
            basicEnergy.moveTo(energyToAttach);
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, energyToAttach, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, sameTarget: true }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    energyToAttach.moveCardTo(transfer.card, target);
                }
                energyToAttach.moveTo(player.discard);
            });
        }
        return state;
    }
}
exports.WishfulBaton = WishfulBaton;
