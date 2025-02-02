import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BlendEnergyWLFM extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name = 'Blend Energy WLFM';

  public fullName = 'Blend Energy WLFM DRX';

  public text = 'This card provides [C] Energy. When attached to a Pokémon, this card provides [W], [L], [F], or [M] but only 1 Energy at a time.';

  // We won't do the "needed cost logic" here anymore
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        // Always add the base "EnergyEffect"
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      // Instead of guessing whether we provide [W] or [L] or [F] or [M],
      // just push a placeholder so 'checkEnoughEnergy' can decide the best match.
      effect.energyMap.push({
        card: this,
        // Put a single "WLFM" token to indicate this card can fulfill one of [W,L,F,M].
        provides: [CardType.WLFM]
      });
    }

    return state;
  }
}