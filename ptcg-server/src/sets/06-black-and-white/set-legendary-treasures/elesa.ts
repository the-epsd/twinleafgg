import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';

export class Elesa extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LTR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'RC20';
  public name: string = 'Elesa';
  public fullName: string = 'Elesa LTR';
  public text: string =
    'Search your deck for 3 Pokémon Tool cards, reveal them, and put them into your hand. Shuffle your deck afterward. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const filter: Partial<TrainerCard> = {
        superType: SuperType.TRAINER,
        trainerType: TrainerType.TOOL,
      };
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, filter, {
        min: 0,
        max: 3,
        allowCancel: true,
      });
    }

    return state;
  }
}
