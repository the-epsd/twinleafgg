"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsArcher = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TeamRocketsArcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Team Rocket\'s Archer';
        this.fullName = 'Team Rocket\'s Archer SV10';
        this.text = `You can use this card only if any of your Team Rocket's Pokemon were Knocked Out during your opponent's last turn.

Each player shuffles their hand into their deck. Then, you draw 5 cards, and your opponent draws 3 cards.`;
        this.ARCHER_MARKER = 'ARCHER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Handle playing the card
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Verify a Team Rocket's Pokemon was knocked out during opponent's last turn
            if (!player.marker.hasMarker(this.ARCHER_MARKER)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const cards = player.hand.cards.filter(c => c !== this);
            // Shuffle hands into decks
            player.hand.moveCardsTo(cards, player.deck);
            opponent.hand.moveTo(opponent.deck);
            return store.prompt(state, [
                new shuffle_prompt_1.ShuffleDeckPrompt(player.id),
                new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id)
            ], deckOrder => {
                player.deck.applyOrder(deckOrder[0]);
                opponent.deck.applyOrder(deckOrder[1]);
                // Draw new hands
                player.deck.moveTo(player.hand, 5);
                opponent.deck.moveTo(opponent.hand, 3);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        // Track when a Team Rocket's Pokemon is knocked out
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn
            if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Check if knocked out Pokemon was a Team Rocket's Pokemon
            const knockedOutPokemon = effect.target.getPokemonCard();
            if (knockedOutPokemon &&
                knockedOutPokemon.tags &&
                knockedOutPokemon.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                effect.player.marker.addMarker(this.ARCHER_MARKER, this);
            }
            return state;
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ARCHER_MARKER, this)) {
            effect.player.marker.removeMarker(this.ARCHER_MARKER, this);
        }
        return state;
    }
}
exports.TeamRocketsArcher = TeamRocketsArcher;
