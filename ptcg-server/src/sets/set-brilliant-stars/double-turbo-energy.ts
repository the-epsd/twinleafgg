import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
//import {AttackEffect} from '../../game/store/effects/game-effects';

export class DoubleTurboEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public regulationMark = 'F';

  public name = 'Double Turbo Energy';

  public fullName = 'Double Turbo Energy BRS';

  public text: string = 'As long as this card is attached to a Pokémon, it provides [C][C] Energy.' +
    '\n' +
    'The attacks of the Pokémon this card is attached to do 20 less damage to your opponent\'s Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof DealDamageEffect) && effect.source.cards.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {
        return state;
      }
      effect.damage -= 20;
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.COLORLESS, CardType.COLORLESS] });
    }
    return state;
  }
}