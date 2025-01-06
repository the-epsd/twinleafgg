import { GameError, GameMessage } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class DoubleDragonEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'ROS';

  public name = 'Double Dragon Energy';

  public fullName = 'Double Dragon Energy SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public text =
    'This card can only be attached to [N] Pokémon.' +
    '' +
    'This card provides every type of Energy, but provides only 2 Energy at a time, only while this card is attached to a [N] Pokémon.' +
    '' +
    '(If this card is attached to anything other than a [N] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY] });
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      if (!checkPokemonType.cardTypes.includes(CardType.DRAGON)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    return state;
  }

}
