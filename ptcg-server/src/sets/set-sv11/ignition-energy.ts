import { PlayerType } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class IgnitionEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'I';

  public set: string = 'SV11W';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name = 'Ignition Energy';

  public fullName = 'Ignition Energy SV11W';

  public text = `If this card is attached to 1 of your Pokémon, discard it at the end of the turn.

This card provides 1 [C] Energy while it is attached to a Pokémon.

If this card is attached to an Evolution Pokémon, it provides [C][C][C] Energy instead.`;

  public TRIPLE_ACCELERATION_MARKER = 'TRIPLE_ACCELERATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      effect.player.marker.addMarker(this.TRIPLE_ACCELERATION_MARKER, this);
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const attachedTo = effect.source.getPokemonCard();
      if (!!attachedTo && attachedTo instanceof PokemonCard && attachedTo.stage == Stage.BASIC) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
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
    return state;
  }
}