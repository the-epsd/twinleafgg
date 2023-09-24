"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.FLIP_IF_HEADS = exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = exports.DISCARD_STADIUM_IN_PLAY = exports.WAS_ABILITY_USED = exports.WAS_ATTACK_USED = void 0;
const __1 = require("../..");
const game_effects_1 = require("../effects/game-effects");
const attack_effects_1 = require("../effects/attack-effects");
const attack_effects_2 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_1 = require("../../../game");
function WAS_ATTACK_USED(effect, index, user) {
    return effect instanceof game_effects_1.AttackEffect && effect.attack === user.attacks[0];
}
exports.WAS_ATTACK_USED = WAS_ATTACK_USED;
function WAS_ABILITY_USED(effect, index, user) {
    return effect instanceof game_effects_1.PowerEffect && effect.power === user.powers[0];
}
exports.WAS_ABILITY_USED = WAS_ABILITY_USED;
function DISCARD_STADIUM_IN_PLAY(state) {
    const stadiumCard = __1.StateUtils.getStadiumCard(state);
    if (stadiumCard !== undefined) {
        // Discard Stadium
        const cardList = __1.StateUtils.findCardList(state, stadiumCard);
        const player = __1.StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
    }
    return state;
}
exports.DISCARD_STADIUM_IN_PLAY = DISCARD_STADIUM_IN_PLAY;
function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, type, amount) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_2.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
}
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = DISCARD_X_ENERGY_FROM_THIS_POKEMON;
function FLIP_IF_HEADS() {
    console.log('Heads again!');
}
exports.FLIP_IF_HEADS = FLIP_IF_HEADS;
function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, damage);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
    return state;
}
exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = HEAL_X_DAMAGE_FROM_THIS_POKEMON;
function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user) {
    // TODO: Would like to check if Pokemon has damage without needing the effect
    const player = effect.player;
    const source = player.active;
    // Check if source Pokemon has damage
    const damage = source.damage;
    if (damage > 0) {
        return true;
    }
    return false;
}
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT;
