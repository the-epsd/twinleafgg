"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Briar = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Briar extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.set = 'SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Briar';
        this.fullName = 'Briar SV7';
        this.text = 'Search your deck for a Stadium card and an Energy card, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.prizes.length !== 6) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Articuno wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== player.active.getPokemonCard()) {
                return state;
            }
            const playerActive = player.active.getPokemonCard();
            if (playerActive && playerActive.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                effect.prizeCount += 1;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Briar = Briar;
