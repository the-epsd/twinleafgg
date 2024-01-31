import { CardTag, CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PlayerType } from '../../game';

export class SpiralEnergy extends EnergyCard {

  public cardTag: CardTag[] = [CardTag.RAPID_STRIKE];

  public regulationMark = 'E';

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name = 'Spiral Energy';

  public fullName = 'Spiral Energy CRE';

  public text = 'This card can only be attached to a Rapid Strike Pokémon. If this card is attached to anything other than a Rapid Strike Pokémon, discard this card.' +
    '' +
    'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time. The Pokémon this card is attached to can\'t be Paralyzed, and if it is already Paralyzed, it recovers from that Special Condition.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Provide energy when attached to Single Strike Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const pokemon = effect.source;
      if (pokemon.getPokemonCard()?.tags.includes(CardTag.RAPID_STRIKE)) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY] });
      }
      return state;
    }

    // Discard card when not attached to Single Strike Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }
          const pokemon = cardList;
          if (!pokemon.getPokemonCard()?.tags.includes(CardTag.RAPID_STRIKE)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    state.players.forEach(player => {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (!cardList.cards.includes(this)) {
          return;
        }
        if (cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
          cardList.removeSpecialCondition(SpecialCondition.PARALYZED);
        }
        return state;
      });
      return state;
    });
    return state;
  }

}