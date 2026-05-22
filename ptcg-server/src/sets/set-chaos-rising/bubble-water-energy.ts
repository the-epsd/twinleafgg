import { CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import {
  IS_SPECIAL_ENERGY_BLOCKED,
  PREVENT_AND_CLEAR_SPECIAL_CONDITIONS,
} from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BubbleWaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'M4';
  public regulationMark = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name = 'Bubble Water Energy';
  public fullName = 'Bubble Water Energy M4';
  public text =
    'As long as this card is attached to a Pokémon, it provides [W] Energy.\n\n' +
    "The [W] Pokémon this card is attached to recovers from all Special Conditions and can't be affected by any Special Conditions.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      effect.target.removeSpecialCondition(SpecialCondition.ASLEEP);
      effect.target.removeSpecialCondition(SpecialCondition.PARALYZED);
      effect.target.removeSpecialCondition(SpecialCondition.CONFUSED);
      effect.target.removeSpecialCondition(SpecialCondition.POISONED);
      effect.target.removeSpecialCondition(SpecialCondition.BURNED);
    }
    PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state, effect, {
      shouldApply: (target, owner) => !!owner && target.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, this, target),
    });
    return state;
  }
}
