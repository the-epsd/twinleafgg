"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cobalion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Energy Press',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 more damage for each Energy attached to ' +
                    'the Defending Pokemon.'
            }, {
                name: 'Iron Breaker',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'The Defending Pokemon can\'t attack during your opponent\'s ' +
                    'next turn.'
            }];
        this.set = 'LTR';
        this.name = 'Cobalion';
        this.fullName = 'Cobalion LTR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Energy Press
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 20;
        }
        // Iron Breaker
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.Cobalion = Cobalion;
