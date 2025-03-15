import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { GameError, GameMessage } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';

export class ArvensSandwich extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ARVENS];
  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arven\'s Sandwich';
  public fullName: string = 'Arven\'s Sandwich SV9a';

  public text: string = 'Heal 30 damage from your Active Pokémon. If that Pokémon is an Arven\'s Pokémon, heal 100 damage instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)){
      const player = effect.player;

      if (player.active.damage === 0){
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.active.getPokemonCard()?.tags.includes(CardTag.ARVENS)){
        const healing = new HealEffect(player, player.active, 100);
        store.reduceEffect(state, healing);
      } else {
        const healing = new HealEffect(player, player.active, 30);
        store.reduceEffect(state, healing);
      }
    }

    return state;
  }

}
