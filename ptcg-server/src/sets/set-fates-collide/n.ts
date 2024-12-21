import { GameError, GameMessage, ShuffleDeckPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class N_Supporter extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FCO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name: string = 'N';

  public fullName: string = 'N FCO';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. Then, each player draws a card for each of his or her remaining Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cards = player.hand.cards.filter(c => c !== this);
      const opponentCards = opponent.hand.cards.filter(c => c !== this);

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveCardsTo(opponentCards, opponent.deck);

      store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });

      store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });

      player.deck.moveTo(player.hand, Math.min(player.getPrizeLeft(), player.deck.cards.length));
      opponent.deck.moveTo(opponent.hand, Math.min(opponent.getPrizeLeft(), opponent.deck.cards.length));

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }

    return state;
  }
}