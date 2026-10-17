import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';

export class Honey extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '142';
  public name: string = 'Honey';
  public fullName: string = 'Honey CRE';
  public text: string =
    "Draw a card for each of your opponent's Benched Pokémon V. You may play only 1 Supporter card during your turn.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count opponent's benched Pokemon V (including VMAX, VSTAR)
      let vCount = 0;
      opponent.bench.forEach((slot) => {
        const card = slot.getPokemonCard();
        if (
          card &&
          (card.hasTag(CardTag.POKEMON_V) ||
            card.hasTag(CardTag.POKEMON_VMAX) ||
            card.hasTag(CardTag.POKEMON_VSTAR))
        ) {
          vCount++;
        }
      });

      DRAW_CARDS(store, state, player, vCount);
    }

    return state;
  }
}
