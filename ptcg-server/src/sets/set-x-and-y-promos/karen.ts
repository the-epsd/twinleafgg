import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game';
import { SHUFFLE_CARDS_INTO_DECK } from '../../game/store/prefabs/prefabs';

export class Karen extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'XYP';
  public name: string = 'Karen';
  public fullName: string = 'Karen PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'XY177';

  public text: string = 'Each player shuffles all Pokémon in his or her discard pile into his or her deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      for (const p of [effect.player, StateUtils.getOpponent(state, effect.player)]) {
        const discardedPokemon = p.discard.cards.filter(c => c instanceof PokemonCard);
        SHUFFLE_CARDS_INTO_DECK(store, state, p, discardedPokemon);
      }
    }

    return state;
  }

}
