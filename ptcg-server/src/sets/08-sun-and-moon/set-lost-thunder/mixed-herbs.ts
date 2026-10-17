import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, TrainerCard, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class MixedHerbs extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '184';
  public name: string = 'Mixed Herbs';
  public fullName: string = 'Mixed Herbs LOT';
  public text: string =
    'You may play 2 Mixed Herbs cards at once.\n\u2022 If you played 1 card, remove a Special Condition from your Active Pok\u00e9mon.\n\u2022 If you played 2 cards, heal 90 damage and remove all Special Conditions from your Active Pok\u00e9mon. (This effects works one time for 2 cards.)';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.active.specialConditions.length > 0 || player.active.damage > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if another Mixed Herbs is in hand
      const otherMixedHerbs = player.hand.cards.find(
        (c) => c instanceof TrainerCard && c.name === 'Mixed Herbs' && c !== this,
      );

      if (otherMixedHerbs) {
        // Playing 2 cards - heal 90 damage and remove all Special Conditions
        MOVE_CARDS(store, state, player.hand, player.discard, {
          cards: [otherMixedHerbs],
          sourceCard: this,
        });

        const healEffect = new HealEffect(player, player.active, 90);
        store.reduceEffect(state, healEffect);
        player.active.specialConditions = [];
      } else if (player.active.specialConditions.length > 0) {
        // Playing 1 card - remove a Special Condition (the first one)
        player.active.specialConditions.splice(0, 1);
      }
    }

    return state;
  }
}
