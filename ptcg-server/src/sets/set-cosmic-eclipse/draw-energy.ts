import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class DrawEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'CEC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '209';

  public name = 'Draw Energy';

  public fullName = 'Draw Energy CEC';

  public text =
    'This card provides [C] Energy.' +
    '' +
    'When you attach this card from your hand to a Pokémon, draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }

}
