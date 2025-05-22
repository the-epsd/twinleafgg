import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class GreatBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Great Ball';
  public fullName: string = 'Great Ball RG';
  public text: string = 'Search your deck for a Basic Pokémon (excluding Pokémon-ex) and put it onto your Bench. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.tags.includes(CardTag.POKEMON_ex)) {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC }, { min: 0, max: 1, blocked });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    return state;
  }

}
