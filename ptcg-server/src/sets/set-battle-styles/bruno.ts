import { Effect } from '../../game/store/effects/effect';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ShuffleDeckPrompt } from '../../game';

export class Bruno extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'E';

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Bruno';

  public fullName: string = 'Bruno BST';

  public text: string =
    'Shuffle your hand into your deck. Then, draw 4 cards. If any of your Pokémon were Knocked Out during your opponent\'s last turn, draw 7 cards instead.';

  public readonly BRUNO_MARKER = 'BRUNO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      if (effect instanceof KnockOutEffect) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);
        const cards = player.hand.cards.filter(c => c !== this);

        // Do not activate between turns, or when it's not opponents turn.
        if (!duringTurn || state.players[state.activePlayer] !== opponent) {
          return state;
        }
                

        // No Pokemon KO last turn
        if (!player.marker.hasMarker(this.BRUNO_MARKER)) {

          if (cards.length > 0) {
            player.hand.moveCardsTo(cards, player.deck);

            state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          }
          player.deck.moveTo(player.hand, 5);
        }
            


        if (cards.length > 0) {
          player.hand.moveCardsTo(cards, player.deck);

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        }
        player.deck.moveTo(player.hand, 5);
      }
      return state;

    }


    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.BRUNO_MARKER);
    }
    return state;
  }
}

