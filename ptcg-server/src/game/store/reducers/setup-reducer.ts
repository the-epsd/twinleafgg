import { Action } from '../actions/action';
import { AddPlayerAction } from '../actions/add-player-action';
import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { DeckAnalyser } from '../../cards/deck-analyser';
import { InvitePlayerAction } from '../actions/invite-player-action';
import { InvitePlayerPrompt } from '../prompts/invite-player-prompt';
import { Player } from '../state/player';
import { ShuffleDeckPrompt } from '../prompts/shuffle-prompt';
import { State, GamePhase, GameWinner } from '../state/state';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { PlayerType } from '../actions/play-card-action';
import { PokemonCardList } from '../state/pokemon-card-list';
import { StoreLike } from '../store-like';
import { SuperType, Stage, CardTag } from '../card/card-types';
import { endGame } from '../effect-reducers/check-effect';
import { initNextTurn } from '../effect-reducers/game-phase-effect';
import { SelectPrompt } from '../prompts/select-prompt';
import { WhoBeginsEffect } from '../effects/game-phase-effects';
import { PokemonCard } from '../card/pokemon-card';
import { ShowMulliganPrompt } from '../prompts/show-mulligan-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { Format } from '../card/card-types';

function putStartingPokemonsAndPrizes(player: Player, cards: Card[], state: State): void {
  if (cards.length === 0) {
    return;
  }
  // Place Active (face-down)
  player.hand.moveCardTo(cards[0], player.active);
  player.active.isSecret = true;
  // Place Bench (face-down)
  for (let i = 1; i < cards.length; i++) {
    player.hand.moveCardTo(cards[i], player.bench[i - 1]);
    player.bench[i - 1].isSecret = true;
  }
  // Always place 6 prize cards
  for (let i = 0; i < 6; i++) {
    player.deck.moveTo(player.prizes[i], 1);
  }
}

