import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Charmeleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charmander';
  public cardType = R;
  public hp = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Fire Fang',
      cost: [R, R],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }
    return state;
  }
}