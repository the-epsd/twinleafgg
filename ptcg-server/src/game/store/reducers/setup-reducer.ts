import { Action } from '../actions/action';
import { AddPlayerAction } from '../actions/add-player-action';
import { AlertPrompt } from '../prompts/alert-prompt';
import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { DeckAnalyser } from '../../cards/deck-analyser';
import { InvitePlayerAction } from '../actions/invite-player-action';
import { InvitePlayerPrompt } from '../prompts/invite-player-prompt';
import { Player } from '../state/player';
import { ShowCardsPrompt } from '../prompts/show-cards-prompt';
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

function putStartingPokemonsAndPrizes(player: Player, cards: Card[], state: State): void {
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

export function* setupGame(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  const player = state.players[0];
  const opponent = state.players[1];
  const basicPokemon = { superType: SuperType.POKEMON, stage: Stage.BASIC };
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };

  const whoBeginsEffect = new WhoBeginsEffect();
  store.reduceEffect(state, whoBeginsEffect);

  if (whoBeginsEffect.player) {
    state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
  } else {
    const coinFlipPrompt = new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP);
    yield store.prompt(state, coinFlipPrompt, whoBegins => {
      const goFirstPrompt = new SelectPrompt(
        whoBegins ? player.id : opponent.id,
        GameMessage.GO_FIRST,
        [GameMessage.YES, GameMessage.NO]
      );
      store.prompt(state, goFirstPrompt, choice => {
        if (choice === 0) {
          state.activePlayer = whoBegins ? 0 : 1;
        } else {
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
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 7);
        playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
        next();
      });
    }

    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 7);
        opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some(c => c.tags.includes(CardTag.PLAY_DURING_SETUP));
        next();
      });
    }

    if (playerHasBasic && !opponentHasBasic) {
      store.log(state, GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: opponent.name });
      yield store.prompt(state, [
        new ShowCardsPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC,
          opponent.hand.cards, { allowCancel: false }),
        new AlertPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        playerCardsToDraw++;
        next();
      });
    }
    if (!playerHasBasic && opponentHasBasic) {
      store.log(state, GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: player.name });
      yield store.prompt(state, [
        new ShowCardsPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC,
          player.hand.cards, { allowCancel: false }),
        new AlertPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        opponentCardsToDraw++;
        next();
      });
    }
  }

  const blocked: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (c.tags.includes((CardTag.PLAY_DURING_SETUP)) || (c instanceof PokemonCard && c.stage === Stage.BASIC)) {

    } else {
      blocked.push(index);
    }
  });

  const blockedOpponent: number[] = [];
  opponent.hand.cards.forEach((c, index) => {
    if (c.tags.includes((CardTag.PLAY_DURING_SETUP)) || (c instanceof PokemonCard && c.stage === Stage.BASIC)) {

    } else {
      blockedOpponent.push(index);
    }
  });

  yield store.prompt(state, [
    new ChooseCardsPrompt(player, GameMessage.CHOOSE_STARTING_POKEMONS,
      player.hand, {}, { ...chooseCardsOptions, blocked }),
    new ChooseCardsPrompt(opponent, GameMessage.CHOOSE_STARTING_POKEMONS,
      opponent.hand, {}, { ...chooseCardsOptions, blocked: blockedOpponent })
  ], choice => {
    putStartingPokemonsAndPrizes(player, choice[0], state);
    putStartingPokemonsAndPrizes(opponent, choice[1], state);
    next();
  });

  // Set initial Pokemon Played Turn, so players can't evolve during first turn
  const first = state.players[state.activePlayer];
  const second = state.players[state.activePlayer ? 0 : 1];
  first.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => { cardList.pokemonPlayedTurn = 1; });
  second.forEachPokemon(PlayerType.TOP_PLAYER, cardList => { cardList.pokemonPlayedTurn = 2; });

  if (playerCardsToDraw > 0) {

    const options: { message: string, value: number }[] = [];
    for (let i = playerCardsToDraw; i >= 0; i--) {
      options.push({ message: `Draw ${i} card(s)`, value: i });
    }

    return store.prompt(state, new SelectPrompt(
      player.id,
      GameMessage.WANT_TO_DRAW_CARDS,
      options.map(c => c.message),
      { allowCancel: false }
    ), choice => {
      const option = options[choice];
      const numCardsToDraw = option.value;

      player.deck.moveTo(player.hand, numCardsToDraw);
      return initNextTurn(store, state);
    });
  }

  if (opponentCardsToDraw > 0) {
    const options: { message: string, value: number }[] = [];
    for (let i = opponentCardsToDraw; i >= 0; i--) {
      options.push({ message: `Draw ${i} card(s)`, value: i });
    }

    return store.prompt(state, new SelectPrompt(
      opponent.id,
      GameMessage.WANT_TO_DRAW_CARDS,
      options.map(c => c.message),
      { allowCancel: false }
    ), choice => {
      const option = options[choice];
      const numCardsToDraw = option.value;

      opponent.deck.moveTo(opponent.hand, numCardsToDraw);
      return initNextTurn(store, state);
    });
  }
  return initNextTurn(store, state);
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
        throw new GameError(GameMessage.INVALID_DECK);
      }

      const player = createPlayer(action.clientId, action.name);
      player.deck = CardList.fromList(action.deck);
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
          throw new GameError(GameMessage.INVALID_DECK);
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
