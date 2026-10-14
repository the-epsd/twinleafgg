import { GameError, GameMessage, Player, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GoldPotion extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BCR';
  public setNumber: string = '140';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gold Potion';
  public fullName: string = 'Gold Potion BCR';
  public text: string =
    "Heal 90 damage from your Active Pokémon. You can't have more than 1 ACE SPEC card in your deck.";

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.active.damage > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      if (player.active.damage === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const healEffect = new HealEffect(player, player.active, 90);
      return store.reduceEffect(state, healEffect);
    }
    return state;
  }
}
