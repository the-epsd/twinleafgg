import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonRanger extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Pokémon Ranger';
  public fullName: string = 'Pokemon Ranger STS';
  public text: string = 'Remove all effects of attacks on each player and his or her Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const opponent = StateUtils.getOpponent(state, player);

      // Both players and each of their Pokémon. Not damage or Special Conditions.
      player.removeAttackEffectsFromPlayerAndPokemon();
      opponent.removeAttackEffectsFromPlayerAndPokemon();
    }

    return state;
  }
}
