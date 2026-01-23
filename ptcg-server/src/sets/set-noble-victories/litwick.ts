import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Litwick extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Searing Flame',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Burned.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Litwick';
  public fullName: string = 'Litwick NVI';

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
