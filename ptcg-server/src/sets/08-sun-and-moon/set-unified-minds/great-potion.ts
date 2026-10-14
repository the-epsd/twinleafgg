import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { GameError, GameMessage, StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GreatPotion extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '198';
  public name: string = 'Great Potion';
  public fullName: string = 'Great Potion UNM';
  public text: string = 'Heal 50 damage from your Active Pokemon-GX.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const activeCard = player.active.getPokemonCard();
    if (!activeCard || !activeCard.hasTag(CardTag.POKEMON_GX)) {
      return false;
    }
    if (player.active.damage === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const activeCard = player.active.getPokemonCard();

      // Must have an active GX Pokemon with damage
      if (!activeCard || !activeCard.hasTag(CardTag.POKEMON_GX)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.active.damage === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const healEffect = new HealEffect(player, player.active, 50);
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
