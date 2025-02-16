"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Melony = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Melony extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.regulationMark = 'E';
        this.name = 'Melony';
        this.fullName = 'Melony CRE';
        this.text = 'Attach a [W] Energy card from your discard pile to 1 of your Pokémon V. If you do, draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if there's Water Energy in discard
            const hasWaterEnergyInDiscard = player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy');
            if (!hasWaterEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if player has any Pokemon V/VSTAR/VMAX in play
            let hasValidTarget = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_V)
                    || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)
                    || card.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    hasValidTarget = true;
                }
            });
            if (!hasValidTarget) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Block targets that aren't V/VSTAR/VMAX
            const blockedTargets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.POKEMON_V)
                    && !card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)
                    && !card.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    blockedTargets.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, blocked: blockedTargets }), chosen => {
                if (!chosen || chosen.length === 0) {
                    return state;
                }
                const blockedTo = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (!chosen.includes(list)) {
                        blockedTo.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 1, max: 1, blockedTo: blockedTo }), transfers => {
                    if (!transfers || transfers.length === 0) {
                        return state;
                    }
                    // Attach the energy
                    const transfer = transfers[0];
                    const targetList = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, targetList);
                    // Draw 3 cards
                    player.deck.moveTo(player.hand, 3);
                });
            });
        }
        return state;
    }
}
exports.Melony = Melony;
