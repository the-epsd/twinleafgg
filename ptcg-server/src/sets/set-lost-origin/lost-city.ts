import { Effect } from '../../game/store/effects/effect';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { Card, StateUtils } from '../../game';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';

export class LostCity extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '161';

  public name: string = 'Lost City';

  public fullName: string = 'Lost City LOR';

  public text: string =
    'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';

  public readonly LOST_CITY_MARKER = 'LOST_CITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
  
      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.LOST_CITY_MARKER, card);
      });
    }
  
    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {
  
        if (!player.marker.hasMarker(this.LOST_CITY_MARKER)) {
          return;
        }
  
        const lostZoned: Card[] = player.marker.markers
          .filter(m => m.name === this.LOST_CITY_MARKER)
          .map(m => m.source);
  
        player.discard.moveCardsTo(lostZoned, player.lostzone);
        player.marker.removeMarker(this.LOST_CITY_MARKER);
      });
    }
  
    return state;
  }
  
}
  