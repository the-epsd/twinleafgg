/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, THIS_ATTACK_DOES_X_MORE_DAMAGE, THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Charizardex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 330;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Brave Wing',
      cost: [CardType.FIRE],
      damage: 60,
      damageCalculation: '+',
      text: 'If this Pokémon has any damage counters on it, this attack ' +
        'does 100 more damage.',
    },
    {
      name: 'Explosive Vortex',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 330,
      text: 'Discard 3 Energy from this Pokémon. ',
    },
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Charizard ex';

  public fullName: string = 'Charizard ex MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 100);
      }
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 3);
    }
    return state;
  }
}