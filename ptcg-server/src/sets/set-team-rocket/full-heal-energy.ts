import { StoreLike, State } from '../../game';
import { CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class FullHealEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name = 'Full Heal Energy';
  public fullName = 'Full Heal Energy TR';

  public text = 'If you play this card from your hand, the Pokémon you attach it to is no longer Asleep, Confused, Paralyzed, or Poisoned.\n\nFull Heal Energy provides [C] energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      effect.target.removeSpecialCondition(SpecialCondition.ASLEEP);
      effect.target.removeSpecialCondition(SpecialCondition.PARALYZED);
      effect.target.removeSpecialCondition(SpecialCondition.CONFUSED);
      effect.target.removeSpecialCondition(SpecialCondition.POISONED);
    }

    return state;
  }
}