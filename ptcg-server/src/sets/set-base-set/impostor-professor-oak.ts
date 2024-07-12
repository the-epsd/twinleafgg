import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt, StateUtils } from '../../game';

export class ImpostorProfessorOak extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS'; // Replace with the appropriate set abbreviation

  public name: string = 'Impostor Professor Oak';

  public fullName: string = 'Impostor Professor Oak BS'; // Replace with the appropriate set abbreviation

  public cardImage: string = 'assets/cardback.png'; // Replace with the appropriate card image path

  public setNumber: string = '73'; // Replace with the appropriate set number

  public text: string = 'Your opponent shuffles his or her hand into his or her deck, then draws 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Shuffle opponent's hand into their deck
      opponent.hand.moveCardsTo(opponent.hand.cards, opponent.deck);

      store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });

      // Draw 7 cards for the opponent
      opponent.deck.moveTo(opponent.hand, 7);

      // Discard the played Trainer card
      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      return state;
    }

    return state;
  }
}
