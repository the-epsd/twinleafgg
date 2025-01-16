"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whismur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Whismur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bawl',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if you go second, and only on your first turn. Your opponent can\'t play any Trainer cards from their hand during their next turn.'
            },
            {
                name: 'Pound',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Whismur';
        this.fullName = 'Whismur CES';
        this.SUDDEN_SHRIEK_MARKER = 'SUDDEN_SHRIEK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get current turn
            const turn = state.turn;
            // Check if it is player's first turn
            if (turn !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.marker.addMarker(this.SUDDEN_SHRIEK_MARKER, this);
            }
            if (effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.PlaySupporterEffect) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (opponent.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
                effect.player.marker.removeMarker(this.SUDDEN_SHRIEK_MARKER, this);
            }
        }
        return state;
    }
}
exports.Whismur = Whismur;
