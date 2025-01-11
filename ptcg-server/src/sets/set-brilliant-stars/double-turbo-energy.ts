import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

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
    '' +
    'The attacks of the Pokémon this card is attached to do 20 less damage to your opponent\'s Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PutDamageEffect) && effect.source.cards.includes(this) && !effect.target.cards.includes(this)) {
      const player = effect.player;
      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      effect.damage -= 20;
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      this.provides = [CardType.COLORLESS, CardType.COLORLESS];
    }
    return state;
  }
}