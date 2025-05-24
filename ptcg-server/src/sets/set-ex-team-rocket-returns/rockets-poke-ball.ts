import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game';

export class RocketsPokeBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TRR';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rocket\'s Poké Ball';
  public fullName: string = 'Rocket\'s Poké Ball TRR';

  public text: string = 'Search your deck for a Pokémon with Dark in its name, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.tags.includes(CardTag.DARK)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store, state, effect.player, {}, { min: 0, max: 1, blocked }
      );

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
