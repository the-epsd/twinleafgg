import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class DrumsOfAwakening extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [ CardTag.ACE_SPEC ];

  public regulationMark = 'H';

  public set: string = 'SV5';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Drums of Awakening';

  public fullName: string = 'Drums of Awakening SV5';

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

    }
    return state;
  }
}