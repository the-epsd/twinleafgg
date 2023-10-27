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

  public set2: string = 'pokemongo';

  public setNumber: string = '68';
  
  public trainerType = TrainerType.STADIUM;
  public set = 'PGO';
  public name = 'PokéStop';
  public fullName = 'Pokéstop PGO';
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

    // Move all item cards to hand
    deckTop.moveCardsTo(itemCards, player.hand);

    // Move remaining cards back to deck
    const remainingCards = deckTop.cards;
    deckTop.moveTo(player.discard, remainingCards.length);

    return state;
  }

}