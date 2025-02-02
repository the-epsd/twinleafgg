import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class KorrinasFocus extends TrainerCard {

  public regulationMark = 'E';

  public tags = [CardTag.RAPID_STRIKE];

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name: string = 'Korrina\'s Focus';

  public fullName: string = 'Korrina\'s Focus BST';

  public text: string =
    'Draw cards until you have 6 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      while (player.hand.cards.length < 6) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
      return state;
    }
    return state;
  }
}