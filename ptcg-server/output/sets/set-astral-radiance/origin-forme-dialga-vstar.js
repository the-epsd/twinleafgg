"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginFormeDialgaVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class OriginFormeDialgaVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        //public evolvesFrom = 'Palkia V';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Star Chronos',
                cost: [],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '114';
        this.name = 'Origin Forme Dialga VSTAR';
        this.fullName = 'Origin Forme Dialga VSTAR ASR';
        this.CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (state.phase === game_1.GamePhase.ATTACK) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.marker.addMarker(this.CLEAR_WITHDRAW_MARKER, this);
                if (opponent.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {
                    if (game_1.GamePhase.BETWEEN_TURNS) {
                        player.deck.moveTo(player.hand, 0);
                        state.turn--;
                        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(opponent);
                        store.reduceEffect(state, endTurnEffect);
                        return state;
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.OriginFormeDialgaVSTAR = OriginFormeDialgaVSTAR;
