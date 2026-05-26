import { AbstractAttackEffect } from './attack-effects';
import { MarkerConstants } from '../markers/marker-constants';
/**
 * Base class for effects that are caused by attacks
 * These can be prevented by abilities like Skeledirge's "Unaware"
 */
export class EffectOfAttackEffect extends AbstractAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'EFFECT_OF_ATTACK_EFFECT';
        this.preventDefault = false;
    }
}
/**
 * Effect that adds a retreat prevention marker
 */
export class PreventRetreatEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_RETREAT_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this.markerSource, 'attack', 'pokemon');
    }
}
/**
 * Effect that adds a damage prevention marker
 */
export class PreventDamageEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_DAMAGE_EFFECT';
    }
    applyEffect() {
        this.player.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource, 'attack', 'pokemon');
        // CLEAR marker goes on player.marker — it's a turn-cycle bookkeeping signal, not tied to a specific Pokemon
        this.opponent.marker.addMarker(MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource, 'attack', 'player');
    }
}
/**
 * Effect that adds an attack prevention marker
 */
export class PreventAttackEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'PREVENT_ATTACK_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this.markerSource, 'attack', 'pokemon');
    }
}
/**
 * Effect that adds a damage reduction marker
 */
export class ReduceDamageEffect extends EffectOfAttackEffect {
    constructor(base) {
        super(base);
        this.type = 'REDUCE_DAMAGE_EFFECT';
    }
    applyEffect() {
        this.opponent.active.marker.addMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this.markerSource, 'attack', 'pokemon');
    }
}
/**
 * Helper functions for creating common effect-of-attack effects
 */
export function preventRetreatEffect(attackEffect, source) {
    const effect = new PreventRetreatEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
export function preventDamageEffect(attackEffect, source) {
    const effect = new PreventDamageEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
export function preventAttackEffect(attackEffect, source) {
    const effect = new PreventAttackEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
export function reduceDamageEffect(attackEffect, source) {
    const effect = new ReduceDamageEffect(attackEffect);
    effect.markerSource = source;
    return effect;
}
