import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class MeddlingMemo extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public regulationMark = 'H';
  public name: string = 'Meddling Memo';
  public fullName: string = 'Meddling Memo SSP';

  public text: string = 'Your opponent counts the cards in their hand, shuffles those cards, and puts them on the bottom of their deck. If they do, they draw that many cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0){
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
    
      const newCards = opponent.hand.cards.length;
      this.shufflePlayerHand(opponent);
      opponent.hand.moveTo(opponent.deck);
      opponent.deck.moveTo(opponent.hand, newCards);

      player.supporter.moveCardTo(this, player.discard);
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