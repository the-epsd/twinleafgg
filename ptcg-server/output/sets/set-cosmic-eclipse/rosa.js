"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rosa = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const energy_card_1 = require("../../game/store/card/energy-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // No Pokemon KO last turn
    if (!player.marker.hasMarker(self.ROSA_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        const isPokemon = c instanceof pokemon_card_1.PokemonCard;
        const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        const isTrainer = c instanceof trainer_card_1.TrainerCard;
        if (!isPokemon && !isBasicEnergy && !isTrainer) {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    const maxPokemons = 1;
    const maxEnergies = 1;
    const maxTrainers = 1;
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: true, blocked, maxPokemons, maxEnergies, maxTrainers }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardTo(self, player.supporter);
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Rosa extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rosa';
        this.fullName = 'Rosa CEC';
        this.setNumber = '204';
        this.text = 'You can play this card only if 1 of your Pokemon was Knocked Out ' +
            'during your opponent\'s last turn. Search your deck for a Pokemon, ' +
            'a Trainer card, and a basic Energy card, reveal them, and put them ' +
            'into your hand. Then, shuffle your deck.';
        this.ROSA_MARKER = 'ROSA_MARKER';
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
                effect.player.marker.addMarker(this.ROSA_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ROSA_MARKER, this)) {
            effect.player.marker.removeMarker(this.ROSA_MARKER);
        }
        return state;
    }
}
exports.Rosa = Rosa;
