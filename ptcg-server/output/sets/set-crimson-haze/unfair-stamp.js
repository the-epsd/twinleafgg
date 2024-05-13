"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfairStamp = void 0;
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
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // No Pokemon KO last turn
    if (!player.marker.hasMarker(self.UNFAIR_STAMP_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const cards = player.hand.cards.filter(c => c !== self);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardsTo(cards, player.deck);
    opponent.hand.moveTo(opponent.deck);
    yield store.prompt(state, [
        new shuffle_prompt_1.ShuffleDeckPrompt(player.id),
        new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id)
    ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);
        player.deck.moveTo(player.hand, 5);
        opponent.deck.moveTo(opponent.hand, 2);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class UnfairStamp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.regulationMark = 'H';
        this.name = 'Unfair Stamp';
        this.fullName = 'Unfair Stamp SV5a';
        this.text = 'You can play this card only if one of your Pokémon was Knocked Out during your opponent\'s last turn.' +
            '' +
            'Each player shuffles their hand into their deck. Then, you draw 5 cards, and your opponent draws 2 cards.';
        this.UNFAIR_STAMP_MARKER = 'UNFAIR_STAMP_MARKER';
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
                effect.player.marker.addMarker(this.UNFAIR_STAMP_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.UNFAIR_STAMP_MARKER);
        }
        return state;
    }
}
exports.UnfairStamp = UnfairStamp;
