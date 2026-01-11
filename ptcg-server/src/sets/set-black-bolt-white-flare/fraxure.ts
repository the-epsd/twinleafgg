import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Axew';
  public cardType = N;
  public hp: number = 100;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 30,
      text: ''
    },
    {
      name: 'Boundless Power',
      cost: [F, M],
      damage: 90,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'BLK';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Boundless Power
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    return state;
  }
} 