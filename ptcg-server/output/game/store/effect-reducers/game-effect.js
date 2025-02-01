"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameReducer = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const choose_attack_prompt_1 = require("../prompts/choose-attack-prompt");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
const confirm_prompt_1 = require("../prompts/confirm-prompt");
const state_utils_1 = require("../state-utils");
const card_list_1 = require("../state/card-list");
const state_1 = require("../state/state");
const check_effect_1 = require("./check-effect");
function applyWeaknessAndResistance(damage, cardTypes, additionalCardTypes, weakness, resistance) {
    let multiply = 1;
    let modifier = 0;
    const allTypes = [...cardTypes, ...additionalCardTypes];
    for (const item of weakness) {
        if (allTypes.includes(item.type)) {
            if (item.value === undefined) {
                multiply *= 2;
            }
            else {
                modifier += item.value;
            }
        }
    }
    for (const item of resistance) {
        if (allTypes.includes(item.type)) {
            modifier += item.value;
        }
    }
    return (damage * multiply) + modifier;
}
function* useAttack(next, store, state, effect) {
    var _a;
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    //Skip attack on first turn
    if (state.turn === 1 && player.canAttackFirstTurn !== true && state.rules.attackFirstTurn == false) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
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
    let attackingPokemon = player.active;
    // If this is Alakazam ex's attack from the bench, use that instead
    player.bench.forEach(benchSlot => {
        const benchPokemon = benchSlot.getPokemonCard();
        if (benchPokemon && benchPokemon.name === 'Alakazam ex' && benchPokemon.attacks.some(a => a.name === attack.name)) {
            attackingPokemon = benchSlot;
        }
    });
    const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
    state = store.reduceEffect(state, checkAttackCost);
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, attackingPokemon);
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
    // Check for knockouts and process them
    state = check_effect_1.checkState(store, state);
    // Check if the opponent's active Pokémon is knocked out
    if (opponent.active.cards.length === 0) {
        // Wait for the opponent to select a new active Pokémon
        yield store.waitPrompt(state, () => next());
    }
    const attackThisTurn = player.active.attacksThisTurn;
    const playerActive = player.active.getPokemonCard();
    // Now, we can check if the Pokémon can attack again
    const canAttackAgain = playerActive && playerActive.canAttackTwice && attackThisTurn && attackThisTurn < 2;
    const hasBarrageAbility = (_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers.some(power => power.barrage === true);
    if (canAttackAgain || hasBarrageAbility) {
        // Prompt the player if they want to attack again
        yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_ATTACK_AGAIN), wantToAttackAgain => {
            if (wantToAttackAgain) {
                if (hasBarrageAbility) {
                    // Use ChooseAttackPrompt for Barrage ability
                    store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [player.active.cards[0]], { allowCancel: false }), selectedAttack => {
                        if (selectedAttack) {
                            const secondAttackEffect = new game_effects_1.AttackEffect(player, opponent, selectedAttack);
                            state = useAttack(() => next(), store, state, secondAttackEffect).next().value;
                            if (store.hasPrompts()) {
                                state = store.waitPrompt(state, () => next());
                            }
                            if (secondAttackEffect.damage > 0) {
                                const dealDamage = new attack_effects_1.DealDamageEffect(secondAttackEffect, secondAttackEffect.damage);
                                state = store.reduceEffect(state, dealDamage);
                            }
                            return state; // Successfully executed attack, exit the function
                        }
                        next();
                    });
                }
                else {
                    // Recursively call useAttack for the second attack (for non-Barrage abilities)
                    const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                    state = store.reduceEffect(state, dealDamage);
                }
            }
            next();
        });
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
            if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || card.tags.includes(card_types_1.CardTag.TAG_TEAM) || card.tags.includes(card_types_1.CardTag.POKEMON_VUNION)) {
                effect.prizeCount += 2;
            }
            store.log(state, game_message_1.GameLog.LOG_POKEMON_KO, { name: card.name });
            const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
            if (card.tags.includes(card_types_1.CardTag.PRISM_STAR) || stadiumCard && stadiumCard.name === 'Lost City') {
                const lostZoned = new card_list_1.CardList();
                const pokemonIndices = effect.target.cards.map((card, index) => index);
                for (let i = pokemonIndices.length - 1; i >= 0; i--) {
                    const removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];
                    if (removedCard.cards) {
                        const attachedCards = removedCard.cards.cards.splice(0, removedCard.cards.cards.length);
                        effect.player.discard.cards.push(...attachedCards);
                    }
                    if (removedCard.superType === card_types_1.SuperType.POKEMON || removedCard.stage === card_types_1.Stage.BASIC) {
                        lostZoned.cards.push(removedCard);
                    }
                    else {
                        effect.player.discard.cards.push(removedCard);
                    }
                }
                lostZoned.moveTo(effect.player.lostzone);
                effect.target.clearEffects();
            }
            else {
                effect.target.moveTo(effect.player.discard);
                effect.target.clearEffects();
            }
            // const stadiumCard = StateUtils.getStadiumCard(state);
            // if (card.tags.includes(CardTag.PRISM_STAR) || stadiumCard && stadiumCard.name === 'Lost City') {
            //   effect.target.moveTo(effect.player.lostzone);
            //   effect.target.clearEffects();
            // } else {
            //   effect.target.moveTo(effect.player.discard);
            //   effect.target.clearEffects();
            // }
        }
    }
    if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
        const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
        state = store.reduceEffect(state, checkPokemonType);
        const checkPokemonStats = new check_effects_1.CheckPokemonStatsEffect(effect.target);
        state = store.reduceEffect(state, checkPokemonStats);
        const cardType = checkPokemonType.cardTypes;
        const additionalCardTypes = checkPokemonType.cardTypes;
        const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
        const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
        effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes, weakness, resistance);
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
    if (effect instanceof game_effects_1.UseTrainerPowerEffect) {
        const player = effect.player;
        const power = effect.power;
        const card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.TrainerPowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
        const target = effect.target;
        effect.specialConditions.forEach(sp => {
            target.addSpecialCondition(sp);
        });
        if (effect.poisonDamage !== undefined) {
            target.poisonDamage = effect.poisonDamage;
        }
        if (effect.burnDamage !== undefined) {
            target.burnDamage = effect.burnDamage;
        }
        if (effect.sleepFlips !== undefined) {
            target.sleepFlips = effect.sleepFlips;
        }
        return state;
    }
    if (effect instanceof game_effects_1.UseStadiumEffect) {
        const player = effect.player;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
        player.stadiumUsedTurn = state.turn;
    }
    // if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
    //   const player = effect.player;
    //   store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
    // }
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
        effect.target.marker.markers = [];
        effect.target.marker.markers = [];
    }
    return state;
}
exports.gameReducer = gameReducer;
