import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { countHideNSneakPokemonInDiscard } from './hide-n-sneak';

export class Dhelmise extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Regretful Rage',
      cost: [P],
      damage: 30,
      damageCalculation: '+',
      text: "If you have 4 or more Pokémon in your discard with the Hide 'n' Sneak Ability, this attack does 140 more damage.",
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '37';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dhelmise';
  public fullName: string = 'Dhelmise M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (countHideNSneakPokemonInDiscard(effect.player) >= 4) {
        effect.damage += 140;
      }
    }

    return state;
  }
}
