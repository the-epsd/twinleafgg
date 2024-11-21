"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStateReducer = exports.checkState = exports.endGame = void 0;
const game_message_1 = require("../../game-message");
const play_card_action_1 = require("../actions/play-card-action");
const energy_card_1 = require("../card/energy-card");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const choose_cards_prompt_1 = require("../prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../prompts/choose-pokemon-prompt");
const card_list_1 = require("../state/card-list");
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
function choosePrizeCards(state, prizesToTake) {
    const prompts = [];
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        const prizeLeft = player.getPrizeLeft();
        if (prizesToTake[i] > prizeLeft) {
            prizesToTake[i] = prizeLeft;
        }
        if (prizesToTake[i] > 0) {
            const allPrizeCards = new card_list_1.CardList();
            // allPrizeCards.isSecret = true;  // Set the CardList as secret
            // allPrizeCards.isPublic = false;
            // allPrizeCards.faceUpPrize = false;
            player.prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            const prompt = new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_PRIZE_CARD, allPrizeCards, {}, // No specific filter needed for prizes
            { min: prizesToTake[i], max: prizesToTake[i], isSecret: true, allowCancel: false });
            prompts.push(prompt);
        }
    }
    return prompts;
}
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
    for (let i = 0; i < state.players.length; i++) {
        const player = state.players[i];
        // Check for no active Pokemon
        if (player.active.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_ACTIVE_POKEMON, { name: player.name });
            points[i === 0 ? 1 : 0]++;
        }
        if (player.prizes.every(p => p.cards.length === 0)) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_NO_PRIZE_CARD, { name: player.name });
            points[i]++;
        }
    }
    if (points[0] + points[1] === 0) {
        if (onComplete) {
            onComplete();
            console.log('it pointed');
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
        console.log('it end gamed');
    }
    return state;
}
function handlePrompts(store, state, prompts, onComplete) {
    const prompt = prompts.shift();
    if (prompt === undefined) {
        onComplete();
        console.log('it completed');
        return state;
    }
    const player = state.players.find(p => p.id === prompt.playerId);
    if (player === undefined) {
        return state;
    }
    if (prompt instanceof choose_cards_prompt_1.ChooseCardsPrompt) {
        return store.prompt(state, prompt, (result) => {
            result.forEach(card => {
                const prizeList = player.prizes.find(p => p.cards.includes(card));
                if (prizeList) {
                    prizeList.moveTo(player.hand);
                }
            });
            handlePrompts(store, state, prompts, onComplete);
            console.log('this one');
        });
    }
    else if (prompt instanceof choose_pokemon_prompt_1.ChoosePokemonPrompt) {
        return store.prompt(state, prompt, (result) => {
            if (result.length !== 1) {
                return state;
            }
            const benchIndex = player.bench.indexOf(result[0]);
            if (benchIndex === -1 || player.active.cards.length > 0) {
                return state;
            }
            const temp = player.active;
            player.active = player.bench[benchIndex];
            player.bench[benchIndex] = temp;
            handlePrompts(store, state, prompts, onComplete);
            console.log('that one');
        });
    }
    return state;
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
        ...choosePrizeCards(state, prizesToTake),
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
                console.log('winner checked');
            }
        });
    }
    return state;
}
function checkState(store, state, onComplete) {
    if ([state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK, state_1.GamePhase.BETWEEN_TURNS].includes(state.phase) === false) {
        if (onComplete !== undefined) {
            onComplete();
            console.log('did complete idk undefined');
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
