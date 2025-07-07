import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [C, C],
    damage: 20,
    text: '',
  },
  {
    name: 'Super Hypno Wave',
    cost: [W, C, C],
    damage: 30,
    text: 'The Defending Pokémon is now Asleep.',
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer SS';

  public usedSuperHypnoWave = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSuperHypnoWave = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSuperHypnoWave === true) {
      this.usedSuperHypnoWave = false;
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}