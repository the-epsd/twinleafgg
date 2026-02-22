import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GreatTusk2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ANCIENT];
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Lunge Out',
      cost: [F, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Wrathful Charge',
      cost: [F, C, C],
      damage: 80,
      damageCalculation: '+',
      text: 'If your Benched Pokémon have any damage counters on them, this attack does 80 more damage.'
    },

  ];

  public set: string = 'TEF';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Great Tusk';
  public fullName: string = 'Great Tusk TEF2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wrathful Charge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if any benched Pokémon has damage
      const hasDamagedBench = player.bench.some(pokemon => pokemon.damage > 0);
      if (hasDamagedBench) {
        effect.damage += 80;
      }
    } return state;
  }
}