"use strict";
exports.__esModule = true;
exports.attackReducer = void 0;
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var attack_effects_1 = require("../effects/attack-effects");
var game_effects_1 = require("../effects/game-effects");
var state_utils_1 = require("../state-utils");
function attackReducer(store, state, effect) {
    if (effect instanceof attack_effects_1.PutDamageEffect) {
        var target = effect.target;
        var sourceOwner = state_utils_1.StateUtils.findOwner(state, effect.source);
        var targetCard = target.getPokemonCard();
        if (targetCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        var opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
        if (effect.attackEffect && target === opponent.active && !effect.weaknessApplied) {
            // Apply weakness
            var applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect.attackEffect, effect.damage);
            applyWeakness.target = effect.target;
            applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
            applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
            state = store.reduceEffect(state, applyWeakness);
            effect.damage = applyWeakness.damage;
        }
        var damage = Math.max(0, effect.damage);
        target.damage += damage;
        var targetOwner = state_utils_1.StateUtils.findOwner(state, target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
        if (damage > 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_DEALS_DAMAGE, {
                name: sourceOwner.name,
                damage: damage,
                target: targetCard.name,
                effect: effect.attack.name
            });
            var afterDamageEffect = new attack_effects_1.AfterDamageEffect(effect.attackEffect, damage);
            afterDamageEffect.target = effect.target;
            store.reduceEffect(state, afterDamageEffect);
        }
    }
    if (effect instanceof attack_effects_1.DealDamageEffect) {
        var base = effect.attackEffect;
        var applyWeakness = new attack_effects_1.ApplyWeaknessEffect(base, effect.damage);
        applyWeakness.target = effect.target;
        applyWeakness.ignoreWeakness = base.ignoreWeakness;
        applyWeakness.ignoreResistance = base.ignoreResistance;
        state = store.reduceEffect(state, applyWeakness);
        var dealDamage = new attack_effects_1.PutDamageEffect(base, applyWeakness.damage);
        dealDamage.target = effect.target;
        dealDamage.weaknessApplied = true;
        state = store.reduceEffect(state, dealDamage);
        return state;
    }
    if (effect instanceof attack_effects_1.KOEffect) {
        var target = effect.target;
        var pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        // Check if the effect is part of an attack and the target is the opponent's active Pokemon
        var opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
        if (effect.attackEffect && target === opponent.active) {
            // Apply weakness
            var applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect.attackEffect, effect.damage);
            applyWeakness.target = effect.target;
            applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
            applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
            state = store.reduceEffect(state, applyWeakness);
            effect.damage = applyWeakness.damage;
        }
        var damage = Math.max(0, effect.damage);
        target.damage += damage;
        var targetOwner = state_utils_1.StateUtils.findOwner(state, target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
        if (damage > 0) {
            var afterDamageEffect = new attack_effects_1.AfterDamageEffect(effect.attackEffect, damage);
            afterDamageEffect.target = effect.target;
            store.reduceEffect(state, afterDamageEffect);
        }
    }
    if (effect instanceof attack_effects_1.KnockOutOpponentEffect) {
        var target = effect.target;
        var pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        var damage = Math.max(0, effect.damage);
        target.damage += damage;
    }
    if (effect instanceof attack_effects_1.PutCountersEffect) {
        var target = effect.target;
        var sourceOwner = state_utils_1.StateUtils.findOwner(state, effect.source);
        var targetCard = target.getPokemonCard();
        if (targetCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        var damage = Math.max(0, effect.damage);
        target.damage += damage;
        if (damage > 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
                name: sourceOwner.name,
                damage: damage,
                target: targetCard.name,
                effect: effect.attack.name
            });
        }
    }
    if (effect instanceof attack_effects_1.AfterDamageEffect) {
        var targetOwner = state_utils_1.StateUtils.findOwner(state, effect.target);
        targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
    }
    if (effect instanceof attack_effects_1.DiscardCardsEffect) {
        var target = effect.target;
        var cards = effect.cards;
        var owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.discard);
        return state;
    }
    if (effect instanceof attack_effects_1.LostZoneCardsEffect) {
        var target = effect.target;
        var cards = effect.cards;
        var owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.lostzone);
        return state;
    }
    if (effect instanceof attack_effects_1.CardsToHandEffect) {
        var target = effect.target;
        var cards = effect.cards;
        var owner = state_utils_1.StateUtils.findOwner(state, target);
        target.moveCardsTo(cards, owner.hand);
        return state;
    }
    if (effect instanceof attack_effects_1.AddMarkerEffect) {
        var target = effect.target;
        target.marker.addMarker(effect.markerName, effect.markerSource);
        return state;
    }
    if (effect instanceof attack_effects_1.HealTargetEffect) {
        var target = effect.target;
        var owner = state_utils_1.StateUtils.findOwner(state, target);
        var healEffect = new game_effects_1.HealEffect(owner, target, effect.damage);
        state = store.reduceEffect(state, healEffect);
        return state;
    }
    if (effect instanceof attack_effects_1.AddSpecialConditionsEffect) {
        var target_1 = effect.target;
        effect.specialConditions.forEach(function (sp) {
            target_1.addSpecialCondition(sp);
        });
        if (effect.poisonDamage !== undefined) {
            target_1.poisonDamage = effect.poisonDamage;
        }
        return state;
    }
    if (effect instanceof attack_effects_1.RemoveSpecialConditionsEffect) {
        var target_2 = effect.target;
        effect.specialConditions.forEach(function (sp) {
            target_2.removeSpecialCondition(sp);
        });
        return state;
    }
    return state;
}
exports.attackReducer = attackReducer;
