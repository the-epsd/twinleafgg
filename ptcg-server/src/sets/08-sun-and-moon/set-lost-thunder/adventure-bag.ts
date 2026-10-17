import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AdventureBag extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '167';
  public name: string = 'Adventure Bag';
  public fullName: string = 'Adventure Bag LOT';
  public text: string =
    'Search your deck for up to 2 Pokémon Tool cards, reveal them, and put them into your hand. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const filter: Partial<TrainerCard> = {
        superType: SuperType.TRAINER,
        trainerType: TrainerType.TOOL,
      };
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, filter, {
        min: 0,
        max: 2,
        allowCancel: false,
      });
    }

    return state;
  }
}
