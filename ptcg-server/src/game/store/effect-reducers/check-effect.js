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
exports.checkStateReducer = exports.checkState = exports.executeCheckState = exports.checkWinner = exports.endGame = void 0;
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var play_card_action_1 = require("../actions/play-card-action");
var energy_card_1 = require("../card/energy-card");
var check_effects_1 = require("../effects/check-effects");
var game_effects_1 = require("../effects/game-effects");
var prefabs_1 = require("../prefabs/prefabs");
var choose_pokemon_prompt_1 = require("../prompts/choose-pokemon-prompt");
var choose_prize_prompt_1 = require("../prompts/choose-prize-prompt");
var coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
var shuffle_prompt_1 = require("../prompts/shuffle-prompt");
var setup_reducer_1 = require("../reducers/setup-reducer");
var pokemon_card_list_1 = require("../state/pokemon-card-list");
var state_1 = require("../state/state");
function findKoPokemons(store, state) {
    var pokemons = [];
    var _loop_1 = function (i) {
        var player = state.players[i];
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, function (cardList, card, target) {
            var checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
            store.reduceEffect(state, checkHpEffect);
            if (cardList.damage >= checkHpEffect.hp) {
                pokemons.push({ playerNum: i, cardList: cardList });
            }
        });
    };
    for (var i = 0; i < state.players.length; i++) {
        _loop_1(i);
    }
    return pokemons;
}
//New, Optimized Code ^^ Test Old Code CPU Usage First
// function findKoPokemons(store: StoreLike, state: State): PokemonItem[] {
//   return state.players.reduce((koPokemons: PokemonItem[], player, playerNum) => {
//     player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
//       const checkHpEffect = new CheckHpEffect(player, cardList);
//       store.reduceEffect(state, checkHpEffect);
//       if (cardList.damage >= checkHpEffect.hp) {
//         koPokemons.push({ playerNum, cardList });
//       }
//     });
//     return koPokemons;
//   }, []);
// }
// function handleMaxToolsChange(store: StoreLike, state: State): State {
//   state.players.forEach((player, index) => {
//     player.forEachPokemon(PlayerType.ANY, (cardList) => {
//       if (cardList.tools.length > cardList.maxTools) {
//         const amount = cardList.tools.length - cardList.maxTools;
//         REMOVE_TOOLS_FROM_POKEMON_PROMPT(store, state, player, cardList, SlotType.DISCARD, amount, amount);
//       }
//     });
//   });
//   return state;
// }
function handleBenchSizeChange(store, state, benchSizes) {
    state.players.forEach(function (player, index) {
        var benchSize = benchSizes[index];
        // Add empty slots if bench is smaller
        while (player.bench.length < benchSize) {
            var bench = new pokemon_card_list_1.PokemonCardList();
            bench.isPublic = true;
            player.bench.push(bench);
        }
        if (player.bench.length === benchSize) {
            return;
        }
        // Remove empty slots, starting from the right side
        var empty = [];
        for (var index_1 = player.bench.length - 1; index_1 >= 0; index_1--) {
            var bench = player.bench[index_1];
            var isEmpty = bench.cards.length === 0;
            if (player.bench.length - empty.length > benchSize && isEmpty) {
                empty.push(bench);
            }
        }
        if (player.bench.length - empty.length <= benchSize) {
            // Discarding empty slots is enough
            for (var i = player.bench.length - 1; i >= 0; i--) {
                if (empty.includes(player.bench[i])) {
                    player.bench.splice(i, 1);
                }
            }
            return;
        }
        // Player has more Pokemons than bench size, discard some
        var count = player.bench.length - empty.length - benchSize;
        store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { min: count, max: count, allowCancel: false }), function (results) {
            results = results || [];
            var selected = __spreadArray(__spreadArray([], empty), results);
            // Discard all empty slots and selected Pokemons
            for (var i = player.bench.length - 1; i >= 0; i--) {
                if (selected.includes(player.bench[i])) {
                    player.bench[i].moveTo(player.discard);
                    player.bench.splice(i, 1);
                }
            }
        });
    });
    return state;
}
function chooseActivePokemons(state) {
    var prompts = [];
    for (var _i = 0, _a = state.players; _i < _a.length; _i++) {
        var player = _a[_i];
        var hasActive = player.active.cards.length > 0;
        var hasBenched = player.bench.some(function (bench) { return bench.cards.length > 0; });
        if (!hasActive && hasBenched) {
            var choose = new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { min: 1, allowCancel: false });
            prompts.push(choose);
        }
    }
    return prompts;
}
function choosePrizeCards(store, state, prizeGroups) {
    var prompts = [];
    var _loop_2 = function (i) {
        var player = state.players[i];
        var _loop_3 = function (group) {
            var prizeLeft = player.getPrizeLeft();
            // In sudden death, taking any prize card means winning
            if (group.count > 0 && state.isSuddenDeath) {
                endGame(store, state, i === 0 ? state_1.GameWinner.PLAYER_1 : state_1.GameWinner.PLAYER_2);
                return { value: [] };
            }
            // If prizes to take >= remaining prizes, automatically take all prizes and end game
            if (group.count >= prizeLeft && prizeLeft > 0) {
                // Move all remaining prize cards to destination (default: hand)
                player.prizes.forEach(function (prizeList) {
                    prizeList.moveTo(group.destination || player.hand);
                });
                // End game with this player as winner
                endGame(store, state, i === 0 ? state_1.GameWinner.PLAYER_1 : state_1.GameWinner.PLAYER_2);
                return { value: [] };
            }
            if (group.count > prizeLeft) {
                group.count = prizeLeft;
            }
            if (group.count > 0) {
                var message = game_message_1.GameMessage.CHOOSE_PRIZE_CARD;
                // Choose a custom message based on the destination.
                if (group.destination === player.discard) {
                    message = game_message_1.GameMessage.CHOOSE_PRIZE_CARD_TO_DISCARD;
                }
                var prompt_1 = new choose_prize_prompt_1.ChoosePrizePrompt(player.id, message, {
                    isSecret: player.prizes[0].isSecret,
                    count: group.count,
                    destination: group.destination
                });
                prompts.push(prompt_1);
            }
        };
        for (var _i = 0, _a = prizeGroups[i]; _i < _a.length; _i++) {
            var group = _a[_i];
            var state_3 = _loop_3(group);
            if (typeof state_3 === "object")
                return state_3;
        }
    };
    for (var i = 0; i < state.players.length; i++) {
        var state_2 = _loop_2(i);
        if (typeof state_2 === "object")
            return state_2.value;
    }
    return prompts;
}
// function choosePrizeCards(state: State, prizesToTake: [number, number]): ChooseCardsPrompt[] {
//   const prompts: ChooseCardsPrompt[] = [];
//   for (let i = 0; i < state.players.length; i++) {
//     const player = state.players[i];
//     const prizeLeft = player.getPrizeLeft();
//     if (prizesToTake[i] > prizeLeft) {
//       prizesToTake[i] = prizeLeft;
//     }
//     if (prizesToTake[i] > 0) {
//       const allPrizeCards = new CardList();
//       // allPrizeCards.isSecret = true;  // Set the CardList as secret
//       // allPrizeCards.isPublic = false;
//       // allPrizeCards.faceUpPrize = false;
//       player.prizes.forEach(prizeList => {
//         allPrizeCards.cards.push(...prizeList.cards);
//       });
//       const prompt = new ChooseCardsPrompt(
//         player,
//         GameMessage.CHOOSE_PRIZE_CARD,
//         allPrizeCards,
//         {},  // No specific filter needed for prizes
//         { min: prizesToTake[i], max: prizesToTake[i], isSecret: player.prizes[0].isSecret, allowCancel: false }
//       );
//       prompts.push(prompt);
//     }
//   }
//   return prompts;
// }
function endGame(store, state, winner) {
    if (state.players.length !== 2) {
        return state;
    }
    if ([
        state_1.GamePhase.WAITING_FOR_PLAYERS,
        state_1.GamePhase.PLAYER_TURN,
        state_1.GamePhase.ATTACK,
        state_1.GamePhase.BETWEEN_TURNS
    ].includes(state.phase) === false) {
        return state;
    }
    switch (winner) {
        case state_1.GameWinner.NONE:
            store.log(state, game_message_1.GameLog.LOG_GAME_FINISHED);
            break;
        case state_1.GameWinner.DRAW:
            store.log(state, game_message_1.GameLog.LOG_GAME_FINISHED_DRAW);
            break;
        case state_1.GameWinner.PLAYER_1:
        case state_1.GameWinner.PLAYER_2: {
            var winnerName = winner === state_1.GameWinner.PLAYER_1
                ? state.players[0].name
                : state.players[1].name;
            store.log(state, game_message_1.GameLog.LOG_GAME_FINISHED_WINNER, { name: winnerName });
            break;
        }
    }
    state.winner = winner;
    state.phase = state_1.GamePhase.FINISHED;
    return state;
}
exports.endGame = endGame;
function checkWinner(store, state, onComplete) {
    var points = [0, 0];
    var reasons = [[], []];
    for (var i = 0; i < state.players.length; i++) {
        var player = state.players[i];
        // Check for no active Pokemon
        if (player.active.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_ACTIVE_POKEMON, { name: player.name });
            points[i === 0 ? 1 : 0]++;
            reasons[i === 0 ? 1 : 0].push('no_active');
        }
        if (player.prizes.every(function (p) { return p.cards.length === 0; })) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_PRIZE_CARD, { name: player.name });
            points[i]++;
            reasons[i].push('no_prizes');
        }
    }
    // Check for Sudden Death condition
    if (points[0] > 0 && points[1] > 0) {
        return initiateSuddenDeath(store, state);
    }
    if (points[0] + points[1] === 0) {
        if (onComplete) {
            onComplete();
        }
        return state;
    }
    var winner = state_1.GameWinner.DRAW;
    if (points[0] > points[1]) {
        winner = state_1.GameWinner.PLAYER_1;
    }
    else if (points[1] > points[0]) {
        winner = state_1.GameWinner.PLAYER_2;
    }
    state = endGame(store, state, winner);
    if (onComplete) {
        onComplete();
    }
    return state;
}
exports.checkWinner = checkWinner;
function initiateSuddenDeath(store, state) {
    store.log(state, game_message_1.GameLog.LOG_SUDDEN_DEATH);
    // Reset decks
    state.players.forEach(function (player) {
        // Collect all cards back to deck including stadium, lost zone and any other zones
        __spreadArray(__spreadArray(__spreadArray(__spreadArray([player.active], player.bench), [player.discard]), player.prizes), [player.hand, player.lostzone, player.stadium]).forEach(function (cardList) { return cardList.moveTo(player.deck); });
        // Reset VSTAR and GX markers
        player.usedGX = false;
        player.usedVSTAR = false;
        // Shuffle deck
        return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), function (order) {
            player.deck.applyOrder(order);
        });
    });
    // Coin flip for first player
    return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(state.players[0].id, game_message_1.GameMessage.SETUP_WHO_BEGINS_FLIP), function (result) {
        var firstPlayer = result ? 0 : 1;
        setupSuddenDeathGame(store, state, firstPlayer);
    });
}
function setupSuddenDeathGame(store, state, firstPlayer) {
    state.activePlayer = firstPlayer;
    state.turn = 0;
    state.phase = state_1.GamePhase.SETUP;
    state.isSuddenDeath = true;
    var generator = setup_reducer_1.setupGame(function () { return generator.next(); }, store, state);
    return generator.next().value;
}
function executeCheckState(next, store, state, onComplete) {
    var prizeGroups, checkTableStateEffect, pokemonsToDiscard, _loop_4, _i, pokemonsToDiscard_1, pokemonToDiscard, prizePrompts, _loop_5, _a, prizePrompts_1, prompt_2, activePrompts, _loop_6, _b, activePrompts_1, prompt_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prizeGroups = state.players.map(function () { return []; });
                checkTableStateEffect = new check_effects_1.CheckTableStateEffect([5, 5]);
                store.reduceEffect(state, checkTableStateEffect);
                // handleMaxToolsChange(store, state);
                handleBenchSizeChange(store, state, checkTableStateEffect.benchSizes);
                if (!store.hasPrompts()) return [3 /*break*/, 2];
                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                pokemonsToDiscard = findKoPokemons(store, state);
                _loop_4 = function (pokemonToDiscard) {
                    var owner, knockOutEffect, opponentIndex, defaultDestination, destination_1, group;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                owner = state.players[pokemonToDiscard.playerNum];
                                knockOutEffect = new game_effects_1.KnockOutEffect(owner, pokemonToDiscard.cardList);
                                state = store.reduceEffect(state, knockOutEffect);
                                if (!store.hasPrompts()) return [3 /*break*/, 2];
                                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
                            case 1:
                                _d.sent();
                                _d.label = 2;
                            case 2:
                                if (knockOutEffect.preventDefault === false) {
                                    opponentIndex = pokemonToDiscard.playerNum === 0 ? 1 : 0;
                                    defaultDestination = state.players[opponentIndex].hand;
                                    destination_1 = knockOutEffect.prizeDestination || defaultDestination;
                                    group = prizeGroups[opponentIndex].find(function (g) { return g.destination === destination_1; });
                                    if (!group) {
                                        group = { destination: destination_1, count: 0 };
                                        prizeGroups[opponentIndex].push(group);
                                    }
                                    group.count += knockOutEffect.prizeCount;
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, pokemonsToDiscard_1 = pokemonsToDiscard;
                _c.label = 3;
            case 3:
                if (!(_i < pokemonsToDiscard_1.length)) return [3 /*break*/, 6];
                pokemonToDiscard = pokemonsToDiscard_1[_i];
                return [5 /*yield**/, _loop_4(pokemonToDiscard)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                // Check if the game has ended before proceeding with prompts
                if (state.phase === state_1.GamePhase.FINISHED) {
                    return [2 /*return*/, state];
                }
                prizePrompts = choosePrizeCards(store, state, prizeGroups);
                _loop_5 = function (prompt_2) {
                    var player;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                player = state.players.find(function (p) { return p.id === prompt_2.playerId; });
                                if (!player) {
                                    throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
                                }
                                state = store.prompt(state, prompt_2, function (result) {
                                    var destination = prompt_2.options.destination || player.hand;
                                    prefabs_1.TAKE_SPECIFIC_PRIZES(store, state, player, result, { destination: destination });
                                });
                                if (!store.hasPrompts()) return [3 /*break*/, 2];
                                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
                            case 1:
                                _e.sent();
                                _e.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                _a = 0, prizePrompts_1 = prizePrompts;
                _c.label = 7;
            case 7:
                if (!(_a < prizePrompts_1.length)) return [3 /*break*/, 10];
                prompt_2 = prizePrompts_1[_a];
                return [5 /*yield**/, _loop_5(prompt_2)];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                _a++;
                return [3 /*break*/, 7];
            case 10:
                activePrompts = chooseActivePokemons(state);
                _loop_6 = function (prompt_3) {
                    var player;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                player = state.players.find(function (p) { return p.id === prompt_3.playerId; });
                                if (!player) {
                                    throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
                                }
                                state = store.prompt(state, prompt_3, function (result) {
                                    var selectedPokemon = result;
                                    if (selectedPokemon.length !== 1) {
                                        throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
                                    }
                                    var benchIndex = player.bench.indexOf(selectedPokemon[0]);
                                    if (benchIndex === -1 || player.active.cards.length > 0) {
                                        throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
                                    }
                                    var temp = player.active;
                                    var playerActive = player.active.getPokemonCard();
                                    player.active = player.bench[benchIndex];
                                    if (playerActive) {
                                        playerActive.movedToActiveThisTurn = true;
                                    }
                                    player.bench[benchIndex] = temp;
                                });
                                if (!store.hasPrompts()) return [3 /*break*/, 2];
                                return [4 /*yield*/, store.waitPrompt(state, function () { return next(); })];
                            case 1:
                                _f.sent();
                                _f.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                _b = 0, activePrompts_1 = activePrompts;
                _c.label = 11;
            case 11:
                if (!(_b < activePrompts_1.length)) return [3 /*break*/, 14];
                prompt_3 = activePrompts_1[_b];
                return [5 /*yield**/, _loop_6(prompt_3)];
            case 12:
                _c.sent();
                _c.label = 13;
            case 13:
                _b++;
                return [3 /*break*/, 11];
            case 14:
                checkWinner(store, state, onComplete);
                return [2 /*return*/, state];
        }
    });
}
exports.executeCheckState = executeCheckState;
function checkState(store, state, onComplete) {
    if ([state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK, state_1.GamePhase.BETWEEN_TURNS].includes(state.phase) === false) {
        if (onComplete !== undefined) {
            onComplete();
        }
        return state;
    }
    var generator = executeCheckState(function () { return generator.next(); }, store, state, onComplete);
    return generator.next().value;
}
exports.checkState = checkState;
function checkStateReducer(store, state, effect) {
    if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
        effect.source.cards.forEach(function (c) {
            if (c instanceof energy_card_1.EnergyCard && !effect.energyMap.some(function (e) { return e.card === c; })) {
                effect.energyMap.push({ card: c, provides: c.provides });
            }
        });
        return state;
    }
    return state;
}
exports.checkStateReducer = checkStateReducer;
