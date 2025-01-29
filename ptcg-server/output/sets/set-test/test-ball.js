"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestBall = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const charizard_ex_1 = require("../set-obsidian-flames/charizard-ex");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    // Check if bench has open slots
    if (slots.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Get Charizard ex from player's deck
    let charizard = new charizard_ex_1.Charizardex();
    if (!charizard) {
        throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_CARD);
    }
    const targetSlot = slots[0];
    // Place onto bench
    targetSlot.cards.push(charizard);
    targetSlot.pokemonPlayedTurn = state.turn;
    store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
        name: player.name,
        card: charizard.name
    });
    // Move trainer to discard
    player.hand.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class TestBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Test Ball';
        this.fullName = 'Test Ball TEST';
        this.text = 'Search your deck for a Basic Pokémon and put it onto your ' +
            'Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TestBall = TestBall;
