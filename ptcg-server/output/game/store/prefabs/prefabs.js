"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = exports.TAKE_X_MORE_PRIZE_CARDS = exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = exports.FLIP_IF_HEADS = exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = exports.CHOOSE_CARDS_TO_PUT_ON_BENCH = exports.DISCARD_A_STADIUM_CARD_IN_PLAY = exports.PASSIVE_ABILITY_ACTIVATED = exports.WAS_ABILITY_USED = exports.WAS_ATTACK_USED = void 0;
const __1 = require("../..");
const card_types_1 = require("../card/card-types");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
/**
 *
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
function WAS_ATTACK_USED(effect, index, user) {
    return effect instanceof game_effects_1.AttackEffect && effect.attack === user.attacks[index];
}
exports.WAS_ATTACK_USED = WAS_ATTACK_USED;
/**
 *
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
function WAS_ABILITY_USED(effect, index, user) {
    return effect instanceof game_effects_1.PowerEffect && effect.power === user.powers[index];
}
exports.WAS_ABILITY_USED = WAS_ABILITY_USED;
/**
 *
 * A basic effect for checking whether or not a passive ability gets activated.
 * @returns whether or not a passive ability was activated.
 */
function PASSIVE_ABILITY_ACTIVATED(effect, user) {
    return effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(user);
}
exports.PASSIVE_ABILITY_ACTIVATED = PASSIVE_ABILITY_ACTIVATED;
/**
 *
 * @param state is the game state.
 * @returns the game state after discarding a stadium card in play.
 */
function DISCARD_A_STADIUM_CARD_IN_PLAY(state) {
    const stadiumCard = __1.StateUtils.getStadiumCard(state);
    if (stadiumCard !== undefined) {
        const cardList = __1.StateUtils.findCardList(state, stadiumCard);
        const player = __1.StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
    }
}
exports.DISCARD_A_STADIUM_CARD_IN_PLAY = DISCARD_A_STADIUM_CARD_IN_PLAY;
function CHOOSE_CARDS_TO_PUT_ON_BENCH(store, state, effect, min, max, stage) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    state = store.prompt(state, new __1.ChooseCardsPrompt(player.id, __1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage }, { min, max: slots.length < max ? slots.length : max, allowCancel: true }), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
            return store.reduceEffect(state, effect);
        });
    });
    return state;
}
exports.CHOOSE_CARDS_TO_PUT_ON_BENCH = CHOOSE_CARDS_TO_PUT_ON_BENCH;
function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, type, amount) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
    return state;
}
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = DISCARD_X_ENERGY_FROM_THIS_POKEMON;
function FLIP_IF_HEADS() {
    console.log('Heads again!');
}
exports.FLIP_IF_HEADS = FLIP_IF_HEADS;
function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage) {
    effect.damage += 100;
    return state;
}
exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = THIS_ATTACK_DOES_X_MORE_DAMAGE;
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
    return damage > 0;
}
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT;
function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state) {
    // TODO: this shouldn't work for attacks with damage counters, but I think it will
    return effect instanceof game_effects_1.KnockOutEffect;
}
exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK;
function TAKE_X_MORE_PRIZE_CARDS(effect, state) {
    effect.prizeCount += 1;
    return state;
}
exports.TAKE_X_MORE_PRIZE_CARDS = TAKE_X_MORE_PRIZE_CARDS;
function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.bench.filter(b => b.cards.length > 0);
    if (targets.length === 0) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH]), selected => {
        const target = selected[0];
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON;
