import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CardList, GameError, GameMessage } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class Marnie extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '169';

  public name: string = 'Marnie';

  public fullName: string = 'Marnie SSH';

  public text: string =
    'Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, you draw 5 cards, and your opponent draws 4 cards.';

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
      const deckBottom = new CardList();
      const opponentDeckBottom = new CardList();

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.hand.cards.length === 0 && opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardsTo(cards, deckBottom);
      opponent.hand.moveTo(opponentDeckBottom);

      deckBottom.moveTo(player.deck);
      opponentDeckBottom.moveTo(opponent.deck);

      player.deck.moveTo(player.hand, Math.min(5, player.deck.cards.length));
      opponent.deck.moveTo(opponent.hand, Math.min(4, opponent.deck.cards.length));

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }

    return state;
  }
}