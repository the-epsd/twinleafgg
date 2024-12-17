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
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Briar';
        this.fullName = 'Briar SV7';
        this.extraPrizes = false;
        this.text = 'You can use this card only if your opponent has exactly 2 Prize cards remaining.' +
            '' +
            'During this turn, if your opponent\'s Active Pokémon is Knocked Out by damage from an attack used by your Tera Pokémon, take 1 more Prize card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (opponent.getPrizeLeft() !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            this.extraPrizes = true;
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Check if the knocked out Pokémon belongs to the opponent and if extra prize should be taken
            if (effect.target === player.active) {
                const attackingPokemon = opponent.active;
                if (attackingPokemon.isTera() && this.extraPrizes) {
                    if (effect.prizeCount > 0) {
                        effect.prizeCount += 1;
                    }
                }
                this.extraPrizes = false;
            }
            player.supporter.moveCardTo(this, player.discard);
            return state;
        }
        return state;
    }
}
exports.Briar = Briar;
