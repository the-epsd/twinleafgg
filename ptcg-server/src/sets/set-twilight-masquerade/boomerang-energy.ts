import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

export class BoomerangEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '166';

  public regulationMark = 'H';

  public name = 'Boomerang Energy';

  public fullName = 'Boomerang Energy TWM';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'If this card is discarded by an effect of an attack used by the Pokémon this card is attached to, attach this card from your discard pile to that Pokémon after attacking.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DiscardCardsEffect && effect.target === this.cards) {

      effect.preventDefault = true;

    }

    return state;

  }

}