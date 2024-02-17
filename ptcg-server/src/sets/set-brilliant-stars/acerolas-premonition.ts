import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';

export class AcerolasPremonition extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name: string = 'Acerola\'s Premonition';

  public fullName: string = 'Acerola\'s Premonition BRS';

  public text: string =
    'Your opponent reveals their hand, and you draw a card for each Trainer card you find there.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard);
    
      state = store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
    
        const cardsToMove = opponent.hand.cards.slice(0, cardsInOpponentHand.length * 1);
        player.deck.moveCardsTo(cardsToMove, player.hand);
    
      });
    }
    return state;
  }
    
}
    