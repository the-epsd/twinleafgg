import {
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StoreLike,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, MOVE_POKEMON_OFF_BOARD } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AZ extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'AZ';
  public fullName: string = 'AZ PHF';
  public text: string =
    'Put 1 of your Pokemon into your hand. (Discard all cards attached to that Pokemon.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    let hasPokemon = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => {
      hasPokemon = true;
    });
    return hasPokemon;
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

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false },
        ),
        (result) => {
          const cardList = result.length > 0 ? result[0] : null;
          if (cardList !== null) {
            MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
              pokemonDestination: player.hand,
              attachedDestination: player.discard,
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
