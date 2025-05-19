import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Goomy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 50;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rain Splash',
      cost: [W],
      damage: 10,
      text: ''
    },
    {
      name: 'Flail',
      cost: [C, C],
      damage: 10,
      damageCalculation: 'x',
      text: 'This attack does 10 damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'FLI';
  public name: string = 'Goomy';
  public fullName: string = 'Goomy FLI 92';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Flail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = effect.source.damage;
    }

    return state;
  }
}