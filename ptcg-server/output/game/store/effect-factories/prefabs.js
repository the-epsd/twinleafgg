"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCARD_ENERGY_FROM_SELF = exports.DISCARD_STADIUM_IN_PLAY = exports.WAS_ABILITY_USED = exports.WAS_ATTACK_USED = void 0;
const __1 = require("../..");
const game_effects_1 = require("../effects/game-effects");
const attack_effects_1 = require("../effects/attack-effects");
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
function DISCARD_ENERGY_FROM_SELF(state, effect, store, type, amount) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
}
exports.DISCARD_ENERGY_FROM_SELF = DISCARD_ENERGY_FROM_SELF;
