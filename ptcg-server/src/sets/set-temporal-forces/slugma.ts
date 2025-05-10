import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slugma extends PokemonCard {

  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Roasting Heat',
      cost: [R],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is Burned, this attack does 40 more damage.',
    }
  ];

  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.BURNED)) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
