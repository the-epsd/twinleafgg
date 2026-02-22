import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Copperajah extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cufant';
  public cardType: CardType = M;
  public hp: number = 200;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Massive Body',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
  }];

  public attacks = [{
    name: 'Nasal Lariat',
    cost: [M, M, M, C],
    damage: 130,
    damageCalculation: '+',
    text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'SFA';
  public name: string = 'Copperajah';
  public fullName: string = 'Copperajah SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';

  public readonly OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = 'OPPONENT_CANNOT_PLAY_STADIUMS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (opponent.active.getPokemonCard() == this) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          effect.damage += 100;
          player.active.cannotAttackNextTurnPending = true;
        }
      });
    }

    return state;
  }
}
