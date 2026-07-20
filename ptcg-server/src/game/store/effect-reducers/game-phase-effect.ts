import { Effect } from '../effects/effect';
import { AfterAttackEffect, EndTurnEffect, BetweenTurnsEffect, BeginTurnEffect, DrawCardForTurnEffect, DrewTopdeckEffect } from '../effects/game-phase-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Player } from '../state/player';
import { BoardEffect, SpecialCondition } from '../card/card-types';
import { State, GamePhase, GameWinner } from '../state/state';
import { StoreLike } from '../store-like';
import { checkState, endGame } from './check-effect';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { PlayerType } from '../actions/play-card-action';
import { MarkerConstants } from '../markers/marker-constants';
import { StateUtils } from '../state-utils';
import { RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_EFFECTS } from '../prefabs/attack-effects';

function getActivePlayer(state: State): Player {
  return state.players[state.activePlayer];
}

export function betweenTurns(store: StoreLike, state: State, onComplete: () => void): State {
  if (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK) {
    state.phase = GamePhase.BETWEEN_TURNS;
  }

  for (const player of state.players) {
    store.reduceEffect(state, new BetweenTurnsEffect(player));
  }

  if (store.hasPrompts()) {
    return store.waitPrompt(state, () => {
      checkState(store, state, () => onComplete());
    });
  }
  return checkState(store, state, () => onComplete());
}

export function initNextTurn(store: StoreLike, state: State): State {
  if ([GamePhase.SETUP, GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
    return state;
  }

  let player: Player = getActivePlayer(state);

  if (state.phase === GamePhase.SETUP) {
    state.phase = GamePhase.PLAYER_TURN;
  }

  if (state.phase === GamePhase.BETWEEN_TURNS) {
    if (player.usedTurnSkip) {
      // eslint-disable-next-line no-self-assign
      state.activePlayer = state.activePlayer;
    } else {
      state.activePlayer = state.activePlayer ? 0 : 1;
    }
    state.phase = GamePhase.PLAYER_TURN;
    player = getActivePlayer(state);
  }

  state.turn++;
  store.log(state, GameLog.LOG_TURN, { turn: state.turn });

  // Clear movement tracking for the new turn
  player.movedToActiveThisTurn = [];
  player.movedFromActiveToBenchThisTurn = [];

  // Skip draw card on first turn
  if (state.turn === 1 && !state.rules.firstTurnDrawCard) {
    return state;
  }

  // Draw card at the beginning
  store.log(state, GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
  if (player.deck.cards.length === 0) {
    store.log(state, GameLog.LOG_PLAYER_NO_CARDS_IN_DECK, { name: player.name });
    const winner = state.activePlayer ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2;
    state = endGame(store, state, winner);
    return state;
  }

  // Signal beginning of turn (for cards like Slumbering Forest, Oran Berry, etc.)
  const beginTurn = new BeginTurnEffect(player);
  store.reduceEffect(state, beginTurn);

  // Draw card for turn (can be blocked by effects like Luvdisc's Heart Wink)
  try {
    const drawCardForTurn = new DrawCardForTurnEffect(player);
    store.reduceEffect(state, drawCardForTurn);
  } catch {
    return state;
  }

  player.deck.moveTo(player.hand, 1);

  // Check the drawn card
  const drawnCard = player.hand.cards[player.hand.cards.length - 1];
  try {
    const drewTopdeck = new DrewTopdeckEffect(player, drawnCard);
    store.reduceEffect(state, drewTopdeck);
  } catch {
    return state;
  }
  return state;
}

function startNextTurn(store: StoreLike, state: State): State {
  const player = state.players[state.activePlayer];
  store.log(state, GameLog.LOG_PLAYER_ENDS_TURN, { name: player.name });

  // Remove Paralyzed at the end of the turn
  player.active.removeSpecialCondition(SpecialCondition.PARALYZED);

  // Move supporter cards to discard
  player.supporter.moveTo(player.discard);

  return betweenTurns(store, state, () => {
    if (state.phase !== GamePhase.FINISHED) {
      return initNextTurn(store, state);
    }
  });
}

function handleSpecialConditions(store: StoreLike, state: State, effect: BetweenTurnsEffect) {
  const player = effect.player;
  for (const sp of player.active.specialConditions) {
    const flipsForSleep: CoinFlipPrompt[] = [];

    switch (sp) {
      case SpecialCondition.POISONED:
        player.active.damage += effect.poisonDamage;
        break;
      case SpecialCondition.BURNED:
        player.active.damage += effect.burnDamage;

        if (effect.burnFlipResult === true) {
          break;
        }
        if (effect.burnFlipResult === false) {
          player.active.damage += effect.burnDamage;
          break;
        }
        store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.FLIP_BURNED
        ), result => {
          if (result === true) {
            player.active.removeSpecialCondition(SpecialCondition.BURNED);
          }
        });
        break;
      case SpecialCondition.ASLEEP:
        if (effect.asleepFlipResult === true) {
          player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
          break;
        }
        if (effect.asleepFlipResult === false) {
          break;
        }

        for (let i = 0; i < effect.player.active.sleepFlips; i++) {
          store.log(state, GameLog.LOG_FLIP_ASLEEP, { name: player.name });
          flipsForSleep.push(new CoinFlipPrompt(
            player.id,
            GameMessage.FLIP_ASLEEP
          ));
        }

        if (flipsForSleep.length > 0) {
          store.prompt(state, flipsForSleep, results => {
            const wakesUp = Array.isArray(results) ? results.every(r => r) : results;

            if (wakesUp) {
              player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
            }
          });
        } else {
          player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
        }
        break;
    }
  }
}

