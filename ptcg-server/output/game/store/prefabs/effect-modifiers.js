"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAKE_X_MORE_PRIZE_CARDS = exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = void 0;
function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage) {
    effect.damage += 100;
    return state;
}
exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = THIS_ATTACK_DOES_X_MORE_DAMAGE;
function TAKE_X_MORE_PRIZE_CARDS(effect, state) {
    effect.prizeCount += 1;
    return state;
}
exports.TAKE_X_MORE_PRIZE_CARDS = TAKE_X_MORE_PRIZE_CARDS;
