import { Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonCirculator extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Pokémon Circulator';
  public fullName: string = 'Pokémon Circulator UL';
  public text: string =
    'Your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.bench.some((b) => b.cards.length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    return state;
  }
}
