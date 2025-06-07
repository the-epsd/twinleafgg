import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class PotionEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name = 'Potion Energy';
  public fullName = 'Potion Energy TR';

  public text = 'If you play this card from your hand, remove 1 damage counter from the Pokémon you attach it to, if it has any.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      if (effect.target.damage > 0) {
        const healEffect = new HealEffect(player, effect.target, 10);
        store.reduceEffect(state, healEffect);
      }
    }

    return state;
  }
}