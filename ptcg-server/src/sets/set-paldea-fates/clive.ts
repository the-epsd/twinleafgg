import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage, ShowCardsPrompt, StateUtils } from '../../game';

export class Clive extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '175';
  
  public set = 'SV4';
  
  public name = 'Clive';
  
  public fullName = 'Clive SV4';

  public text: string =
    'Your opponent reveals their hand. Draw 2 cards for each Supporter card you find there.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER);

      state = store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {

        const cardsToMove = opponent.hand.cards.slice(0, cardsInOpponentHand.length * 2);
        player.deck.moveCardsTo(cardsToMove, player.hand);

      });
    }
    return state;
  }

}
