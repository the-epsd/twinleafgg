import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import { MOVE_CARDS, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Winona extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Winona';
  public fullName: string = 'Winona ROS';
  public text: string =
    'Search your deck for up to 3 [C] Pokémon, reveal them, and put them into your hand. Shuffle your deck afterward.';

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

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store,
        state,
        player,
        { cardType: [CardType.COLORLESS] },
        { min: 0, max: 3, allowCancel: false },
      );
    }

    return state;
  }
}
