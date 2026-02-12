import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Litwick extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Singe',
      cost: [R],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
    },
    {
      name: 'Live Coal',
      cost: [R, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Litwick';
  public fullName: string = 'Litwick PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
      });
    }

    return state;
  }
}
