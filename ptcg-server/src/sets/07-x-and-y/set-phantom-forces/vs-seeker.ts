import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class VsSeeker extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'VS Seeker';
  public fullName: string = 'VS Seeker PHF';
  public text: string = 'Put a Supporter card from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.discard.cards.some(
      (c) => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (!(c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 1, max: 1, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
