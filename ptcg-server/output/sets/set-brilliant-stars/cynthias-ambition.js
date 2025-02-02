"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasAmbition = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
class CynthiasAmbition extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Cynthia\'s Ambition';
        this.fullName = 'Cynthia\'s Ambition BRS';
        this.CYNTHIAS_AMBITION_MARKER = 'CYNTHIAS_AMBITION_MARKER';
        this.text = 'Draw cards until you have 5 cards in your hand. If any of your Pokémon were Knocked Out during your opponent\'s last turn, draw cards until you have 8 cards in your hand instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // No Pokemon KO last turn
            if (!player.marker.hasMarker(this.CYNTHIAS_AMBITION_MARKER)) {
                const cards = player.hand.cards.filter(c => c !== this);
                const cardsToDraw = Math.max(0, 5 - cards.length);
                player.deck.moveTo(player.hand, cardsToDraw);
            }
            else {
                const cards = player.hand.cards.filter(c => c !== this);
                const cardsToDraw = Math.max(0, 8 - cards.length);
                player.deck.moveTo(player.hand, cardsToDraw);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn.
            if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarker(this.CYNTHIAS_AMBITION_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CYNTHIAS_AMBITION_MARKER, this)) {
            effect.player.marker.removeMarker(this.CYNTHIAS_AMBITION_MARKER);
        }
        return state;
    }
}
exports.CynthiasAmbition = CynthiasAmbition;
