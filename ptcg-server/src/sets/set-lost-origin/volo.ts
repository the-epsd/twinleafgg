import { TrainerCard, TrainerType, State, StoreLike, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Volo extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '169';

  public name: string = 'Volo';

  public fullName: string = 'Volo LOR';

  public text: string =
    'Discard 1 of your Benched Pokémon V and all attached cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const players = state.players;
      const player = players[0];
      const bench = player.bench;
      if (bench.length > 0) {
        const pokemonToDiscard = bench[0];
        if (pokemonToDiscard.cards[0].tags.includes(CardTag.POKEMON_V)) {
          const cardsToDiscard = pokemonToDiscard.cards;
          pokemonToDiscard.moveCardsTo(cardsToDiscard, player.discard);
        }
      }
    }
    return state;
  }













}

