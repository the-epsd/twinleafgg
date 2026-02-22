import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raticate extends PokemonCard {

  public name = 'Raticate';

  public set = 'BS';

  public cardType = CardType.COLORLESS;

  public fullName = 'Raticate BS';

  public setNumber = '40';

  public cardImage: string = 'assets/cardback.png';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Rattata';

  public hp = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Super Fang',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Does damage to the Defending Pokémon equal to half the Defending Pokémon\'s remaining HP (rounded up to the nearest 10).'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.target;
      const remainingHP = target.hp - target.damage;
      effect.damage = Math.ceil(remainingHP / 2 / 10) * 10;
    }

    return state;
  }

}
