"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Tropius extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rally Back',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
            },
            {
                name: 'Solar Beam',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Tropius';
        this.fullName = 'Tropius EVS';
        this.REVENGE_MARKER = 'REVENGE_MARKER';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REVENGE_MARKER)) {
                effect.damage += 90;
            }
            return state;
        }
        // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
        //   effect.target.tool === this) {
        //   const player = StateUtils.getOpponent(state, effect.player);
        //   if (player.active.tool === this) {
        //     this.damageDealt = true;
        //   }
        // }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarkerToState(this.REVENGE_MARKER);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            // const cardList = StateUtils.findCardList(state, this);
            // const owner = StateUtils.findOwner(state, cardList);
            // if (owner === effect.player) {
            //   this.damageDealt = false;
            // }
            effect.player.marker.removeMarker(this.REVENGE_MARKER);
        }
        return state;
    }
}
exports.Tropius = Tropius;
