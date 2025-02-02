"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = void 0;
const game_effects_1 = require("../effects/game-effects");
/**
 * These prefabs are for "boolean" card effects. Boolean card effects oftentimes start with
 * an "if"; the function names here omit the "if" as they return booleans, and almost always
 * belong inside an if statement.
 */
/**
 *
 * @param effect
 * @param state
 * @returns
 */
function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state) {
    // TODO: this shouldn't work for attacks with damage counters, but I think it will
    return effect instanceof game_effects_1.KnockOutEffect;
}
exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK;
function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user) {
    // TODO: Would like to check if Pokemon has damage without needing the effect
    const player = effect.player;
    const source = player.active;
    // Check if source Pokemon has damage
    const damage = source.damage;
    return damage > 0;
}
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT;
