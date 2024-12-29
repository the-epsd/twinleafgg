"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorSadasVitality = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ProfessorSadasVitality extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Professor Sada\'s Vitality';
        this.fullName = 'Professor Sada\'s Vitality PAR';
        this.text = 'Choose up to 2 of your Ancient Pokémon and attach a Basic Energy card from your discard pile to each of them. If you attached any Energy in this way, draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.ancientSupporter = false;
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let ancientPokemonInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    ancientPokemonInPlay = true;
                }
            });
            if (!ancientPokemonInPlay) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    blocked2.push(target);
                }
            });
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.ATTACH_ENERGY_TO_BENCH,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.BENCH, SlotType.ACTIVE],
            //   { min: 0, max: 2, blocked: blocked2 }
            // ), chosen => {
            //   chosen.forEach(target => {
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 2, blockedTo: blocked2, differentTargets: true }), transfers => {
                transfers = transfers || [];
                player.ancientSupporter = true;
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                if (transfers.length > 0) {
                    player.deck.moveTo(player.hand, 3);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
                return state;
            });
        }
        return state;
    }
}
exports.ProfessorSadasVitality = ProfessorSadasVitality;
