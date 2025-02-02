import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class RichEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public tags = [CardTag.ACE_SPEC];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SSP';

  public regulationMark = 'H';

  public name = 'Enriching Energy';

  public fullName = 'Rich Energy SV7a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '191';

  public text =
    'When this card is attached to a Pokémon, it provides 1 [C] Energy.' +
    '' +
    'When you attach this card from your hand to one of your Pokémon, draw 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 4);
    }
    return state;
  }
}
