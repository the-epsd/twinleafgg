"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElesasSparkle = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class ElesasSparkle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '233';
        this.name = 'Elesa\'s Sparkle';
        this.fullName = 'Elesa\'s Sparkle FST';
        this.text = '';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if player has any Fusion Strike Pokemon in play
            let hasFusionStrike = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                    hasFusionStrike = true;
                }
            });
            if (!hasFusionStrike) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { min: 1, max: 2, blocked: blocked2 }), chosen => {
                if (!chosen) {
                    return;
                }
                const allowedTargets = chosen;
                const notAllowedTargets = [];
                player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (!allowedTargets.some(pokemon => pokemon === (target.slot === play_card_action_1.SlotType.ACTIVE ? player.active : player.bench[target.index]))) {
                        notAllowedTargets.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Fusion Strike Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: notAllowedTargets, differentTargets: true }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return;
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.deck.moveCardTo(transfer.card, target);
                    }
                });
            });
        }
        return state;
    }
}
exports.ElesasSparkle = ElesasSparkle;