export function gamePhaseReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof AfterAttackEffect) {
    effect.opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.defendingPokemonExtraDamageRearmAfterAttack) {
        cardList.defendingPokemonExtraDamageRearmAfterAttack = false;
        cardList.defendingPokemonExtraDamagePending = true;
      }
    });
  }

  if (effect instanceof EndTurnEffect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);

    state = RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_EFFECTS(store, state, effect);

    player.canEvolve = false;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      cardList.removeBoardEffect(BoardEffect.ABILITY_USED);
      if (card.damageTakenLastTurn !== undefined) {
        card.damageTakenLastTurn = 0;
      }
    });

    effect.player.marker.removeMarker(effect.player.DAMAGE_DEALT_MARKER);
    if (!player.usedTurnSkip) {
      effect.player.marker.removeMarker(MarkerConstants.REVENGE_MARKER);
    }

    // Clear damage reduction effects on opponent's Pokémon when their turn ends
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      cardList.damageReductionNextTurn = 0;
      cardList.preventDamageNextTurn = null;
      cardList.preventDamageNextTurnPending = null;
      cardList.preventEffectsOfAttacksNextTurn = false;
      cardList.preventEffectsOfAttacksNextTurnPending = false;
    });

    // Activate pending prevent-damage on this player's Pokémon
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.preventDamageNextTurnPending !== null) {
        cardList.preventDamageNextTurn = cardList.preventDamageNextTurnPending;
        cardList.preventDamageNextTurnPending = null;
      }
      if (cardList.preventEffectsOfAttacksNextTurnPending) {
        cardList.preventEffectsOfAttacksNextTurn = true;
        cardList.preventEffectsOfAttacksNextTurnPending = false;
      }
    });

    // Activate pending extra damage at end of the defending player's turn (not the attacker's).
    // The effect is armed by the attacker on the opponent's Active; it becomes active once
    // that opponent finishes their next turn, before the attacker's following turn.
    [player, opponent].forEach(p => {
      p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.defendingPokemonExtraDamagePending
          && cardList.defendingPokemonExtraDamageAttackerId !== player.id) {
          cardList.defendingPokemonExtraDamagePending = false;
        }
      });
    });

    // Clear active defending Pokemon extra damage at end of the attacking player's turn
    [player, opponent].forEach(p => {
      p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.defendingPokemonExtraDamageAttackerId === player.id
          && !cardList.defendingPokemonExtraDamagePending
          && cardList.defendingPokemonExtraDamageNextTurn > 0) {
          cardList.defendingPokemonExtraDamageNextTurn = 0;
          cardList.defendingPokemonExtraDamageAttackerId = undefined;
        }
      });
    });

    // Handle "cannot attack next turn" restrictions with two-stage cleanup
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      // First, clear active restrictions (they blocked this turn, now clear them)
      if (cardList.cannotAttackNextTurn) {
        cardList.cannotAttackNextTurn = false;
      }
      if (cardList.cannotUseAttacksNextTurn.length > 0) {
        cardList.cannotUseAttacksNextTurn = [];
      }

      // Then, activate pending restrictions (set active for next turn, clear pending)
      if (cardList.cannotAttackNextTurnPending) {
        cardList.cannotAttackNextTurn = true;
        cardList.cannotAttackNextTurnPending = false;
      }
      if (cardList.cannotUseAttacksNextTurnPending.length > 0) {
        cardList.cannotUseAttacksNextTurn = [...cardList.cannotUseAttacksNextTurnPending];
        cardList.cannotUseAttacksNextTurnPending = [];
      }

      if (cardList.cannotRetreatNextTurn) {
        cardList.cannotRetreatNextTurn = false;
      }
      if (cardList.cannotRetreatNextTurnPending) {
        cardList.cannotRetreatNextTurn = true;
        cardList.cannotRetreatNextTurnPending = false;
      }
      if (cardList.blockedAttackNameNextTurn !== undefined) {
        cardList.blockedAttackNameNextTurn = undefined;
      }
    });

    player.supporterTurn = 0;
    player.active.attacksThisTurn = 0;

    // Preserve prizes taken this turn for "last turn" tracking
    player.prizesTakenLastTurn = player.prizesTakenThisTurn;
    player.prizesTakenThisTurn = 0;

    if (player === undefined) {
      throw new GameError(GameMessage.NOT_YOUR_TURN);
    }

    state = checkState(store, state, () => {
      if (state.phase === GamePhase.FINISHED) {
        return;
      }
      return startNextTurn(store, state);
    });
    return state;
  }
  if (effect instanceof BetweenTurnsEffect) {
    handleSpecialConditions(store, state, effect);
  }
  return state;
}
