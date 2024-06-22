import { PlayerType } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
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

    // Discard card when not attached to Dragon Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }

          try {
            const energyEffect = new EnergyEffect(player, this);
            store.reduceEffect(state, energyEffect);
          } catch {
            return state;
          }

          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.DRAGON)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    return state;
  }

}
