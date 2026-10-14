import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lisia extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';
  public name: string = 'Lisia';
  public fullName: string = 'Lisia CES';
  public text: string =
    'Search your deck for up to 2 ◇ (Prism Star) cards, reveal them, and put them into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need at least one Prism Star card in the deck
    if (!player.deck.cards.some((c) => c.hasTag(CardTag.PRISM_STAR))) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!player.deck.cards.some((c) => c.hasTag(CardTag.PRISM_STAR))) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { tags: [CardTag.PRISM_STAR] },
        { min: 1, max: 2, allowCancel: false },
      );
    }

    return state;
  }
}
