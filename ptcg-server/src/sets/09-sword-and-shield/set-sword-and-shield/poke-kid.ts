import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, GameError, GameMessage, StoreLike, State, Player } from '../../../game';
import {
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokeKid extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '173';
  public name: string = 'Poké Kid';
  public fullName: string = 'Poké Kid SSH';
  public text: string =
    'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1 });
    }

    return state;
  }
}
