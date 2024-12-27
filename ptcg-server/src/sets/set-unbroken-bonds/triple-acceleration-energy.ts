import { GameError, GameMessage, PlayerType } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TripleAccelerationEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '190';

  public name = 'Triple Acceleration Energy';

  public fullName = 'Triple Acceleration Energy UNB';

  public text =
    'This card can only be attached to Evolution Pokémon. If this card is attached to 1 of your Pokémon, discard it at the end of the turn.' +
    '' +
    'This card provides [C][C][C] Energy only while it is attached to an Evolution Pokémon.' +
    '' +
    'If this card is attached to anything other than an Evolution Pokémon, discard this card.';

  public TRIPLE_ACCELERATION_MARKER = 'TRIPLE_ACCELERATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const attachedTo = effect.target.getPokemonCard();

      if (!!attachedTo && (attachedTo.stage === Stage.BASIC || attachedTo.stage === Stage.RESTORED)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.player.marker.addMarker(this.TRIPLE_ACCELERATION_MARKER, this);
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      const attachedTo = effect.source.getPokemonCard();

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (!!attachedTo && attachedTo instanceof PokemonCard && attachedTo.stage !== Stage.BASIC && attachedTo.stage !== Stage.RESTORED) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS] });
      }

      return state;
    }

    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.TRIPLE_ACCELERATION_MARKER, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);
          effect.player.marker.removeMarker(this.TRIPLE_ACCELERATION_MARKER, this);
        }
      });
    }

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

          const attachedTo = cardList.getPokemonCard();

          if (!!attachedTo && (attachedTo.stage === Stage.BASIC || attachedTo.stage === Stage.RESTORED)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    return state;
  }
}