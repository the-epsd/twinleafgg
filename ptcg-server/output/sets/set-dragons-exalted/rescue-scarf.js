"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueScarf = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RescueScarf extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DRX';
        this.name = 'Rescue Scarf';
        this.fullName = 'Rescue Scarf DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.text = 'If the Pokemon this card is attached to is Knocked Out by damage from ' +
            'an attack, put that Pokemon into your hand. (Discard all cards ' +
            'attached to that Pokemon.)';
        this.RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.tool === this) {
            this.damageDealt = false;
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tool === this) {
            const player = game_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.tool === this) {
                this.damageDealt = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === game_1.StateUtils.getOpponent(state, effect.player)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === effect.player) {
                this.damageDealt = false;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && this.damageDealt) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                player.marker.addMarker(this.RESCUE_SCARF_MAREKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.RESCUE_SCARF_MAREKER)
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .map(m => m.source)
                    .filter((card) => card !== undefined);
                player.discard.moveCardsTo(rescued, player.hand);
                player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);
            });
        }
        return state;
    }
}
exports.RescueScarf = RescueScarf;
