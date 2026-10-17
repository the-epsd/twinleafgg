import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { Player, GameError, GameMessage } from '../../../game';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class SwitchCart extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '154';
  public name: string = 'Switch Cart';
  public fullName: string = 'Switch Cart ASR';
  public text: string =
    'Switch your Active Basic Pokémon with 1 of your Benched Pokémon. If you do, heal 30 damage from the Pokémon you moved to your Bench.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    const hasBench = player.bench.some((b) => b.cards.length > 0);
    if (!hasBench) {
      return false;
    }

    const pokemonCard = player.active.getPokemonCard();
    if (!pokemonCard || pokemonCard.stage !== Stage.BASIC) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const hasBench = player.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard && pokemonCard.stage !== Stage.BASIC) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (pokemonCard) {
        // The switch is mandatory once played, so heal the Pokémon moving to the Bench first
        store.reduceEffect(state, new HealEffect(player, player.active, 30));
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }
    return state;
  }
}
