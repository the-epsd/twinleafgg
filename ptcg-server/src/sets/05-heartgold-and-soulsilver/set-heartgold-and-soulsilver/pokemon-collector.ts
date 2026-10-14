import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonCollector extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'HS';
  public name: string = 'Pokémon Collector';
  public fullName: string = 'Pokémon Collector HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public text: string =
    'Search your deck for up to 3 Basic Pokémon, show them to your opponent, ' +
    'and put them into your hand. Shuffle your deck afterward.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
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

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store,
        state,
        player,
        { stage: Stage.BASIC },
        { min: 0, max: 3, allowCancel: false },
      );
    }

    return state;
  }
}
