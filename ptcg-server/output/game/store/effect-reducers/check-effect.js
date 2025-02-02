"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStateReducer = exports.checkState = exports.executeCheckState = exports.checkWinner = exports.endGame = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const play_card_action_1 = require("../actions/play-card-action");
const energy_card_1 = require("../card/energy-card");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const choose_pokemon_prompt_1 = require("../prompts/choose-pokemon-prompt");
const choose_prize_prompt_1 = require("../prompts/choose-prize-prompt");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
const shuffle_prompt_1 = require("../prompts/shuffle-prompt");
const setup_reducer_1 = require("../reducers/setup-reducer");
const pokemon_card_list_1 = require("../state/pokemon-card-list");
const state_1 = require("../state/state");
function findKoPokemons(store, state) {
    const pokemons = [];
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
            store.reduceEffect(state, checkHpEffect);
            if (cardList.damage >= checkHpEffect.hp) {
                pokemons.push({ playerNum: i, cardList });
            }
        });
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
function handleBenchSizeChange(store, state, benchSizes) {
    state.players.forEach((player, index) => {
        const benchSize = benchSizes[index];
        // Add empty slots if bench is smaller
        while (player.bench.length < benchSize) {
            const bench = new pokemon_card_list_1.PokemonCardList();
            bench.isPublic = true;
            player.bench.push(bench);
        }
        if (player.bench.length === benchSize) {
            return;
        }
        // Remove empty slots, starting from the right side
        const empty = [];
        for (let index = player.bench.length - 1; index >= 0; index--) {
            const bench = player.bench[index];
            const isEmpty = bench.cards.length === 0;
            if (player.bench.length - empty.length > benchSize && isEmpty) {
                empty.push(bench);
            }
        }
        if (player.bench.length - empty.length <= benchSize) {
            // Discarding empty slots is enough
            for (let i = player.bench.length - 1; i >= 0; i--) {
                if (empty.includes(player.bench[i])) {
                    player.bench.splice(i, 1);
                }
            }
            return;
        }
        // Player has more Pokemons than bench size, discard some
        const count = player.bench.length - empty.length - benchSize;
        store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { min: count, max: count, allowCancel: false }), results => {
            results = results || [];
            const selected = [...empty, ...results];
            // Discard all empty slots and selected Pokemons
            for (let i = player.bench.length - 1; i >= 0; i--) {
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
    const prompts = [];
    for (const player of state.players) {
        const hasActive = player.active.cards.length > 0;
        const hasBenched = player.bench.some(bench => bench.cards.length > 0);
        if (!hasActive && hasBenched) {
            const choose = new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { min: 1, allowCancel: false });
            prompts.push(choose);
        }
    }
    return prompts;
}
function choosePrizeCards(store, state, prizesToTake) {
    const prompts = [];
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        const prizeLeft = player.getPrizeLeft();
        if (prizesToTake[i] > 0 && state.isSuddenDeath) {
            // In sudden death, taking any prize cards means winning
            endGame(store, state, i === 0 ? state_1.GameWinner.PLAYER_1 : state_1.GameWinner.PLAYER_2);
            return [];
        }
        if (prizesToTake[i] > prizeLeft) {
            prizesToTake[i] = prizeLeft;
        }
        if (prizesToTake[i] > 0) {
            const prompt = new choose_prize_prompt_1.ChoosePrizePrompt(player.id, game_message_1.GameMessage.CHOOSE_PRIZE_CARD, { isSecret: player.prizes[0].isSecret, count: prizesToTake[i] });
            prompts.push(prompt);
        }
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
            const winnerName = winner === state_1.GameWinner.PLAYER_1
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
    const points = [0, 0];
    const reasons = [[], []];
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        // Check for no active Pokemon
        if (player.active.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_ACTIVE_POKEMON, { name: player.name });
            points[i === 0 ? 1 : 0]++;
            reasons[i === 0 ? 1 : 0].push('no_active');
        }
        if (player.prizes.every(p => p.cards.length === 0)) {
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
    let winner = state_1.GameWinner.DRAW;
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
    state.players.forEach(player => {
        // Collect all cards back to deck including stadium, lost zone and any other zones
        [player.active, ...player.bench, player.discard, ...player.prizes, player.hand, player.lostzone, player.stadium]
            .forEach(cardList => cardList.moveTo(player.deck));
        // Reset VSTAR and GX markers
        player.usedGX = false;
        player.usedVSTAR = false;
        // Shuffle deck
        return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
        });
    });
    // Coin flip for first player
    return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(state.players[0].id, game_message_1.GameMessage.SETUP_WHO_BEGINS_FLIP), result => {
        const firstPlayer = result ? 0 : 1;
        setupSuddenDeathGame(store, state, firstPlayer);
    });
}
function setupSuddenDeathGame(store, state, firstPlayer) {
    state.activePlayer = firstPlayer;
    state.turn = 0;
    state.phase = state_1.GamePhase.SETUP;
    state.isSuddenDeath = true;
    const generator = setup_reducer_1.setupGame(() => generator.next(), store, state);
    return generator.next().value;
}
function handlePrompts(store, state, prompts, onComplete) {
    const prompt = prompts.shift();
    if (prompt === undefined) {
        onComplete();
        return state;
    }
    const player = state.players.find(p => p.id === prompt.playerId);
    if (player === undefined) {
        throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
    }
    return store.prompt(state, prompt, (result) => {
        if (prompt instanceof choose_prize_prompt_1.ChoosePrizePrompt) {
            const prizes = result;
            prizes.forEach(prize => prize.moveTo(player.hand));
            handlePrompts(store, state, prompts, onComplete);
        }
        else if (prompt instanceof choose_pokemon_prompt_1.ChoosePokemonPrompt) {
            const selectedPokemon = result;
            if (selectedPokemon.length !== 1) {
                throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
            }
            const benchIndex = player.bench.indexOf(selectedPokemon[0]);
            if (benchIndex === -1 || player.active.cards.length > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
            }
            const temp = player.active;
            const playerActive = player.active.getPokemonCard();
            player.active = player.bench[benchIndex];
            if (playerActive) {
                playerActive.movedToActiveThisTurn = true;
            }
            player.bench[benchIndex] = temp;
            handlePrompts(store, state, prompts, onComplete);
        }
    });
}
function* executeCheckState(next, store, state, onComplete) {
    const prizesToTake = [0, 0];
    // This effect checks the general data from the table (bench size)
    const checkTableStateEffect = new check_effects_1.CheckTableStateEffect([5, 5]);
    store.reduceEffect(state, checkTableStateEffect);
    handleBenchSizeChange(store, state, checkTableStateEffect.benchSizes);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    const pokemonsToDiscard = findKoPokemons(store, state);
    for (const item of pokemonsToDiscard) {
        const player = state.players[item.playerNum];
        const knockOutEffect = new game_effects_1.KnockOutEffect(player, item.cardList);
        state = store.reduceEffect(state, knockOutEffect);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
        if (knockOutEffect.preventDefault === false) {
            const opponentNum = item.playerNum === 0 ? 1 : 0;
            prizesToTake[opponentNum] += knockOutEffect.prizeCount;
        }
    }
    const prompts = [
        ...choosePrizeCards(store, state, prizesToTake),
        ...chooseActivePokemons(state)
    ];
    const completed = [false, false];
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        const playerPrompts = prompts.filter(p => p.playerId === player.id);
        state = handlePrompts(store, state, playerPrompts, () => {
            completed[i] = true;
            if (completed.every(c => c)) {
                checkWinner(store, state, onComplete);
            }
        });
    }
    return state;
}
exports.executeCheckState = executeCheckState;
function checkState(store, state, onComplete) {
    if ([state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK, state_1.GamePhase.BETWEEN_TURNS].includes(state.phase) === false) {
        if (onComplete !== undefined) {
            onComplete();
        }
        return state;
    }
    const generator = executeCheckState(() => generator.next(), store, state, onComplete);
    return generator.next().value;
}
exports.checkState = checkState;
function checkStateReducer(store, state, effect) {
    if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
        effect.source.cards.forEach(c => {
            if (c instanceof energy_card_1.EnergyCard && !effect.energyMap.some(e => e.card === c)) {
                effect.energyMap.push({ card: c, provides: c.provides });
            }
        });
        return state;
    }
    return state;
}
exports.checkStateReducer = checkStateReducer;
