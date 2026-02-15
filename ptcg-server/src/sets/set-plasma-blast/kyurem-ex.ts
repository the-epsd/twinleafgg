import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class KyuremEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Outrage',
      cost: [C, C],
      damage: 30,
      damageCalculation: '+' as const,
      text: 'Does 10 more damage for each damage counter on this Pok\u00e9mon.'
    },
    {
      name: 'Giga Frost',
      cost: [W, W, C, C],
      damage: 150,
      text: 'Discard 2 [W] Energy attached to this Pok\u00e9mon.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyurem-EX';
  public fullName: string = 'Kyurem-EX PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage += player.active.damage;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.WATER);
    }

    return state;
  }
}
