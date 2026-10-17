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
  MOVE_CARDS,
  SWITCH_IN_OPPONENT_BENCHED_POKEMON,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Pokémon Catcher';
  public fullName: string = 'Pokemon Catcher EPO';
  public text: string = "Switch your opponent's Active Pokémon with 1 of their Benched Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.bench.some((b) => b.cards.length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player);
    }

    return state;
  }
}
