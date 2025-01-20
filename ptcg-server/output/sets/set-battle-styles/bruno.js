"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bruno = void 0;
const state_1 = require("../../game/store/state/state");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class Bruno extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Bruno';
        this.fullName = 'Bruno BST';
        this.text = 'Shuffle your hand into your deck. Then, draw 4 cards. If any of your Pokémon were Knocked Out during your opponent\'s last turn, draw 7 cards instead.';
        this.BRUNO_MARKER = 'BRUNO_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            if (effect instanceof game_effects_1.KnockOutEffect) {
                const player = effect.player;
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
                const cards = player.hand.cards.filter(c => c !== this);
                // Do not activate between turns, or when it's not opponents turn.
                if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                    return state;
                }
                // No Pokemon KO last turn
                if (!player.marker.hasMarker(this.BRUNO_MARKER)) {
                    if (cards.length > 0) {
                        player.hand.moveCardsTo(cards, player.deck);
                        state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    }
                    player.deck.moveTo(player.hand, 5);
                }
                if (cards.length > 0) {
                    player.hand.moveCardsTo(cards, player.deck);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                }
                player.deck.moveTo(player.hand, 5);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BRUNO_MARKER, this)) {
            effect.player.marker.removeMarker(this.BRUNO_MARKER);
        }
        return state;
    }
}
exports.Bruno = Bruno;
