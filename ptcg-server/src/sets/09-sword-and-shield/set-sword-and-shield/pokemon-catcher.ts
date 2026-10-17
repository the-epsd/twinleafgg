import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  Player,
} from '../../../game';
import {
  COIN_FLIP_PROMPT,
  SWITCH_IN_OPPONENT_BENCHED_POKEMON,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'G';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '175';
  public name: string = 'Pokémon Catcher';
  public fullName: string = 'Pokemon Catcher SSH';
  public text: string =
    "Flip a coin. If heads, switch 1 of your opponent's Benched Pokemon " +
    'with their Active Pokemon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some((b) => b.cards.length > 0);
    if (!hasBench) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player);
        }
      });
    }

    return state;
  }
}
