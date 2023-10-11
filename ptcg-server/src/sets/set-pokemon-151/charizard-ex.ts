/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State   } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT } from '../../game/store/effect-factories/prefabs';

export class Charizardex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 330;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Brave Wing',
      cost: [ CardType.FIRE ],
      damage: 60,
      text: 'If this Pokémon has any damage counters on it, this attack ' +
      'does 100 more damage.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
          effect.damage += 100;
        }
      }
    },
    {
      name: 'Explosive Vortex',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE ],
      damage: 330,
      text: 'Discard 3 Energy from this Pokémon. ',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 3);
      }
    },
  ];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '6';

  public name: string = 'Charizard ex';

  public fullName: string = 'Charizard ex';

}