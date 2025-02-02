"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raihan = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    // No Pokemon KO last turn
    if (!player.marker.hasMarker(self.RAIHAN_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
    });
    if (!hasEnergyInDiscard) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        if (!isBasicEnergy) {
            blocked.push(index);
        }
    });
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
        if (transfers && transfers.length > 0) {
            for (const transfer of transfers) {
                const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                next();
                player.hand.moveCardTo(self, player.supporter);
                player.deck.moveCardsTo(cards, player.hand);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    });
}
class Raihan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.regulationMark = 'E';
        this.name = 'Raihan';
        this.fullName = 'Raihan EVS';
        this.text = `You can play this card only if any of your Pokémon were Knocked Out during your opponent\'s last turn.

  Attach a basic Energy card from your discard pile to 1 of your Pokémon. If you do, search your deck for a card and put it into your hand. Then, shuffle your deck.`;
        this.RAIHAN_MARKER = 'RAIHAN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn.
            if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarker(this.RAIHAN_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.RAIHAN_MARKER, this)) {
            const player = effect.player;
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.removeMarker(this.RAIHAN_MARKER);
            }
        }
        return state;
    }
}
exports.Raihan = Raihan;
