import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Pokedex extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS'; // Replace with the appropriate set abbreviation

  public name: string = 'Pokedex';

  public fullName: string = 'Pokedex BS'; // Replace with the appropriate set abbreviation

  public cardImage: string = 'assets/cardback.png'; // Replace with the appropriate card image path

  public setNumber: string = '87'; // Replace with the appropriate set number

  public text: string = 'Look at up to 5 cards from the top of your deck and rearrange them as you like.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const deck = player.deck;

      // Get up to 5 cards from the top of the deck
      const cards = deck.cards.slice(0, 5);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // return store.prompt(state, new RearrangeCardsPrompt(
      //   player.id,
      //   GameMessage.REARRANGE_CARDS,
      //   cards
      // ), (rearrangedCards) => {
      //   // Discard the played Trainer card
      //   player.hand.moveCardTo(effect.trainerCard, player.discard);

      //   // Clear the deck
      //   deck.cards = [];

      //   // Add the rearranged cards to the deck
      //   deck.cards.push(...rearrangedCards);

      //   // Add the remaining cards to the deck
      //   deck.cards.push(...deck.cards.slice(5));
      // });
    }

    return state;
  }
}
