import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chinchou';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Special Tackle',
      cost: [L],
      damage: 30,
      damageCalculation: '+' as const,
      text: 'If this Pokémon has any Special Energy attached to it, this attack does 30 more damage.'
    },
    {
      name: 'Extreme Current',
      cost: [L, C, C],
      damage: 90,
      text: 'Discard an Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasSpecial = player.active.cards.some(
        c => c.superType === SuperType.ENERGY && (c as EnergyCard).energyType === EnergyType.SPECIAL
      );
      if (hasSpecial) {
        effect.damage += 30;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
