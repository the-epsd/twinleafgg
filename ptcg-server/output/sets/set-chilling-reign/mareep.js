"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mareep = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Mareep extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Growl',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 20 less damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Static Shock',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Mareep';
        this.fullName = 'Mareep CRE 47';
        this.GROWL_MARKER = 'GROWL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.GROWL_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.GROWL_MARKER, this)) {
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 20;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.GROWL_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.GROWL_MARKER, this);
        }
        return state;
    }
}
exports.Mareep = Mareep;
