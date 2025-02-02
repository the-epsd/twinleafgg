"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuraludonV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class DuraludonV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 220;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Metal Claw',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 70,
                text: ''
            },
            {
                name: 'Breaking Swipe',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 140,
                text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 30 less damage (before applying Weakness and Resistance).'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Duraludon V';
        this.fullName = 'Duraludon V EVS';
        this.BREAKING_SWIPE_MARKER = 'BREAKING_SWIPE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.BREAKING_SWIPE_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.BREAKING_SWIPE_MARKER, this)) {
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 30;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.BREAKING_SWIPE_MARKER, this);
        }
        return state;
    }
}
exports.DuraludonV = DuraludonV;
