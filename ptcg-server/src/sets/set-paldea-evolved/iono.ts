import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CardList, GameError, GameMessage, Player } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class Iono extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '185';

  public name: string = 'Iono';

  public fullName: string = 'Iono PAL';

  public text: string =
    'Each player shuffles his or her hand into his or her deck. ' +
    'Then, each player draws a card for each of his or her remaining Prize cards.';
    
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

      // Shuffle the player's hand
      this.shufflePlayerHand(player);

      // Shuffle the opponent's hand
      this.shufflePlayerHand(opponent);

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
    
      player.deck.moveTo(player.hand, player.getPrizeLeft());
      opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      

    }
    
    return state;
  }

  shufflePlayerHand(player: Player): void {
    const hand = player.hand.cards;
  
    // Shuffle the hand using the Fisher-Yates shuffle algorithm
    for (let i = hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hand[i], hand[j]] = [hand[j], hand[i]];
    }
  }
}