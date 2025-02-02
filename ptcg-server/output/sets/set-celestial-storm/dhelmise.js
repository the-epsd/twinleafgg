"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dhelmise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// CES Dhelmise 22 (https://limitlesstcg.com/cards/CES/22)
class Dhelmise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Giga Drain', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 30, text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.' },
            { name: 'Powerful Spin', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 130, text: 'This Pokémon can\'t attack during your next turn.' }
        ];
        this.set = 'CES';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dhelmise';
        this.fullName = 'Dhelmise CES';
        // for preventing the pokemon from attacking on the next turn
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Giga Drain
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        // Powerful Spin
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        // removing the markers for preventing the pokemon from attacking
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        return state;
    }
}
exports.Dhelmise = Dhelmise;
