"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPhaseReducer = exports.setupGame = void 0;
const add_player_action_1 = require("../actions/add-player-action");
const alert_prompt_1 = require("../prompts/alert-prompt");
const card_list_1 = require("../state/card-list");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
const choose_cards_prompt_1 = require("../prompts/choose-cards-prompt");
const deck_analyser_1 = require("../../cards/deck-analyser");
const invite_player_action_1 = require("../actions/invite-player-action");
const invite_player_prompt_1 = require("../prompts/invite-player-prompt");
const player_1 = require("../state/player");
const show_cards_prompt_1 = require("../prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../prompts/shuffle-prompt");
const state_1 = require("../state/state");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const play_card_action_1 = require("../actions/play-card-action");
const pokemon_card_list_1 = require("../state/pokemon-card-list");
const card_types_1 = require("../card/card-types");
const check_effect_1 = require("../effect-reducers/check-effect");
const game_phase_effect_1 = require("../effect-reducers/game-phase-effect");
const select_prompt_1 = require("../prompts/select-prompt");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const pokemon_card_1 = require("../card/pokemon-card");
function putStartingPokemonsAndPrizes(player, cards, state) {
    if (cards.length === 0) {
        return;
    }
    player.hand.moveCardTo(cards[0], player.active);
    for (let i = 1; i < cards.length; i++) {
        player.hand.moveCardTo(cards[i], player.bench[i - 1]);
    }
    // Always place 6 prize cards
    for (let i = 0; i < 6; i++) {
        player.deck.moveTo(player.prizes[i], 1);
    }
}
function* setupGame(next, store, state) {
    const player = state.players[0];
    const opponent = state.players[1];
    const basicPokemon = { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC };
    const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
    const whoBeginsEffect = new game_phase_effects_1.WhoBeginsEffect();
    store.reduceEffect(state, whoBeginsEffect);
    if (whoBeginsEffect.player) {
        state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
    }
    else {
        const coinFlipPrompt = new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.SETUP_WHO_BEGINS_FLIP);
        yield store.prompt(state, coinFlipPrompt, whoBegins => {
            const goFirstPrompt = new select_prompt_1.SelectPrompt(whoBegins ? player.id : opponent.id, game_message_1.GameMessage.GO_FIRST, [game_message_1.GameMessage.YES, game_message_1.GameMessage.NO]);
            store.prompt(state, goFirstPrompt, choice => {
                if (choice === 0) {
                    state.activePlayer = whoBegins ? 0 : 1;
                }
                else {
                    state.activePlayer = whoBegins ? 1 : 0;
                }
                next();
            });
        });
    }
    let playerHasBasic = false;
    let opponentHasBasic = false;
    let playerCardsToDraw = 0;
    let opponentCardsToDraw = 0;
    while (!playerHasBasic || !opponentHasBasic) {
        if (!playerHasBasic) {
            player.hand.moveTo(player.deck);
            yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                player.deck.moveTo(player.hand, 7);
                playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(card_types_1.CardTag.PLAY_DURING_SETUP));
                next();
            });
        }
        if (!opponentHasBasic) {
            opponent.hand.moveTo(opponent.deck);
            yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
                opponent.deck.moveTo(opponent.hand, 7);
                opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(card_types_1.CardTag.PLAY_DURING_SETUP));
                next();
            });
        }
        if (playerHasBasic && !opponentHasBasic) {
            store.log(state, game_message_1.GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: opponent.name });
            yield store.prompt(state, [
                new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.SETUP_OPPONENT_NO_BASIC, opponent.hand.cards, { allowCancel: false }),
                new alert_prompt_1.AlertPrompt(opponent.id, game_message_1.GameMessage.SETUP_PLAYER_NO_BASIC)
            ], results => {
                playerCardsToDraw++;
                next();
            });
        }
        if (!playerHasBasic && opponentHasBasic) {
            store.log(state, game_message_1.GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: player.name });
            yield store.prompt(state, [
                new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.SETUP_OPPONENT_NO_BASIC, player.hand.cards, { allowCancel: false }),
                new alert_prompt_1.AlertPrompt(player.id, game_message_1.GameMessage.SETUP_PLAYER_NO_BASIC)
            ], results => {
                opponentCardsToDraw++;
                next();
            });
        }
    }
    const blocked = [];
    player.hand.cards.forEach((c, index) => {
        if (c.tags.includes((card_types_1.CardTag.PLAY_DURING_SETUP)) || (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
        }
        else {
            blocked.push(index);
        }
    });
    const blockedOpponent = [];
    opponent.hand.cards.forEach((c, index) => {
        if (c.tags.includes((card_types_1.CardTag.PLAY_DURING_SETUP)) || (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
        }
        else {
            blockedOpponent.push(index);
        }
    });
    yield store.prompt(state, [
        new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_STARTING_POKEMONS, player.hand, {}, Object.assign(Object.assign({}, chooseCardsOptions), { blocked })),
        new choose_cards_prompt_1.ChooseCardsPrompt(opponent, game_message_1.GameMessage.CHOOSE_STARTING_POKEMONS, opponent.hand, {}, Object.assign(Object.assign({}, chooseCardsOptions), { blocked: blockedOpponent }))
    ], choice => {
        putStartingPokemonsAndPrizes(player, choice[0], state);
        putStartingPokemonsAndPrizes(opponent, choice[1], state);
        next();
    });
    // Set initial Pokemon Played Turn, so players can't evolve during first turn
    const first = state.players[state.activePlayer];
    const second = state.players[state.activePlayer ? 0 : 1];
    first.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => { cardList.pokemonPlayedTurn = 1; });
    second.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, cardList => { cardList.pokemonPlayedTurn = 2; });
    if (playerCardsToDraw > 0) {
        const options = [];
        for (let i = playerCardsToDraw; i >= 0; i--) {
            options.push({ message: `Draw ${i} card(s)`, value: i });
        }
        return store.prompt(state, new select_prompt_1.SelectPrompt(player.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS, options.map(c => c.message), { allowCancel: false }), choice => {
            const option = options[choice];
            const numCardsToDraw = option.value;
            player.deck.moveTo(player.hand, numCardsToDraw);
            return game_phase_effect_1.initNextTurn(store, state);
        });
    }
    if (opponentCardsToDraw > 0) {
        const options = [];
        for (let i = opponentCardsToDraw; i >= 0; i--) {
            options.push({ message: `Draw ${i} card(s)`, value: i });
        }
        return store.prompt(state, new select_prompt_1.SelectPrompt(opponent.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS, options.map(c => c.message), { allowCancel: false }), choice => {
            const option = options[choice];
            const numCardsToDraw = option.value;
            opponent.deck.moveTo(opponent.hand, numCardsToDraw);
            return game_phase_effect_1.initNextTurn(store, state);
        });
    }
    return game_phase_effect_1.initNextTurn(store, state);
}
exports.setupGame = setupGame;
function createPlayer(id, name) {
    const player = new player_1.Player();
    player.id = id;
    player.name = name;
    // Empty prizes, places for 6 cards
    for (let i = 0; i < 6; i++) {
        const prize = new card_list_1.CardList();
        prize.isSecret = true;
        player.prizes.push(prize);
    }
    // Empty bench, places for 5 pokemons
    for (let i = 0; i < 5; i++) {
        const bench = new pokemon_card_list_1.PokemonCardList();
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
            const deckAnalyser = new deck_analyser_1.DeckAnalyser(action.deck);
            if (!deckAnalyser.isValid()) {
                throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_DECK);
            }
            const player = createPlayer(action.clientId, action.name);
            player.deck = card_list_1.CardList.fromList(action.deck);
            player.deck.isSecret = true;
            player.deck.cards.forEach(c => {
                state.cardNames.push(c.fullName);
                c.id = state.cardNames.length - 1;
            });
            state.players.push(player);
            if (state.players.length === 2) {
                state.phase = state_1.GamePhase.SETUP;
                const generator = setupGame(() => generator.next(), store, state);
                return generator.next().value;
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
            const player = createPlayer(action.clientId, action.name);
            state.players.push(player);
            state = store.prompt(state, new invite_player_prompt_1.InvitePlayerPrompt(player.id, game_message_1.GameMessage.INVITATION_MESSAGE), deck => {
                if (deck === null) {
                    store.log(state, game_message_1.GameLog.LOG_INVITATION_NOT_ACCEPTED, { name: player.name });
                    const winner = state_1.GameWinner.NONE;
                    state = check_effect_1.endGame(store, state, winner);
                    return;
                }
                const deckAnalyser = new deck_analyser_1.DeckAnalyser(deck);
                if (!deckAnalyser.isValid()) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_DECK);
                }
                player.deck = card_list_1.CardList.fromList(deck);
                player.deck.isSecret = true;
                player.deck.cards.forEach(c => {
                    state.cardNames.push(c.fullName);
                    c.id = state.cardNames.length - 1;
                });
                if (state.players.length === 2) {
                    state.phase = state_1.GamePhase.SETUP;
                    const generator = setupGame(() => generator.next(), store, state);
                    return generator.next().value;
                }
            });
            return state;
        }
        return state;
    }
    return state;
}
exports.setupPhaseReducer = setupPhaseReducer;
