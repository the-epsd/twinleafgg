"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameReducer = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const state_1 = require("../state/state");
const state_utils_1 = require("../state-utils");
const check_effects_1 = require("../effects/check-effects");
const card_types_1 = require("../card/card-types");
const game_effects_1 = require("../effects/game-effects");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
const attack_effects_1 = require("../effects/attack-effects");
const play_card_effects_1 = require("../effects/play-card-effects");
function applyWeaknessAndResistance(damage, cardTypes, weakness, resistance) {
    let multiply = 1;
    let modifier = 0;
    for (const item of weakness) {
        if (cardTypes.includes(item.type)) {
            if (item.value === undefined) {
                multiply *= 2;
            }
            else {
                modifier += item.value;
            }
        }
    }
    for (const item of resistance) {
        if (cardTypes.includes(item.type)) {
            modifier += item.value;
        }
    }
    return (damage * multiply) + modifier;
}
function* useAttack(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (card_types_1.Format.STANDARD) {
        //Skip attack on first turn
        if (state.turn === 1 && player.canAttackFirstTurn !== true && state.rules.attackFirstTurn == false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
        }
    }
    const sp = player.active.specialConditions;
    if (sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
    }
    // if (player.alteredCreationDamage == true) {
    //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    //     if (effect instanceof DealDamageEffect && effect.source === cardList) {
    //       effect.damage += 20;
    //     }
    //   });
    // }
    const attack = effect.attack;
    const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
    state = store.reduceEffect(state, checkAttackCost);
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    if (state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
        throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
    }
    if (sp.includes(card_types_1.SpecialCondition.CONFUSED)) {
        let flip = false;
        store.log(state, game_message_1.GameLog.LOG_FLIP_CONFUSION, { name: player.name });
        yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_CONFUSION), result => {
            flip = result;
            next();
        });
        if (flip === false) {
            store.log(state, game_message_1.GameLog.LOG_HURTS_ITSELF);
            player.active.damage += 30;
            state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
            return state;
        }
    }
    store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
    state.phase = state_1.GamePhase.ATTACK;
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    return store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
}
function gameReducer(store, state, effect) {
    if (effect instanceof game_effects_1.KnockOutEffect) {
        // const player = effect.player;
        const card = effect.target.getPokemonCard();
        if (card !== undefined) {
            //Altered Creation GX
            // if (player.usedAlteredCreation == true) {
            //   effect.prizeCount += 1;
            // }
            // Pokemon ex rule
            if (card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_ex) || card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                effect.prizeCount += 1;
            }
            if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || card.tags.includes(card_types_1.CardTag.TAG_TEAM)) {
                effect.prizeCount += 2;
            }
            store.log(state, game_message_1.GameLog.LOG_POKEMON_KO, { name: card.name });
            effect.target.moveTo(effect.player.discard);
            effect.target.clearEffects();
        }
    }
    if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
        const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
        state = store.reduceEffect(state, checkPokemonType);
        const checkPokemonStats = new check_effects_1.CheckPokemonStatsEffect(effect.target);
        state = store.reduceEffect(state, checkPokemonStats);
        const cardType = checkPokemonType.cardTypes;
        const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
        const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
        effect.damage = applyWeaknessAndResistance(effect.damage, cardType, weakness, resistance);
        return state;
    }
    if (effect instanceof game_effects_1.UseAttackEffect) {
        const generator = useAttack(() => generator.next(), store, state, effect);
        return generator.next().value;
    }
    if (effect instanceof game_effects_1.UsePowerEffect) {
        const player = effect.player;
        const power = effect.power;
        const card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.PowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof game_effects_1.UseStadiumEffect) {
        const player = effect.player;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
        player.stadiumUsedTurn = state.turn;
    }
    if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.trainerType === card_types_1.TrainerType.SUPPORTER) {
        const player = effect.player;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
    }
    if (effect instanceof game_effects_1.HealEffect) {
        effect.target.damage = Math.max(0, effect.target.damage - effect.damage);
        return state;
    }
    if (effect instanceof game_effects_1.EvolveEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_EVOLVES_POKEMON, {
            name: effect.player.name,
            pokemon: pokemonCard.name,
            card: effect.pokemonCard.name
        });
        effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
        effect.target.pokemonPlayedTurn = state.turn;
        // effect.target.clearEffects();
        // Apply the removePokemonEffects method from the Player class
        // effect.player.removePokemonEffects(effect.target);
        effect.target.specialConditions = [];
        effect.target.marker.markers = [];
        effect.target.attackMarker.markers = [];
        effect.target.abilityMarker.markers = [];
    }
    return state;
}
exports.gameReducer = gameReducer;
