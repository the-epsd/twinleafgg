import { StoreLike, State } from '../../game';
import { CardTag, CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class HealEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name = 'Heal Energy';
  public fullName = 'Heal Energy DX';

  public text = 'Heal Energy provides [C] Energy. When you attach this card from your hand to 1 of your Pokémon, remove 1 damage counter and all Special Conditions from that Pokémon. If Heal Energy is attached to Pokémon-ex, Heal Energy has no effect other than providing Energy.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      if (effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        return state;
      }

      const healEffect = new HealEffect(player, effect.target, 10);
      store.reduceEffect(state, healEffect);

      effect.target.removeSpecialCondition(SpecialCondition.ASLEEP);
      effect.target.removeSpecialCondition(SpecialCondition.PARALYZED);
      effect.target.removeSpecialCondition(SpecialCondition.CONFUSED);
      effect.target.removeSpecialCondition(SpecialCondition.BURNED);
      effect.target.removeSpecialCondition(SpecialCondition.POISONED);
    }

    return state;
  }
}