import { Effect } from './effect';
import { AbstractAttackEffect } from './attack-effects';
import { AttackEffect } from './game-effects';
import { Card } from '../card/card';
/**
 * Base class for effects that are caused by attacks
 * These can be prevented by abilities like Skeledirge's "Unaware"
 */
export declare abstract class EffectOfAttackEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    markerSource: Card;
    constructor(base: AttackEffect);
    /**
     * Apply the effect to the target
     * Override this in subclasses
     */
    abstract applyEffect(): void;
}
/**
 * Effect that adds a retreat prevention marker
 */
export declare class PreventRetreatEffect extends EffectOfAttackEffect {
    readonly type: string;
    constructor(base: AttackEffect);
    applyEffect(): void;
}
/**
 * Effect that adds a damage prevention marker
 */
export declare class PreventDamageEffect extends EffectOfAttackEffect {
    readonly type: string;
    constructor(base: AttackEffect);
    applyEffect(): void;
}
/**
 * Effect that adds an attack prevention marker
 */
export declare class PreventAttackEffect extends EffectOfAttackEffect {
    readonly type: string;
    constructor(base: AttackEffect);
    applyEffect(): void;
}
/**
 * Effect that adds a damage reduction marker
 */
export declare class ReduceDamageEffect extends EffectOfAttackEffect {
    readonly type: string;
    constructor(base: AttackEffect);
    applyEffect(): void;
}
/**
 * Helper functions for creating common effect-of-attack effects
 */
export declare function preventRetreatEffect(attackEffect: AttackEffect, source: Card): PreventRetreatEffect;
export declare function preventDamageEffect(attackEffect: AttackEffect, source: Card): PreventDamageEffect;
export declare function preventAttackEffect(attackEffect: AttackEffect, source: Card): PreventAttackEffect;
export declare function reduceDamageEffect(attackEffect: AttackEffect, source: Card): ReduceDamageEffect;
