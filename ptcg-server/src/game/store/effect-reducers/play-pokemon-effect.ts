import { PlayPokemonEffect } from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { BoardEffect, SpecialCondition, Stage } from '../card/card-types';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CheckPokemonPlayedTurnEffect } from '../effects/check-effects';
import { EvolveEffect } from '../effects/game-effects';


export function playPokemonReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play pokemon card */
  if (effect instanceof PlayPokemonEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;

    if (isBasic && effect.target.cards.length === 0) {
      store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
        name: effect.player.name,
        card: effect.pokemonCard.name
      });
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;
      effect.target.removeSpecialCondition(SpecialCondition.ABILITY_USED);
      // Emit websocket event for basic entrance animation
      const game = (store as any).handler;
      if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c: any) => {
          if (typeof c.socket !== 'undefined') {
            c.socket.emit(`game[${game.id}]:basicEntrance`, {
              playerId: effect.player.id,
              cardId: effect.pokemonCard.id,
              slot: effect.slot,
              index: effect.index
            });
          }
        });
      }
      return state;
    }
    const player = effect.player;
    const isEvolved = stage === Stage.STAGE_1 || Stage.STAGE_2;
    const evolvesFrom = effect.pokemonCard.evolvesFrom;
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    // Check if evolution is valid using either evolvesFrom or evolvesTo
    const isValidEvolution = (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) ||
      (isEvolved && pokemonCard.evolvesTo.includes(effect.pokemonCard.name)) ||
      (isEvolved && pokemonCard.evolvesToStage.includes(effect.pokemonCard.stage));

    if (isValidEvolution) {
      const playedTurnEffect = new CheckPokemonPlayedTurnEffect(effect.player, effect.target);
      store.reduceEffect(state, playedTurnEffect);

      if (state.turn == 0 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }

      if (state.turn == 1 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }
      if (state.turn == 2 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }

      if (playedTurnEffect.pokemonPlayedTurn >= state.turn) {
        throw new GameError(GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN);
      }

      const evolveEffect = new EvolveEffect(effect.player, effect.target, effect.pokemonCard);
      store.reduceEffect(state, evolveEffect);
      effect.pokemonCard.marker.markers = [];
      effect.player.removePokemonEffects(effect.target);
      effect.target.specialConditions = [];
      effect.target.marker.markers = [];
      effect.target.showBasicAnimation = false;

      if (effect.target.specialConditions.includes(SpecialCondition.ABILITY_USED)) {
        effect.target.removeSpecialCondition(SpecialCondition.ABILITY_USED);
      }
      if (effect.target.boardEffect.includes(BoardEffect.ABILITY_USED)) {
        effect.target.removeBoardEffect(BoardEffect.ABILITY_USED);
      }
      // Emit websocket event for evolution animation
      const game = (store as any).handler;
      if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c: any) => {
          if (typeof c.socket !== 'undefined') {
            c.socket.emit(`game[${game.id}]:evolution`, {
              playerId: effect.player.id,
              cardId: effect.pokemonCard.id,
              slot: effect.slot,
              index: effect.index
            });
          }
        });
      }
      return state;
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

  return state;
}
