import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { TrainerCard, StoreLike, State, Player } from '../../../game';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RotomBike extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '181';
  public name: string = 'Rotom Bike';
  public fullName: string = 'Rotom Bike SSH';
  public text: string =
    'Draw cards until you have 6 cards in your hand. Your turn ends. You may play any number of Item cards during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: [this], sourceCard: this });
      effect.preventDefault = true;

      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);

      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
    }

    return state;
  }
}