// Helper: Alternative setup where players start with 13 cards and choose 6 as prizes
function* alternativeSetupGame(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  const player = state.players[0];
  const opponent = state.players[1];
  const basicPokemon = { superType: SuperType.POKEMON, stage: Stage.BASIC };
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };

  // 1. Decide who goes first
  const whoBeginsEffect = new WhoBeginsEffect();
  store.reduceEffect(state, whoBeginsEffect);
  if (whoBeginsEffect.player) {
    state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
  } else {
    const coinFlipPrompt = new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP);
    yield store.prompt(state, coinFlipPrompt, whoBegins => {
      if (state.gameSettings?.format === Format.RSPK || state.gameSettings?.format === Format.RETRO) {
        // In Retro & RSPK, coin flip winner MUST go first
        state.activePlayer = whoBegins ? 0 : 1;
        next();
      } else {
        // Other formats: winner chooses
        const goFirstPrompt = new ConfirmPrompt(
          whoBegins ? player.id : opponent.id,
          GameMessage.GO_FIRST
        );
        store.prompt(state, goFirstPrompt, choice => {
          if (choice === true) {
            state.activePlayer = whoBegins ? 0 : 1;
          } else {
            state.activePlayer = whoBegins ? 1 : 0;
          }
          next();
        });
      }
    });
  }

  // 2. Both players draw 13 cards (instead of 7)
  // Prompt both players to shuffle their decks before drawing
  yield store.prompt(state, [
    new ShuffleDeckPrompt(player.id),
    new ShuffleDeckPrompt(opponent.id)
  ], orders => {
    player.deck.applyOrder(orders[0]);
    opponent.deck.applyOrder(orders[1]);
    player.deck.moveTo(player.hand, 13);
    opponent.deck.moveTo(opponent.hand, 13);
    next();
  });

  // 3. Mulligan logic
  let playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
  let opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));

  // Track mulligan hands for each player
  const playerMulliganHands: Card[][] = [];
  const opponentMulliganHands: Card[][] = [];
  let playerMulligans = 0;
  let opponentMulligans = 0;

  // 4. Repeat until at least one player has a Basic
  while (!playerHasBasic && !opponentHasBasic) {
    playerMulliganHands.push([...player.hand.cards]);
    opponentMulliganHands.push([...opponent.hand.cards]);
    playerMulligans++;
    opponentMulligans++;
    player.hand.moveTo(player.deck);
    opponent.hand.moveTo(opponent.deck);
    yield store.prompt(state, [
      new ShuffleDeckPrompt(player.id),
      new ShuffleDeckPrompt(opponent.id)
    ], orders => {
      player.deck.applyOrder(orders[0]);
      opponent.deck.applyOrder(orders[1]);
      player.deck.moveTo(player.hand, 13);
      opponent.deck.moveTo(opponent.hand, 13);
      next();
    });
    playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
  }

  // 5. If only one player has a Basic, that player sets up, the other continues to mulligan
  if (playerHasBasic && !opponentHasBasic) {
    // Player sets up
    yield* alternativeSetupSinglePlayer(player, chooseCardsOptions, state, store, next);
    // Opponent continues to mulligan until they have a Basic
    while (!opponentHasBasic) {
      opponentMulliganHands.push([...opponent.hand.cards]);
      opponentMulligans++;
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 13);
        next();
      });
      opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    }
    // Opponent sets up
    yield* alternativeSetupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
    // Player is shown all opponent's mulligan hands
    if (opponentMulligans > 0) {
      yield store.prompt(state, new ShowMulliganPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC, opponentMulliganHands, { allowCancel: false }), () => next());
      yield store.prompt(state, new ShowMulliganPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC, opponentMulliganHands, { allowCancel: false }), () => next());
    }
    // Player chooses how many cards to draw
    if (opponentMulligans > 0) {
      const options: { message: string, value: number }[] = [];
      for (let i = opponentMulligans; i >= 0; i--) {
        options.push({ message: `Draw ${i} card(s)`, value: i });
      }
      yield store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.WANT_TO_DRAW_CARDS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const numCardsToDraw = options[choice].value;
        player.deck.moveTo(player.hand, numCardsToDraw);
        next();
      });
      // After drawing, allow player to place any new Basics onto their Bench
      yield* allowExtraBenchPlacement(player, chooseCardsOptions, state, store, next);
    }
  } else if (!playerHasBasic && opponentHasBasic) {
    // Opponent sets up
    yield* alternativeSetupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
    // Player continues to mulligan until they have a Basic
    while (!playerHasBasic) {
      playerMulliganHands.push([...player.hand.cards]);
      playerMulligans++;
      player.hand.moveTo(player.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 13);
        next();
      });
      playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    }
    // Player sets up
    yield* alternativeSetupSinglePlayer(player, chooseCardsOptions, state, store, next);
    // Opponent is shown all player's mulligan hands
    if (playerMulligans > 0) {
      yield store.prompt(state, new ShowMulliganPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC, playerMulliganHands, { allowCancel: false }), () => next());
      yield store.prompt(state, new ShowMulliganPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC, playerMulliganHands, { allowCancel: false }), () => next());
    }
    // Opponent chooses how many cards to draw
    if (playerMulligans > 0) {
      const options: { message: string, value: number }[] = [];
      for (let i = playerMulligans; i >= 0; i--) {
        options.push({ message: `Draw ${i} card(s)`, value: i });
      }
      yield store.prompt(state, new SelectPrompt(
        opponent.id,
        GameMessage.WANT_TO_DRAW_CARDS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const numCardsToDraw = options[choice].value;
        opponent.deck.moveTo(opponent.hand, numCardsToDraw);
        next();
      });
      // After drawing, allow opponent to place any new Basics onto their Bench
      yield* allowExtraBenchPlacement(opponent, chooseCardsOptions, state, store, next);
    }
  } else {
    // Both have Basics, proceed with normal setup for both
    yield* alternativeSetupSinglePlayer(player, chooseCardsOptions, state, store, next);
    yield* alternativeSetupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
  }

  // Set initial Pokemon Played Turn, so players can't evolve during first turn
  const first = state.players[state.activePlayer];
  const second = state.players[state.activePlayer ? 0 : 1];
  first.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => { cardList.pokemonPlayedTurn = 1; });
  second.forEachPokemon(PlayerType.TOP_PLAYER, cardList => { cardList.pokemonPlayedTurn = 2; });

  // Reveal all Active and Bench Pokémon (flip face-up) for both players
  for (const p of state.players) {
    p.active.isSecret = false;
    p.bench.forEach(list => { list.isSecret = false; });
  }

  return initNextTurn(store, state);
}

