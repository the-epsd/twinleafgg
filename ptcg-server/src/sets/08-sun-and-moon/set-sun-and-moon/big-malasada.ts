import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, SelectPrompt, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BigMalasada extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Big Malasada';
  public fullName: string = 'Big Malasada SUM';
  public text: string = 'Heal 20 damage and remove a Special Condition from your Active Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Heal 20 damage from active
      const healEffect = new HealEffect(player, player.active, 20);
      store.reduceEffect(state, healEffect);

      // Remove a Special Condition
      const specialConditions = player.active.specialConditions;
      if (specialConditions.length === 1) {
        player.active.specialConditions = [];
      } else if (specialConditions.length > 1) {
        // Player chooses which condition to remove
        const options: string[] = specialConditions.map((sc) => SpecialCondition[sc]);

        store.prompt(
          state,
          new SelectPrompt(player.id, GameMessage.CHOOSE_SPECIAL_CONDITION, options, {
            allowCancel: false,
          }),
          (choice) => {
            if (choice !== null && choice >= 0 && choice < specialConditions.length) {
              specialConditions.splice(choice, 1);
            }
          },
        );
      }
    }

    return state;
  }
}
