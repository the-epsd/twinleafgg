import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RecycleEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '212';

  public name = 'Recycle Energy';

  public fullName = 'Recycle Energy UNM';

  public text =
    'This card provides [C] Energy.' +
    '' +
    'If this card is discarded from play, put it into your hand instead of the discard pile.';
  
  public RECYCLE_ENERGY_MARKER = 'RECYCLE_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      effect.target.moveCardTo(this, player.hand);
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.RECYCLE_ENERGY_MARKER, this);
    }

    state.players.forEach(player => {
      // Check if the card is in the player's discard pile
      const recycleEnergyInDiscard = player.discard.cards.some(card => card === this);
      if (recycleEnergyInDiscard && player.marker.hasMarker(this.RECYCLE_ENERGY_MARKER, this)) {
        // Move the card from the discard pile to the player's hand
        player.discard.moveCardTo(this, player.hand);
        player.marker.removeMarker(this.RECYCLE_ENERGY_MARKER, this);
      }
    });
    return state;
  }
      
}
      