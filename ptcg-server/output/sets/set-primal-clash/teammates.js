"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teammates = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
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
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // No Pokemon KO last turn
    if (!player.marker.hasMarker(self.TEAMMATES_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(self, player.supporter);
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: Math.min(2, player.deck.cards.length), allowCancel: false }), selected => {
        cards = selected || [];
        next();
        player.deck.moveCardsTo(cards, player.hand);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
        });
    });
}
class Teammates extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Teammates';
        this.fullName = 'Teammates PRC';
        this.text = 'You can play this card only if 1 of your Pokémon was Knocked Out during your opponent\'s last turn.' +
            '' +
            'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.';
        this.TEAMMATES_MARKER = 'TEAMMATES_MARKER';
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
                effect.player.marker.addMarker(this.TEAMMATES_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.TEAMMATES_MARKER);
        }
        return state;
    }
}
exports.Teammates = Teammates;
