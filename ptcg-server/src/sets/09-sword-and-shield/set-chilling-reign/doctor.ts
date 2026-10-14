import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';

export class Doctor extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '134';
  public name: string = 'Doctor';
  public fullName: string = 'Doctor CRE';
  public text: string =
    "Draw 2 cards. If your opponent's Active Pokémon is a Pokémon VMAX, draw 2 more cards. You may play only 1 Supporter card during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      DRAW_CARDS(store, state, player, 2);

      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.hasTag(CardTag.POKEMON_VMAX)) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    return state;
  }
}
