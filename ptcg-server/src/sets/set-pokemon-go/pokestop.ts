import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;

  // Discard top 3 cards from player's deck
  player.deck.moveTo(player.discard, 3);
  // Check if any discarded cards are Items
  const itemCards = player.discard.cards.filter((card: any) => card.type === 'Item');
  if (itemCards.length > 0) {
    itemCards.forEach(card => {
      itemCards.forEach(item => player.discard.moveCardTo(item, player.hand));
    });
  }
  yield state;
}

export class Pokestop extends TrainerCard {

  public regulationMark = 'F';

  public set2: string = 'pokemongo';

  public setNumber: string = '68';
  
  public trainerType = TrainerType.STADIUM;
  public set = 'PGO';
  public name = 'Pokéstop';
  public fullName = 'Pokéstop PGO';
  public text = 'Once during each player\'s turn, that player may discard 3 cards from the top of their deck. If a player discarded any Item cards in this way, they put those Item cards into their hand.';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
