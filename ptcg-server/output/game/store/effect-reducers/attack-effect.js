"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attackReducer = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const attack_effects_1 = require("../effects/attack-effects");
const game_effects_1 = require("../effects/game-effects");
const state_utils_1 = require("../state-utils");
function attackReducer(store, state, effect) {
    if (effect instanceof attack_effects_1.PutDamageEffect) {
        const target = effect.target;
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
        if (effect.attackEffect && target === opponent.active && !effect.weaknessApplied) {
            // Apply weakness
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect.attackEffect, effect.damage);
            applyWeakness.target = effect.target;
            applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
            applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
            state = store.reduceEffect(state, applyWeakness);
            effect.damage = applyWeakness.damage;
        }
        const damage = Math.max(0, effect.damage);
        target.damage += damage;
        const targetOwner = state_utils_1.StateUtils.findOwner(state, target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
        if (damage > 0) {
            const afterDamageEffect = new attack_effects_1.AfterDamageEffect(effect.attackEffect, damage);
            afterDamageEffect.target = effect.target;
            store.reduceEffect(state, afterDamageEffect);
        }
    }
    if (effect instanceof attack_effects_1.DealDamageEffect) {
        const base = effect.attackEffect;
        const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(base, effect.damage);
        applyWeakness.target = effect.target;
        applyWeakness.ignoreWeakness = base.ignoreWeakness;
        applyWeakness.ignoreResistance = base.ignoreResistance;
        state = store.reduceEffect(state, applyWeakness);
        const dealDamage = new attack_effects_1.PutDamageEffect(base, applyWeakness.damage);
        dealDamage.target = effect.target;
        dealDamage.weaknessApplied = true;
        state = store.reduceEffect(state, dealDamage);
        return state;
    }
    if (effect instanceof attack_effects_1.KOEffect) {
        const target = effect.target;
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        // Check if the effect is part of an attack and the target is the opponent's active Pokemon
        const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
        if (effect.attackEffect && target === opponent.active) {
            // Apply weakness
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect.attackEffect, effect.damage);
            applyWeakness.target = effect.target;
            applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
            applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
            state = store.reduceEffect(state, applyWeakness);
            effect.damage = applyWeakness.damage;
        }
        const damage = Math.max(0, effect.damage);
        target.damage += damage;
        const targetOwner = state_utils_1.StateUtils.findOwner(state, target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
        if (damage > 0) {
            const afterDamageEffect = new attack_effects_1.AfterDamageEffect(effect.attackEffect, damage);
            afterDamageEffect.target = effect.target;
            store.reduceEffect(state, afterDamageEffect);
        }
    }
    if (effect instanceof attack_effects_1.KnockOutOpponentEffect) {
        const target = effect.target;
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const damage = Math.max(0, effect.damage);
        target.damage += damage;
    }
    if (effect instanceof attack_effects_1.PutCountersEffect) {
        const target = effect.target;
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const damage = Math.max(0, effect.damage);
        target.damage += damage;
    }
    if (effect instanceof attack_effects_1.AfterDamageEffect) {
        const targetOwner = state_utils_1.StateUtils.findOwner(state, effect.target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
    }
    if (effect instanceof attack_effects_1.DiscardCardsEffect) {
        const target = effect.target;
        const cards = effect.cards;
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.discard);
        return state;
    }
    if (effect instanceof attack_effects_1.LostZoneCardsEffect) {
        const target = effect.target;
        const cards = effect.cards;
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.lostzone);
        return state;
    }
    if (effect instanceof attack_effects_1.CardsToHandEffect) {
        const target = effect.target;
        const cards = effect.cards;
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.hand);
        return state;
    }
    if (effect instanceof attack_effects_1.AddMarkerEffect) {
        const target = effect.target;
        target.marker.addMarker(effect.markerName, effect.markerSource);
        return state;
    }
    if (effect instanceof attack_effects_1.HealTargetEffect) {
        const target = effect.target;
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        const healEffect = new game_effects_1.HealEffect(owner, target, effect.damage);
        state = store.reduceEffect(state, healEffect);
        return state;
    }
    if (effect instanceof attack_effects_1.AddSpecialConditionsEffect) {
        const target = effect.target;
        effect.specialConditions.forEach(sp => {
            target.addSpecialCondition(sp);
        });
        if (effect.poisonDamage !== undefined) {
            target.poisonDamage = effect.poisonDamage;
        }
        return state;
    }
    if (effect instanceof attack_effects_1.RemoveSpecialConditionsEffect) {
        const target = effect.target;
        effect.specialConditions.forEach(sp => {
            target.removeSpecialCondition(sp);
        });
        return state;
    }
    return state;
}
exports.attackReducer = attackReducer;
