"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.setupPhaseReducer = exports.setupGame = void 0;
var add_player_action_1 = require("../actions/add-player-action");
var alert_prompt_1 = require("../prompts/alert-prompt");
var card_list_1 = require("../state/card-list");
var coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
var choose_cards_prompt_1 = require("../prompts/choose-cards-prompt");
var deck_analyser_1 = require("../../cards/deck-analyser");
var invite_player_action_1 = require("../actions/invite-player-action");
var invite_player_prompt_1 = require("../prompts/invite-player-prompt");
var player_1 = require("../state/player");
var show_cards_prompt_1 = require("../prompts/show-cards-prompt");
var shuffle_prompt_1 = require("../prompts/shuffle-prompt");
var state_1 = require("../state/state");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var play_card_action_1 = require("../actions/play-card-action");
var pokemon_card_list_1 = require("../state/pokemon-card-list");
var card_types_1 = require("../card/card-types");
var check_effect_1 = require("../effect-reducers/check-effect");
var game_phase_effect_1 = require("../effect-reducers/game-phase-effect");
var select_prompt_1 = require("../prompts/select-prompt");
var game_phase_effects_1 = require("../effects/game-phase-effects");
var pokemon_card_1 = require("../card/pokemon-card");
function putStartingPokemonsAndPrizes(player, cards, state) {
    if (cards.length === 0) {
        return;
    }
    player.hand.moveCardTo(cards[0], player.active);
    for (var i = 1; i < cards.length; i++) {
        player.hand.moveCardTo(cards[i], player.bench[i - 1]);
    }
    // Always place 6 prize cards
    for (var i = 0; i < 6; i++) {
        player.deck.moveTo(player.prizes[i], 1);
    }
}
function setupGame(next, store, state) {
    var player, opponent, basicPokemon, chooseCardsOptions, whoBeginsEffect, coinFlipPrompt, playerHasBasic, opponentHasBasic, playerCardsToDraw, opponentCardsToDraw, blocked, blockedOpponent, first, second, options_1, i, options_2, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = state.players[0];
                opponent = state.players[1];
                basicPokemon = { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC };
                chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
                whoBeginsEffect = new game_phase_effects_1.WhoBeginsEffect();
                store.reduceEffect(state, whoBeginsEffect);
                if (!whoBeginsEffect.player) return [3 /*break*/, 1];
                state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
                return [3 /*break*/, 3];
            case 1:
                coinFlipPrompt = new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.SETUP_WHO_BEGINS_FLIP);
                return [4 /*yield*/, store.prompt(state, coinFlipPrompt, function (whoBegins) {
                        var goFirstPrompt = new select_prompt_1.SelectPrompt(whoBegins ? player.id : opponent.id, game_message_1.GameMessage.GO_FIRST, [game_message_1.GameMessage.YES, game_message_1.GameMessage.NO]);
                        store.prompt(state, goFirstPrompt, function (choice) {
                            if (choice === 0) {
                                state.activePlayer = whoBegins ? 0 : 1;
                            }
                            else {
                                state.activePlayer = whoBegins ? 1 : 0;
                            }
                            next();
                        });
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                playerHasBasic = false;
                opponentHasBasic = false;
                playerCardsToDraw = 0;
                opponentCardsToDraw = 0;
                _a.label = 4;
            case 4:
                if (!(!playerHasBasic || !opponentHasBasic)) return [3 /*break*/, 13];
                if (!!playerHasBasic) return [3 /*break*/, 6];
                player.hand.moveTo(player.deck);
                return [4 /*yield*/, store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), function (order) {
                        player.deck.applyOrder(order);
                        player.deck.moveTo(player.hand, 7);
                        var hasBasicPokemon = player.hand.count(basicPokemon) > 0;
                        var setupCards = player.hand.cards.filter(function (c) { return c.tags.includes(card_types_1.CardTag.PLAY_DURING_SETUP); });
                        var hasOnlySetupCards = !hasBasicPokemon && setupCards.length > 0;
                        if (hasBasicPokemon) {
                            playerHasBasic = true;
                            next();
                        }
                        else if (hasOnlySetupCards) {
                            playerHasBasic = false; // Reset this before the prompt
                            return store.prompt(state, new select_prompt_1.SelectPrompt(player.id, game_message_1.GameMessage.SETUP_CARDS_AVAILABLE, [game_message_1.GameMessage.USE_SETUP_CARDS, game_message_1.GameMessage.MULLIGAN], { allowCancel: false }), function (choice) {
                                playerHasBasic = choice === 0;
                                next();
                            });
                        }
                        else {
                            playerHasBasic = false;
                            next();
                        }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!!opponentHasBasic) return [3 /*break*/, 8];
                opponent.hand.moveTo(opponent.deck);
                return [4 /*yield*/, store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id), function (order) {
                        opponent.deck.applyOrder(order);
                        opponent.deck.moveTo(opponent.hand, 7);
                        var hasBasicPokemon = opponent.hand.count(basicPokemon) > 0;
                        var setupCards = opponent.hand.cards.filter(function (c) { return c.tags.includes(card_types_1.CardTag.PLAY_DURING_SETUP); });
                        var hasOnlySetupCards = !hasBasicPokemon && setupCards.length > 0;
                        if (hasBasicPokemon) {
                            opponentHasBasic = true;
                            next();
                        }
                        else if (hasOnlySetupCards) {
                            opponentHasBasic = false; // Reset this before the prompt
                            return store.prompt(state, new select_prompt_1.SelectPrompt(opponent.id, game_message_1.GameMessage.SETUP_CARDS_AVAILABLE, [game_message_1.GameMessage.USE_SETUP_CARDS, game_message_1.GameMessage.MULLIGAN], { allowCancel: false }), function (choice) {
                                opponentHasBasic = choice === 0;
                                next();
                            });
                        }
                        else {
                            opponentHasBasic = false;
                            next();
                        }
                    })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!(playerHasBasic && !opponentHasBasic)) return [3 /*break*/, 10];
                store.log(state, game_message_1.GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: opponent.name });
                return [4 /*yield*/, store.prompt(state, [
                        new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.SETUP_OPPONENT_NO_BASIC, opponent.hand.cards, { allowCancel: false }),
                        new alert_prompt_1.AlertPrompt(opponent.id, game_message_1.GameMessage.SETUP_PLAYER_NO_BASIC)
                    ], function (results) {
                        playerCardsToDraw++;
                        next();
                    })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                if (!(!playerHasBasic && opponentHasBasic)) return [3 /*break*/, 12];
                store.log(state, game_message_1.GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: player.name });
                return [4 /*yield*/, store.prompt(state, [
                        new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.SETUP_OPPONENT_NO_BASIC, player.hand.cards, { allowCancel: false }),
                        new alert_prompt_1.AlertPrompt(player.id, game_message_1.GameMessage.SETUP_PLAYER_NO_BASIC)
                    ], function (results) {
                        opponentCardsToDraw++;
                        next();
                    })];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [3 /*break*/, 4];
            case 13:
                blocked = [];
                player.hand.cards.forEach(function (c, index) {
                    if (c.tags.includes((card_types_1.CardTag.PLAY_DURING_SETUP)) || (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
                    }
                    else {
                        blocked.push(index);
                    }
                });
                blockedOpponent = [];
                opponent.hand.cards.forEach(function (c, index) {
                    if (c.tags.includes((card_types_1.CardTag.PLAY_DURING_SETUP)) || (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
                    }
                    else {
                        blockedOpponent.push(index);
                    }
                });
                return [4 /*yield*/, store.prompt(state, [
                        new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_STARTING_POKEMONS, player.hand, {}, __assign(__assign({}, chooseCardsOptions), { blocked: blocked })),
                        new choose_cards_prompt_1.ChooseCardsPrompt(opponent, game_message_1.GameMessage.CHOOSE_STARTING_POKEMONS, opponent.hand, {}, __assign(__assign({}, chooseCardsOptions), { blocked: blockedOpponent }))
                    ], function (choice) {
                        putStartingPokemonsAndPrizes(player, choice[0], state);
                        putStartingPokemonsAndPrizes(opponent, choice[1], state);
                        next();
                    })];
            case 14:
                _a.sent();
                first = state.players[state.activePlayer];
                second = state.players[state.activePlayer ? 0 : 1];
                first.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, function (cardList) { cardList.pokemonPlayedTurn = 1; });
                second.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, function (cardList) { cardList.pokemonPlayedTurn = 2; });
                if (playerCardsToDraw > 0) {
                    options_1 = [];
                    for (i = playerCardsToDraw; i >= 0; i--) {
                        options_1.push({ message: "Draw " + i + " card(s)", value: i });
                    }
                    return [2 /*return*/, store.prompt(state, new select_prompt_1.SelectPrompt(player.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS, options_1.map(function (c) { return c.message; }), { allowCancel: false }), function (choice) {
                            var option = options_1[choice];
                            var numCardsToDraw = option.value;
                            player.deck.moveTo(player.hand, numCardsToDraw);
                            return game_phase_effect_1.initNextTurn(store, state);
                        })];
                }
                if (opponentCardsToDraw > 0) {
                    options_2 = [];
                    for (i = opponentCardsToDraw; i >= 0; i--) {
                        options_2.push({ message: "Draw " + i + " card(s)", value: i });
                    }
                    return [2 /*return*/, store.prompt(state, new select_prompt_1.SelectPrompt(opponent.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS, options_2.map(function (c) { return c.message; }), { allowCancel: false }), function (choice) {
                            var option = options_2[choice];
                            var numCardsToDraw = option.value;
                            opponent.deck.moveTo(opponent.hand, numCardsToDraw);
                            return game_phase_effect_1.initNextTurn(store, state);
                        })];
                }
                return [2 /*return*/, game_phase_effect_1.initNextTurn(store, state)];
        }
    });
}
exports.setupGame = setupGame;
function createPlayer(id, name) {
    var player = new player_1.Player();
    player.id = id;
    player.name = name;
    // Empty prizes, places for 6 cards
    for (var i = 0; i < 6; i++) {
        var prize = new card_list_1.CardList();
        prize.isSecret = true;
        player.prizes.push(prize);
    }
    // Empty bench, places for 5 pokemons
    for (var i = 0; i < 5; i++) {
        var bench = new pokemon_card_list_1.PokemonCardList();
        bench.isPublic = true;
        player.bench.push(bench);
    }
    player.active.isPublic = true;
    player.discard.isPublic = true;
    player.lostzone.isPublic = true;
    player.stadium.isPublic = true;
    player.supporter.isPublic = true;
    return player;
}
function setupPhaseReducer(store, state, action) {
    if (state.phase === state_1.GamePhase.WAITING_FOR_PLAYERS) {
        if (action instanceof add_player_action_1.AddPlayerAction) {
            if (state.players.length >= 2) {
                throw new game_error_1.GameError(game_message_1.GameMessage.MAX_PLAYERS_REACHED);
            }
            if (state.players.length == 1 && state.players[0].id === action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.ALREADY_PLAYING);
            }
            var deckAnalyser = new deck_analyser_1.DeckAnalyser(action.deck);
            if (!deckAnalyser.isValid()) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_DECK);
            }
            var player = createPlayer(action.clientId, action.name);
            player.deck = card_list_1.CardList.fromList(action.deck);
            player.deck.isSecret = true;
            player.deck.cards.forEach(function (c) {
                state.cardNames.push(c.fullName);
                c.id = state.cardNames.length - 1;
            });
            state.players.push(player);
            if (state.players.length === 2) {
                state.phase = state_1.GamePhase.SETUP;
                var generator_1 = setupGame(function () { return generator_1.next(); }, store, state);
                return generator_1.next().value;
            }
            return state;
        }
        if (action instanceof invite_player_action_1.InvitePlayerAction) {
            if (state.players.length >= 2) {
                throw new game_error_1.GameError(game_message_1.GameMessage.MAX_PLAYERS_REACHED);
            }
            if (state.players.length == 1 && state.players[0].id === action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.ALREADY_PLAYING);
            }
            var player_2 = createPlayer(action.clientId, action.name);
            state.players.push(player_2);
            state = store.prompt(state, new invite_player_prompt_1.InvitePlayerPrompt(player_2.id, game_message_1.GameMessage.INVITATION_MESSAGE), function (deck) {
                if (deck === null) {
                    store.log(state, game_message_1.GameLog.LOG_INVITATION_NOT_ACCEPTED, { name: player_2.name });
                    var winner = state_1.GameWinner.NONE;
                    state = check_effect_1.endGame(store, state, winner);
                    return;
                }
                var deckAnalyser = new deck_analyser_1.DeckAnalyser(deck);
                if (!deckAnalyser.isValid()) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_DECK);
                }
                player_2.deck = card_list_1.CardList.fromList(deck);
                player_2.deck.isSecret = true;
                player_2.deck.cards.forEach(function (c) {
                    state.cardNames.push(c.fullName);
                    c.id = state.cardNames.length - 1;
                });
                if (state.players.length === 2) {
                    state.phase = state_1.GamePhase.SETUP;
                    var generator_2 = setupGame(function () { return generator_2.next(); }, store, state);
                    return generator_2.next().value;
                }
            });
            return state;
        }
        return state;
    }
    return state;
}
exports.setupPhaseReducer = setupPhaseReducer;
