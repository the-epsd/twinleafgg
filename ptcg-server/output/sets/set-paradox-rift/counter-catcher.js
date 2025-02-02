"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterCatcher = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (!hasBench) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class CounterCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.regulationMark = 'G';
        this.name = 'Counter Catcher';
        this.fullName = 'Counter Catcher PAR';
        this.text = 'You can play this card only if you have more Prize cards remaining than your opponent.' +
            '' +
            'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.';
        this.COUNTER_CATCHER_MARKER = 'COUNTER_CATCHER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CounterCatcher = CounterCatcher;
