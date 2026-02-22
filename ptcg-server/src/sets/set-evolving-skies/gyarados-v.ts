import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GyaradosV extends PokemonCard {

  public regulationMark = 'E';

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Gyarados V';

  public cardType: CardType = CardType.WATER;

  public hp: number = 330;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Get Angry',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 20,
    text: 'This attack does 20 damage for each damage counter on this Pokémon.'
  }, {
    name: 'Max Tyrant',
    cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 180,
    text: ''
  }];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public name: string = 'Gyarados V';

  public fullName: string = 'Gyarados V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      // Get Drifloon's damage
      const gyaradosDamage = effect.player.active.damage;

      // Calculate 20 damage per counter
      const damagePerCounter = 20;
      effect.damage = gyaradosDamage * damagePerCounter;

      return state;
    }

    return state;
  }

}