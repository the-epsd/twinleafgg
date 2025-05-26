import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage, Format } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';


export class PokemonFanClub extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'UPR';

  public name: string = 'Pokémon Fan Club';

  public fullName: string = 'Pokémon Fan Club UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '133';

  public text: string =
    'Search your deck for up to 2 Basic Pokémon, reveal them, ' +
    'and put them into your hand. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check if we're in Expanded format
      const isRspk = (store as any).handler.format === Format.RSPK;

      if (isRspk) {
        SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
          store,
          state,
          player,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: 2 }
        );
      } else {
        SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
          store,
          state,
          player,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: 2 }
        )
      }

      player.supporter.moveCardTo(this, player.discard);
    }

    return state;
  }

}
