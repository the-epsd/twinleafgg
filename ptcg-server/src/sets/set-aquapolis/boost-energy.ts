import { GameError, GameMessage, PlayerType } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BoostEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name = 'Boost Energy';
  public fullName = 'Boost Energy AQ';

  public text =
    'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat.\n\nWhen the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';

  public BOOST_MARKER = 'BOOST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {

      if (effect.target.getPokemons().length < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.player.marker.addMarker(this.BOOST_MARKER, this);
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const attachedTo = effect.source.getPokemonCard();
      if (!!attachedTo && attachedTo instanceof PokemonCard && effect.source.getPokemons().length > 1) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS] });
      }

      return state;
    }

    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.BOOST_MARKER, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);
          effect.player.marker.removeMarker(this.BOOST_MARKER, this);
        }
      });
    }

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }

          const attachedTo = cardList.getPokemonCard();

          if (!!attachedTo && cardList.getPokemons().length < 2) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }
    return state;
  }
}