// Helper: Alternative setup for a single player (choose Active, Bench, choose Prizes from hand)
function* alternativeSetupSinglePlayer(player: Player, chooseCardsOptions: any, state: State, store: StoreLike, next: Function) {
  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (!(c.tags.includes((CardTag.PLAY_DURING_SETUP)) || (c instanceof PokemonCard && c.stage === Stage.BASIC))) {
      blocked.push(index);
    }
  });

  // First, choose starting Pokémon (Active + Bench)
  yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_STARTING_POKEMONS,
    player.hand, {}, { ...chooseCardsOptions, blocked }), choice => {
      // Place the chosen cards as Active and Bench
      if (choice.length > 0) {
        // Place Active (face-down)
        player.hand.moveCardTo(choice[0], player.active);
        player.active.isSecret = true;
        // Place Bench (face-down)
        for (let i = 1; i < choice.length; i++) {
          player.hand.moveCardTo(choice[i], player.bench[i - 1]);
          player.bench[i - 1].isSecret = true;
        }
      }
      next();
    });

  // Then, choose 6 cards from remaining hand to be prize cards
  // We need to create a temporary hand with only the remaining cards for selection
  const remainingCards = player.hand.cards.filter(c =>
    !player.active.cards.includes(c) &&
    !player.bench.some(b => b.cards.includes(c))
  );

  if (remainingCards.length >= 6) {
    // Create a temporary hand for prize selection
    const tempHand = new CardList();
    tempHand.cards = [...remainingCards];

    yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_PRIZES_SETUP,
      tempHand, {}, { min: 6, max: 6, allowCancel: false, blocked: [] }), choice => {
        // Place chosen cards as prizes
        for (let i = 0; i < 6; i++) {
          if (choice[i]) {
            // Find the card in the actual hand and move it to prizes
            const cardToMove = choice[i];
            const handIndex = player.hand.cards.indexOf(cardToMove);
            if (handIndex !== -1) {
              player.hand.moveCardTo(cardToMove, player.prizes[i]);
              player.prizes[i].isSecret = true;
            }
          }
        }
        next();
      });
  } else {
    // If not enough cards, place all remaining cards as prizes
    for (let i = 0; i < Math.min(remainingCards.length, 6); i++) {
      player.hand.moveCardTo(remainingCards[i], player.prizes[i]);
      player.prizes[i].isSecret = true;
    }
  }
}

