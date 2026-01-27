import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Patrat2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Hypnosis',
      cost: [C, C],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Asleep.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Patrat';
  public fullName: string = 'Patrat BLW 78';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
      });
    }
    return state;
  }
}
