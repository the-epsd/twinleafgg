"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regigigas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Regigigas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Daunt',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'During your opponent\'s next turn, any damage done by attacks ' +
                    'from the Defending Pokemon is reduced by 40 (before applying ' +
                    'Weakness and Resistance).'
            }, {
                name: 'Heavy Impact',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.set = 'PHF';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.DAUNT_MARKER = 'DAUNT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.DAUNT_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        // Reduce damage by 40
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.DAUNT_MARKER, this)) {
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 40;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DAUNT_MARKER, this);
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
