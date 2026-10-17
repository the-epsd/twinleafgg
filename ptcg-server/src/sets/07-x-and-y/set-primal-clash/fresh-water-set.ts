import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { State, StoreLike, TrainerCard, Player, PlayerType } from '../../../game';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FreshWaterSet extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Fresh Water Set';
  public fullName: string = 'Fresh Water Set PRC';
  public text: string = 'Heal 20 damage from each of your Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
