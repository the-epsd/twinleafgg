import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Channeler extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '190';
  public name: string = 'Channeler';
  public fullName: string = 'Channeler UNM';
  public text: string =
    'Remove all effects of attacks on you and each of your Pokémon. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Does not clear the opponent, damage counters, or Special Conditions.
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.removeAttackEffectsFromPlayerAndPokemon();
    }

    return state;
  }
}
