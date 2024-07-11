"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mela = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const energy_card_1 = require("../../game/store/card/energy-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // No Pokemon KO last turn
    if (!player.marker.hasMarker(self.MELA_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof energy_card_1.EnergyCard && c.name === 'Fire Energy';
    });
    if (!hasEnergyInDiscard) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.FIRE);
        if (!isBasicEnergy) {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
        if (transfers && transfers.length > 0) {
            for (const transfer of transfers) {
                const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
            }
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        while (player.hand.cards.length < 6) {
            if (player.deck.cards.length === 0) {
                break;
            }
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    });
}
class Mela extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.regulationMark = 'G';
        this.name = 'Mela';
        this.fullName = 'Mela PAR';
        this.text = 'You can use this card only if any of your Pokémon were Knocked Out during your opponent\'s last turn.' +
            '' +
            'Attach a Basic R Energy card from your discard pile to 1 of your Pokémon. If you do, draw cards until you have 6 cards in your hand.';
        this.MELA_MARKER = 'MELA_MARKER';
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
                effect.player.marker.addMarker(this.MELA_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.MELA_MARKER);
        }
        return state;
    }
}
exports.Mela = Mela;