export function* setupGame(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  // Check if alternative setup rule is enabled
  if (state.rules.alternativeSetup) {
    return yield* alternativeSetupGame(next, store, state);
  }

  const player = state.players[0];
  const opponent = state.players[1];
  const basicPokemon = { superType: SuperType.POKEMON, stage: Stage.BASIC };
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };

  // 1. Decide who goes first
  const whoBeginsEffect = new WhoBeginsEffect();
  store.reduceEffect(state, whoBeginsEffect);
  if (whoBeginsEffect.player) {
    state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
  } else {
    const coinFlipPrompt = new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP);
    yield store.prompt(state, coinFlipPrompt, whoBegins => {
      if (state.gameSettings?.format === Format.RSPK || state.gameSettings?.format === Format.RETRO) {
        // In Retro & RSPK, coin flip winner MUST go first
        state.activePlayer = whoBegins ? 0 : 1;
        next();
      } else {
        // Other formats: winner chooses
        const goFirstPrompt = new ConfirmPrompt(
          whoBegins ? player.id : opponent.id,
          GameMessage.GO_FIRST
        );
        store.prompt(state, goFirstPrompt, choice => {
          if (choice === true) {
            state.activePlayer = whoBegins ? 0 : 1;
          } else {
            state.activePlayer = whoBegins ? 1 : 0;
          }
          next();
        });
      }
    });
  }

  // 2. Both players draw 7 cards
  // Prompt both players to shuffle their decks before drawing
  yield store.prompt(state, [
    new ShuffleDeckPrompt(player.id),
    new ShuffleDeckPrompt(opponent.id)
  ], orders => {
    player.deck.applyOrder(orders[0]);
    opponent.deck.applyOrder(orders[1]);
    player.deck.moveTo(player.hand, 7);
    opponent.deck.moveTo(opponent.hand, 7);
    next();
  });

  // 3. Mulligan logic
  let playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
  let opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));

  // Track mulligan hands for each player
  const playerMulliganHands: Card[][] = [];
  const opponentMulliganHands: Card[][] = [];
  let playerMulligans = 0;
  let opponentMulligans = 0;

  // 4. Repeat until at least one player has a Basic
  while (!playerHasBasic && !opponentHasBasic) {
    playerMulliganHands.push([...player.hand.cards]);
    opponentMulliganHands.push([...opponent.hand.cards]);
    playerMulligans++;
    opponentMulligans++;
    player.hand.moveTo(player.deck);
    opponent.hand.moveTo(opponent.deck);
    yield store.prompt(state, [
      new ShuffleDeckPrompt(player.id),
      new ShuffleDeckPrompt(opponent.id)
    ], orders => {
      player.deck.applyOrder(orders[0]);
      opponent.deck.applyOrder(orders[1]);
      player.deck.moveTo(player.hand, 7);
      opponent.deck.moveTo(opponent.hand, 7);
      next();
    });
    playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
  }

  // 5. If only one player has a Basic, that player sets up, the other continues to mulligan
  if (playerHasBasic && !opponentHasBasic) {
    // Player sets up
    yield* setupSinglePlayer(player, chooseCardsOptions, state, store, next);
    // Opponent continues to mulligan until they have a Basic
    while (!opponentHasBasic) {
      opponentMulliganHands.push([...opponent.hand.cards]);
      opponentMulligans++;
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 7);
        next();
      });
      opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    }
    // Opponent sets up
    yield* setupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
    // Player is shown all opponent's mulligan hands (placeholder prompt)
    if (opponentMulligans > 0) {
      yield store.prompt(state, new ShowMulliganPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC, opponentMulliganHands, { allowCancel: false }), () => next());
      yield store.prompt(state, new ShowMulliganPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC, opponentMulliganHands, { allowCancel: false }), () => next());
    }
    // Player chooses how many cards to draw
    if (opponentMulligans > 0) {
      const options: { message: string, value: number }[] = [];
      for (let i = opponentMulligans; i >= 0; i--) {
        options.push({ message: `Draw ${i} card(s)`, value: i });
      }
      yield store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.WANT_TO_DRAW_CARDS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const numCardsToDraw = options[choice].value;
        player.deck.moveTo(player.hand, numCardsToDraw);
        next();
      });
      // After drawing, allow player to place any new Basics onto their Bench
      yield* allowExtraBenchPlacement(player, chooseCardsOptions, state, store, next);
    }
  } else if (!playerHasBasic && opponentHasBasic) {
    // Opponent sets up
    yield* setupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
    // Player continues to mulligan until they have a Basic
    while (!playerHasBasic) {
      playerMulliganHands.push([...player.hand.cards]);
      playerMulligans++;
      player.hand.moveTo(player.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 7);
        next();
      });
      playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
    }
    // Player sets up
    yield* setupSinglePlayer(player, chooseCardsOptions, state, store, next);
    // Opponent is shown all player's mulligan hands (placeholder prompt)
    if (playerMulligans > 0) {
      yield store.prompt(state, new ShowMulliganPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC, playerMulliganHands, { allowCancel: false }), () => next());
      yield store.prompt(state, new ShowMulliganPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC, playerMulliganHands, { allowCancel: false }), () => next());
    }
    // Opponent chooses how many cards to draw
    if (playerMulligans > 0) {
      const options: { message: string, value: number }[] = [];
      for (let i = playerMulligans; i >= 0; i--) {
        options.push({ message: `Draw ${i} card(s)`, value: i });
      }
      yield store.prompt(state, new SelectPrompt(
        opponent.id,
        GameMessage.WANT_TO_DRAW_CARDS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const numCardsToDraw = options[choice].value;
        opponent.deck.moveTo(opponent.hand, numCardsToDraw);
        next();
      });
      // After drawing, allow opponent to place any new Basics onto their Bench
      yield* allowExtraBenchPlacement(opponent, chooseCardsOptions, state, store, next);
    }
  } else {
    // Both have Basics, proceed with normal setup for both
    yield* setupSinglePlayer(player, chooseCardsOptions, state, store, next);
    yield* setupSinglePlayer(opponent, chooseCardsOptions, state, store, next);
  }

  // Set initial Pokemon Played Turn, so players can't evolve during first turn
  const first = state.players[state.activePlayer];
  const second = state.players[state.activePlayer ? 0 : 1];
  first.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => { cardList.pokemonPlayedTurn = 1; });
  second.forEachPokemon(PlayerType.TOP_PLAYER, cardList => { cardList.pokemonPlayedTurn = 2; });

  // Reveal all Active and Bench Pokémon (flip face-up) for both players
  for (const p of state.players) {
    p.active.isSecret = false;
    p.bench.forEach(list => { list.isSecret = false; });
  }

  return initNextTurn(store, state);
}

// Helper: Setup for a single player (choose Active, Bench, place Prizes)
function* setupSinglePlayer(player: Player, chooseCardsOptions: any, state: State, store: StoreLike, next: Function) {
  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (!(c.tags.includes((CardTag.PLAY_DURING_SETUP)) || (c instanceof PokemonCard && c.stage === Stage.BASIC))) {
      blocked.push(index);
    }
  });
  yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_STARTING_POKEMONS,
    player.hand, {}, { ...chooseCardsOptions, blocked }), choice => {
      putStartingPokemonsAndPrizes(player, choice, state);
      next();
    });
}

