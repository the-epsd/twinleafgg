import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class DrumsOfAwakening extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

  public name: string = 'Awakening Drum';

  public fullName: string = 'Awakening Drum TEF';

  public text: string =
    'Draw a card for each of your Ancient Pokémon in play.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      let ancientPokemonCount = 0;

      if (player.active?.getPokemonCard()?.tags.includes(CardTag.ANCIENT)) {
        ancientPokemonCount++;
      }

      player.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()?.tags.includes(CardTag.ANCIENT)) {
          ancientPokemonCount++;
        }
      });
      player.deck.moveTo(player.hand, ancientPokemonCount);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
    return state;
  }
}