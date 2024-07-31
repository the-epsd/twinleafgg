"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Druddigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Druddigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Revenge',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER],
                damage: 40,
                text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 120 more damage.'
            },
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Druddigon';
        this.fullName = 'Druddigon BRS';
        this.REVENGE_MARKER = 'REVENGE_MARKER';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REVENGE_MARKER)) {
                effect.damage += 120;
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
exports.Druddigon = Druddigon;
