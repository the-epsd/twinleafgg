import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { GameError, GameMessage } from '../../game';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class ProfessorOaksResearch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DF';
  public name: string = 'Professor Oak\'s Research';
  public fullName: string = 'Professor Oak\'s Research DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';

  public text: string =
    'Shuffle your hand into your deck, then draw 5 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 5);

      CLEAN_UP_SUPPORTER(effect, player);
    }

    return state;
  }

}
