import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class PowerfulColorlessEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DAA';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '176';

  public name = 'Powerful Colorless Energy';

  public fullName = 'Powerful Colorless Energy DAA';

  public text =
    `As long as this card is attached to a Pokémon, it provides [C] Energy.
    
The attacks of the [C] Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.COLORLESS)) {
        return state;
      }

      if (effect.damage > 0 && effect.target === effect.opponent.active) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
