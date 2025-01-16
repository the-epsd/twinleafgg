"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diantha = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Diantha extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Diantha';
        this.fullName = 'Diantha FLI';
        this.text = 'You can play this card only if 1 of your [Y] Pokémon was Knocked Out during your opponent\'s last turn.' +
            'Put 2 cards from your discard pile into your hand.';
        this.DIANTHA_MARKER = 'DIANTHA_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            // No Pokemon KO last turn
            if (!player.marker.hasMarker(this.DIANTHA_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.discard.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // This will prevent unblocked supporter to appear in the discard pile
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 2, max: 2, allowCancel: false }), cards => {
                player.discard.moveCardsTo(cards, player.hand);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.FAIRY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const duringTurn = [game_1.GamePhase.PLAYER_TURN, game_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn.
            if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarker(this.DIANTHA_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DIANTHA_MARKER, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.removeMarker(this.DIANTHA_MARKER);
            }
        }
        return state;
    }
}
exports.Diantha = Diantha;
