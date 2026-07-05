import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class DarkBell extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'M5';
  public setNumber: string = '70';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Bell';
  public fullName: string = 'Dark Bell M5';
  public text: string = 'Both Active Pokémon (except any [D] Pokémon) are now Confused.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Refs: set-crimson-invasion/nihilego-gx.ts (Empty Light - both Active Confused),
    //       set-chilling-reign/weeding-gloves.ts (CheckPokemonTypeEffect)
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maybeConfuse = (targetPlayer: typeof player, active: typeof player.active) => {
        if (active.cards.length === 0) {
          return;
        }
        const checkType = new CheckPokemonTypeEffect(active);
        store.reduceEffect(state, checkType);
        if (!checkType.cardTypes.includes(CardType.DARK)) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, targetPlayer, this);
        }
      };

      maybeConfuse(player, player.active);
      maybeConfuse(opponent, opponent.active);
    }

    return state;
  }
}
