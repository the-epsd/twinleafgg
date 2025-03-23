"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.gameReducer = void 0;
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var card_types_1 = require("../card/card-types");
var trainer_card_1 = require("../card/trainer-card");
var attack_effects_1 = require("../effects/attack-effects");
var check_effects_1 = require("../effects/check-effects");
var game_effects_1 = require("../effects/game-effects");
var game_phase_effects_1 = require("../effects/game-phase-effects");
var choose_attack_prompt_1 = require("../prompts/choose-attack-prompt");
var coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
var confirm_prompt_1 = require("../prompts/confirm-prompt");
var state_utils_1 = require("../state-utils");
var card_list_1 = require("../state/card-list");
var state_1 = require("../state/state");
var check_effect_1 = require("./check-effect");
var game_effects_2 = require("../effects/game-effects");
var pokemon_card_list_1 = require("../state/pokemon-card-list");
var prefabs_1 = require("../prefabs/prefabs");
function applyWeaknessAndResistance(damage, cardTypes, additionalCardTypes, weakness, resistance) {
    var multiply = 1;
    var modifier = 0;
    var allTypes = __spreadArray(__spreadArray([], cardTypes), additionalCardTypes);
    for (var _i = 0, weakness_1 = weakness; _i < weakness_1.length; _i++) {
        var item = weakness_1[_i];
        if (allTypes.includes(item.type)) {
            if (item.value === undefined) {
                multiply *= 2;
            }
            else {
                modifier += item.value;
            }
        }
    }
    for (var _a = 0, resistance_1 = resistance; _a < resistance_1.length; _a++) {
        var item = resistance_1[_a];
        if (allTypes.includes(item.type)) {
            modifier += item.value;
        }
    }
    return (damage * multiply) + modifier;
}
function useAttack(next, store, state, effect) {
    function useSubsequentAttack(attack) {
        var nextAttackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
        state = useAttack(function () { return next(); }, store, state, nextAttackEffect).next().value;
        if (store.hasPrompts()) {
            state = store.waitPrompt(state, function () { return next(); });
        }
        if (nextAttackEffect.damage > 0) {
            var dealDamage = new attack_effects_1.DealDamageEffect(nextAttackEffect, nextAttackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
        }
        state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
        return state;
    }
    var player, opponent, sp, attack, attackingPokemon, attackingPokemonCard, checkAttackCost, checkProvidedEnergy, flip_1, attackEffect, dealDamage, afterAttackEffect, canAttackAgain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = effect.player;
                opponent = state_utils_1.StateUtils.getOpponent(state, player);
                //Skip attack on first turn
                if (state.turn === 1 && effect.attack.canUseOnFirstTurn !== true && state.rules.attackFirstTurn == false) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
                }
                sp = player.active.specialConditions;
                if (sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
                }
                attack = effect.attack;
                attackingPokemon = player.active;
                // Check for attacks that can be used from bench
                player.bench.forEach(function (benchSlot) {
                    var benchPokemon = benchSlot.getPokemonCard();
                    if (benchPokemon && benchPokemon.attacks.some(function (a) { return a.name === attack.name && a.useOnBench; })) {
                        attackingPokemon = benchSlot;
                    }
                });
                attackingPokemonCard = attackingPokemon.getPokemonCard();
                checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
                state = store.reduceEffect(state, checkAttackCost);
                checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, attackingPokemon);
                state = store.reduceEffect(state, checkProvidedEnergy);
                if (state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
                }
                if (!sp.includes(card_types_1.SpecialCondition.CONFUSED)) return [3 /*break*/, 2];
                flip_1 = false;
                store.log(state, game_message_1.GameLog.LOG_FLIP_CONFUSION, { name: player.name });
                return [4 /*yield*/, store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_CONFUSION), function (result) {
                        flip_1 = result;
                        next();
                    })];
            case 1:
                _a.sent();
                if (flip_1 === false) {
                    store.log(state, game_message_1.GameLog.LOG_HURTS_ITSELF);
                    player.active.damage += 30;
                    state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
                    return [2 /*return*/, state];
                }
                _a.label = 2;
            case 2:
                store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
                state.phase = state_1.GamePhase.ATTACK;
                attackEffect = (effect instanceof game_effects_1.AttackEffect) ? effect : new game_effects_1.AttackEffect(player, opponent, attack);
                state = store.reduceEffect(state, attackEffect);
                if (!store.hasPrompts()) return [3 /*break*/, 4];
                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (attackEffect.damage > 0) {
                    dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                    state = store.reduceEffect(state, dealDamage);
                }
                attackingPokemonCard.attacksThisTurn += 1;
                afterAttackEffect = new game_phase_effects_1.AfterAttackEffect(effect.player);
                store.reduceEffect(state, afterAttackEffect);
                if (!store.hasPrompts()) return [3 /*break*/, 6];
                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                // Check for knockouts and process them
                state = check_effect_1.checkState(store, state);
                if (!(opponent.active.cards.length === 0)) return [3 /*break*/, 8];
                // Wait for the opponent to select a new active Pokémon
                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
            case 7:
                // Wait for the opponent to select a new active Pokémon
                _a.sent();
                _a.label = 8;
            case 8:
                canAttackAgain = attackingPokemonCard.maxAttacksThisTurn > attackingPokemonCard.attacksThisTurn;
                if (!canAttackAgain) return [3 /*break*/, 10];
                // Prompt the player if they want to attack again
                return [4 /*yield*/, store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_ATTACK_AGAIN), function (wantToAttackAgain) {
                        if (wantToAttackAgain) {
                            if (attackingPokemonCard.allowSubsequentAttackChoice) {
                                var attackableCards = player.active.cards.filter(function (card) {
                                    return card.superType === card_types_1.SuperType.POKEMON || (card.superType === card_types_1.SuperType.TRAINER && card instanceof trainer_card_1.TrainerCard &&
                                        card.trainerType === card_types_1.TrainerType.TOOL && card.attacks.length > 0);
                                });
                                // Use ChooseAttackPrompt for Barrage ability
                                store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, attackableCards, { allowCancel: false }), function (selection) {
                                    return useSubsequentAttack(selection);
                                });
                            }
                            else {
                                return useSubsequentAttack(attack);
                            }
                        }
                        else {
                            state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
                        }
                        next();
                    })];
            case 9:
                // Prompt the player if they want to attack again
                _a.sent();
                _a.label = 10;
            case 10:
                if (!canAttackAgain) {
                    return [2 /*return*/, store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player))];
                }
                return [2 /*return*/];
        }
    });
}
function gameReducer(store, state, effect) {
    if (effect instanceof game_effects_1.KnockOutEffect) {
        // const player = effect.player;
        var card = effect.target.getPokemonCard();
        if (card !== undefined) {
            //Altered Creation GX
            // if (player.usedAlteredCreation == true) {
            //   effect.prizeCount += 1;
            // }
            // Pokemon ex rule
            if (card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_ex) || card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                effect.prizeCount += 1;
            }
            if (card.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) || card.tags.includes(card_types_1.CardTag.TAG_TEAM)) {
                effect.prizeCount += 1;
            }
            if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || card.tags.includes(card_types_1.CardTag.POKEMON_VUNION)) {
                effect.prizeCount += 2;
            }
            store.log(state, game_message_1.GameLog.LOG_POKEMON_KO, { name: card.name });
            var stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
            if (card.tags.includes(card_types_1.CardTag.PRISM_STAR) || stadiumCard && stadiumCard.name === 'Lost City') {
                var lostZoned = new card_list_1.CardList();
                var pokemonIndices = effect.target.cards.map(function (card, index) { return index; });
                for (var i = pokemonIndices.length - 1; i >= 0; i--) {
                    var removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];
                    if (removedCard.cards) {
                        prefabs_1.MOVE_CARDS(store, state, removedCard.cards, effect.player.discard);
                    }
                    if (removedCard.superType === card_types_1.SuperType.POKEMON || removedCard.stage === card_types_1.Stage.BASIC) {
                        lostZoned.cards.push(removedCard);
                    }
                    else {
                        effect.player.discard.cards.push(removedCard);
                    }
                }
                // Move cards to lost zone
                effect.target.clearEffects();
                prefabs_1.MOVE_CARDS(store, state, lostZoned, effect.player.lostzone);
            }
            else {
                // Move cards to discard
                effect.target.clearEffects();
                prefabs_1.MOVE_CARDS(store, state, effect.target, effect.player.discard);
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
        var checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
        state = store.reduceEffect(state, checkPokemonType);
        var checkPokemonStats = new check_effects_1.CheckPokemonStatsEffect(effect.target);
        state = store.reduceEffect(state, checkPokemonStats);
        var cardType = checkPokemonType.cardTypes;
        var additionalCardTypes = checkPokemonType.cardTypes;
        var weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
        var resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
        effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes, weakness, resistance);
        return state;
    }
    if (effect instanceof game_effects_1.UseAttackEffect) {
        var generator_1 = useAttack(function () { return generator_1.next(); }, store, state, effect);
        return generator_1.next().value;
    }
    if (effect instanceof game_effects_1.UsePowerEffect) {
        var player = effect.player;
        var power = effect.power;
        var card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.PowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof game_effects_1.UseTrainerPowerEffect) {
        var player = effect.player;
        var power = effect.power;
        var card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.TrainerPowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
        var target_1 = effect.target;
        effect.specialConditions.forEach(function (sp) {
            target_1.addSpecialCondition(sp);
        });
        if (effect.poisonDamage !== undefined) {
            target_1.poisonDamage = effect.poisonDamage;
        }
        if (effect.burnDamage !== undefined) {
            target_1.burnDamage = effect.burnDamage;
        }
        if (effect.sleepFlips !== undefined) {
            target_1.sleepFlips = effect.sleepFlips;
        }
        return state;
    }
    if (effect instanceof game_effects_1.UseStadiumEffect) {
        var player = effect.player;
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
        var pokemonCard = effect.target.getPokemonCard();
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
    if (effect instanceof game_effects_2.MoveCardsEffect) {
        var source = effect.source;
        var destination = effect.destination;
        // If source is a PokemonCardList, always clean up when moving cards
        if (source instanceof pokemon_card_list_1.PokemonCardList) {
            source.clearEffects();
            source.damage = 0;
            source.specialConditions = [];
            source.marker.markers = [];
            source.tool = undefined;
            source.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
        // If specific cards are specified
        if (effect.cards) {
            if (source instanceof pokemon_card_list_1.PokemonCardList) {
                source.moveCardsTo(effect.cards, destination);
                // Log the card movement
                // effect.cards.forEach(card => {
                //   store.log(state, GameLog.LOG_CARD_MOVED, { name: card.name, action: 'put', destination: 'destination' });
                // });
                if (effect.toBottom) {
                    destination.cards = __spreadArray(__spreadArray([], destination.cards.slice(effect.cards.length)), effect.cards);
                }
                else if (effect.toTop) {
                    destination.cards = __spreadArray(__spreadArray([], effect.cards), destination.cards);
                }
            }
            else {
                source.moveCardsTo(effect.cards, destination);
                // Log the card movement
                // effect.cards.forEach(card => {
                //   store.log(state, GameLog.LOG_CARD_MOVED, { name: card.name, action: 'put', destination: 'destination' });
                // });
                if (effect.toBottom) {
                    destination.cards = __spreadArray(__spreadArray([], destination.cards.slice(effect.cards.length)), effect.cards);
                }
                else if (effect.toTop) {
                    destination.cards = __spreadArray(__spreadArray([], effect.cards), destination.cards);
                }
            }
        }
        // If count is specified
        else if (effect.count !== undefined) {
            var cards = source.cards.slice(0, effect.count);
            source.moveCardsTo(cards, destination);
            // Log the card movement
            // cards.forEach(card => {
            //   store.log(state, GameLog.LOG_CARD_MOVED, { name: card.name, action: 'put', destination: 'destination' });
            // });
            if (effect.toBottom) {
                destination.cards = __spreadArray(__spreadArray([], destination.cards.slice(cards.length)), cards);
            }
            else if (effect.toTop) {
                destination.cards = __spreadArray(__spreadArray([], cards), destination.cards);
            }
        }
        // Move all cards
        else {
            if (effect.toTop) {
                source.moveToTopOfDestination(destination);
            }
            else {
                source.moveTo(destination);
            }
        }
        // If source is a PokemonCardList and we moved all cards, discard remaining attached cards
        if (source instanceof pokemon_card_list_1.PokemonCardList && source.getPokemons().length === 0) {
            var player = state_utils_1.StateUtils.findOwner(state, source);
            source.moveTo(player.discard);
        }
        return state;
    }
    return state;
}
exports.gameReducer = gameReducer;
