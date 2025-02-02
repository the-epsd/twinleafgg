import { Action } from '../actions/action';
import { PassTurnAction, RetreatAction, AttackAction, UseAbilityAction, UseStadiumAction, UseTrainerAbilityAction } from '../actions/game-actions';
import { State, GamePhase } from '../state/state';
import { StoreLike } from '../store-like';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { RetreatEffect, UseAttackEffect, UsePowerEffect, UseStadiumEffect, UseTrainerPowerEffect } from '../effects/game-effects';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { StateUtils } from '../state-utils';
import { SlotType } from '../actions/play-card-action';
import { PokemonCard } from '../card/pokemon-card';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from '../effects/check-effects';
import { Attack } from '../card/pokemon-types';
import { TrainerCard } from '../card/trainer-card';

export function playerTurnReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.PLAYER_TURN) {

    if (action instanceof PassTurnAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const endTurnEffect = new EndTurnEffect(player);

      state = store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (action instanceof RetreatAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const retreatEffect = new RetreatEffect(player, action.benchIndex);
      state = store.reduceEffect(state, retreatEffect);
      player.active.clearEffects();
      return state;
    }

    if (action instanceof AttackAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const pokemonCard = player.active.getPokemonCard();
      let attacks: Attack[] = [];

      if (pokemonCard) {
        attacks = [...pokemonCard.attacks];
      }

      // Add bench attacks
      player.bench.forEach(benchSlot => {
        const benchPokemon = benchSlot.getPokemonCard();
        if (benchPokemon && benchPokemon.name === 'Alakazam ex') {
          attacks.push(...benchPokemon.attacks); // Add all attacks
          const attackEffect = new CheckPokemonAttacksEffect(player); // Pass the bench slot
          state = store.reduceEffect(state, attackEffect);
          attacks = [...attacks, ...attackEffect.attacks];
        }
      });

      const attackEffect = new CheckPokemonAttacksEffect(player);
      state = store.reduceEffect(state, attackEffect);

      attacks = [...attacks, ...attackEffect.attacks];

      const attack = attacks.find(a => a.name === action.name);

      if (attack === undefined) {
        throw new GameError(GameMessage.UNKNOWN_ATTACK);
      }

      const useAttackEffect = new UseAttackEffect(player, attack);
      state = store.reduceEffect(state, useAttackEffect);

      state.lastAttack = attack;

      if (!state.playerLastAttack) {
        state.playerLastAttack = {};
      }
      state.playerLastAttack[player.id] = attack;

      return state;
    }

    if (action instanceof UseAbilityAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      let pokemonCard: PokemonCard | undefined;

      switch (action.target.slot) {
        case SlotType.ACTIVE:
        case SlotType.BENCH: {
          const target = StateUtils.getTarget(state, player, action.target);
          pokemonCard = target.getPokemonCard();
          break;
        }
        case SlotType.DISCARD: {
          const discardCard = player.discard.cards[action.target.index];
          if (discardCard instanceof PokemonCard) {
            pokemonCard = discardCard;
          }
          break;
        }
        case SlotType.HAND: {
          const handCard = player.hand.cards[action.target.index];
          if (handCard instanceof PokemonCard) {
            pokemonCard = handCard;
          }
          break;
        }
      }

      if (pokemonCard !== undefined) {
        //throw new GameError(GameMessage.INVALID_TARGET);
        let power;
        if (action.target.slot === SlotType.ACTIVE || action.target.slot === SlotType.BENCH) {
          const target = StateUtils.getTarget(state, player, action.target);

          const powersEffect = new CheckPokemonPowersEffect(player, target);
          state = store.reduceEffect(state, powersEffect);

          power = [...pokemonCard.powers, ...powersEffect.powers].find(a => a.name === action.name);
        } else {
          power = pokemonCard.powers.find(a => a.name === action.name);
        }

        if (power === undefined) {
          throw new GameError(GameMessage.UNKNOWN_POWER);
        }

        const slot = action.target.slot;
        if (slot === SlotType.ACTIVE || slot === SlotType.BENCH) {
          if (!power.useWhenInPlay) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
        }

        if (slot === SlotType.HAND && !power.useFromHand) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        if (slot === SlotType.DISCARD && !power.useFromDiscard) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        state = store.reduceEffect(state, new UsePowerEffect(player, power, pokemonCard, action.target));
        return state;
      }
    }

    if (action instanceof UseTrainerAbilityAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      let trainerCard: TrainerCard | undefined;

      const discardCard = player.discard.cards[action.target.index];
      if (discardCard instanceof TrainerCard) {
        trainerCard = discardCard;

        if (trainerCard !== undefined) {
          let power;
          if (action.target.slot === SlotType.DISCARD) {
            power = trainerCard.powers.find(a => a.name === action.name);
          }

          if (power === undefined) {
            throw new GameError(GameMessage.UNKNOWN_POWER);
          }

          const slot = action.target.slot;

          if (slot === SlotType.DISCARD && !power.useFromDiscard) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          state = store.reduceEffect(state, new UseTrainerPowerEffect(player, power, trainerCard, action.target));
          return state;
        }
      }
    }


    if (action instanceof UseStadiumAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      if (player.stadiumUsedTurn === state.turn) {
        throw new GameError(GameMessage.STADIUM_ALREADY_USED);
      }

      const stadium = StateUtils.getStadiumCard(state);
      if (stadium === undefined) {
        throw new GameError(GameMessage.NO_STADIUM_IN_PLAY);
      }

      state = store.reduceEffect(state, new UseStadiumEffect(player, stadium));
      return state;
    }

  }

  return state;
}