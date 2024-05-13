import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList } from '../../game/store/state/card-list';

export class Pokestop extends TrainerCard {

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';
  
  public trainerType = TrainerType.STADIUM;
  public set = 'PGO';
  public name = 'Pokestop';
  public fullName = 'PokeStop PGO';
  public text = 'Once during each player\'s turn, that player may discard 3 cards from the top of their deck. If a player discarded any Item cards in this way, they put those Item cards into their hand.';
    
  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }
    
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;

    const deckTop = new CardList();
    player.deck.moveTo(deckTop, 3);

    // Filter for item cards
    const itemCards = deckTop.cards.filter(c => 
      c instanceof TrainerCard && 
          c.trainerType === TrainerType.ITEM
    );
  
    // Move all cards to discard
    deckTop.moveTo(player.discard, deckTop.cards.length);
  
    // Move item cards to hand
    player.discard.moveCardsTo(itemCards, player.hand);
  
    return state;
  }
}