// Helper: Allow extra Bench placement after drawing extra cards
function* allowExtraBenchPlacement(player: Player, chooseCardsOptions: any, state: State, store: StoreLike, next: Function) {
  // Find new Basics in hand that are not already in play
  const inPlayIds = new Set<number>();
  player.bench.forEach(list => list.cards.forEach(c => inPlayIds.add(c.id)));
  player.active.cards.forEach(c => inPlayIds.add(c.id));
  const newBasics = player.hand.cards
    .map((c, idx) => ({ c, idx }))
    .filter(({ c }) => (c.tags.includes(CardTag.PLAY_DURING_SETUP) || (c instanceof PokemonCard && c.stage === Stage.BASIC)) && !inPlayIds.has(c.id));
  if (newBasics.length > 0) {
    const blocked = player.hand.cards.map((c, idx) => newBasics.some(nb => nb.idx === idx) ? -1 : idx).filter(idx => idx !== -1);
    // Use CHOOSE_STARTING_POKEMONS as fallback prompt message
    yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_STARTING_POKEMONS,
      player.hand, {}, { min: 0, max: newBasics.length, allowCancel: false, blocked }), choice => {
        // Place any chosen new Basics onto the Bench
        for (const card of choice) {
          const emptyBench = player.bench.find(b => b.cards.length === 0);
          if (emptyBench) {
            player.hand.moveCardTo(card, emptyBench);
          }
        }
        next();
      });
  }
}

function createPlayer(id: number, name: string): Player {
  const player = new Player();
  player.id = id;
  player.name = name;

  // Empty prizes, places for 6 cards
  for (let i = 0; i < 6; i++) {
    const prize = new CardList();
    prize.isSecret = true;
    player.prizes.push(prize);
  }

  // Empty bench, places for 5 pokemons
  for (let i = 0; i < 5; i++) {
    const bench = new PokemonCardList();
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

export function setupPhaseReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {

    if (action instanceof AddPlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }

      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }

      const deckAnalyser = new DeckAnalyser(action.deck);
      if (!deckAnalyser.isValid()) {
        // Safe exit for invalid deck: finish game before it starts
        store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
        state.phase = GamePhase.FINISHED;
        state.winner = GameWinner.NONE;
        return state;
      }

      const player = createPlayer(action.clientId, action.name);
      player.deck = CardList.fromList(action.deck);
      // Attach alternate artwork map to player's lists so clients can resolve images
      if (action.artworksMap) {
        const lists: any[] = [
          player.deck,
          player.hand,
          player.discard,
          player.lostzone,
          player.stadium,
          player.supporter,
          player.active,
          ...player.bench,
          ...player.prizes
        ];
        lists.forEach(list => { (list as any).artworksMap = action.artworksMap; });
        // Also store on player for robustness
        (player as any).artworksMap = action.artworksMap;
      }
      player.deck.isSecret = true;
      player.deck.cards.forEach(c => {
        state.cardNames.push(c.fullName);
        c.id = state.cardNames.length - 1;
      });

      state.players.push(player);

      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        const generator = setupGame(() => generator.next(), store, state);
        return generator.next().value;
      }

      return state;
    }

    if (action instanceof InvitePlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }

      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }

      const player = createPlayer(action.clientId, action.name);
      state.players.push(player);

      state = store.prompt(state, new InvitePlayerPrompt(
        player.id,
        GameMessage.INVITATION_MESSAGE
      ), deck => {
        if (deck === null) {
          store.log(state, GameLog.LOG_INVITATION_NOT_ACCEPTED, { name: player.name });
          const winner = GameWinner.NONE;
          state = endGame(store, state, winner);
          return;
        }
        const deckAnalyser = new DeckAnalyser(deck);
        if (!deckAnalyser.isValid()) {
          // Safe exit for invalid deck (invited player): end game with no winner
          store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
          const winner = GameWinner.NONE;
          state = endGame(store, state, winner);
          return;
        }

        player.deck = CardList.fromList(deck);
        player.deck.isSecret = true;
        player.deck.cards.forEach(c => {
          state.cardNames.push(c.fullName);
          c.id = state.cardNames.length - 1;
        });

        if (state.players.length === 2) {
          state.phase = GamePhase.SETUP;
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
