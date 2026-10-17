import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, Player, PokemonCard, StateUtils } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Karen extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'XYP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '177';
  public name: string = 'Karen';
  public fullName: string = 'Karen XYP';
  public text: string =
    'Each player shuffles all Pokémon in his or her discard pile into his or her deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      for (const player of [effect.player, StateUtils.getOpponent(state, effect.player)]) {
        const pokemonCards = player.discard.cards.filter((c) => c instanceof PokemonCard).slice();
        pokemonCards.forEach((card) => {
          MOVE_CARDS(store, state, player.discard, player.deck, {
            cards: [card],
            sourceCard: this,
          });
        });
        if (pokemonCards.length > 0) {
          state = SHUFFLE_DECK(store, state, player);
        }
      }
    }

    return state;
  }
}
