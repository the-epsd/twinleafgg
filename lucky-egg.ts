import { TrainerType } from '../../game/store/card/card-types';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game';

export class LuckyEgg extends TrainerCard {

    public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '167';

  public regulationMark = 'D';

  public name = 'Lucky Egg';

  public fullName = 'Lucky Egg SSH';
  
  public readonly LUCKY_EGG_MARKER = 'LUCKY_EGG_MARKER';

  public text =
    
  'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, draw cards until you have 7 cards in your hand.';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.LUCKY_EGG_MARKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.LUCKY_EGG_MARKER)) {
          return;
        }

        while (player.hand.cards.length < 7) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }
        player.marker.removeMarker(this.LUCKY_EGG_MARKER);
      });
    }
    return state;
  }
}
