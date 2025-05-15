import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { DRAW_CARDS, IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
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
    '\n\n' +
    'When you attach this card from your hand to a Pokémon, draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
        return state;
      }

      DRAW_CARDS(player, 1);
    }

    return state;
  }

}
