import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Abomasnow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snover';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Razor Leaf',
      cost: [G, G],
      damage: 40,
      text: ''
    },
    {
      name: 'Bang Heads',
      cost: [G, G, C],
      damage: 80,
      text: 'Both this Pokémon and the Defending Pokémon are now Confused.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Abomasnow';
  public fullName: string = 'Abomasnow PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    return state;
  }
}
