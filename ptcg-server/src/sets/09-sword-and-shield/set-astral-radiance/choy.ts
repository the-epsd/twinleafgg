import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { Player, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Choy extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';
  public name: string = 'Choy';
  public fullName: string = 'Choy ASR 137';
  public text: string =
    'Each player reveals their hand. Draw 3 cards. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Each player reveals their hand
      SHOW_CARDS_TO_PLAYER(store, state, opponent, player.hand.cards);
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      // Draw 3 cards
      DRAW_CARDS(store, state, player, 3);
    }

    return state;
  }
}
