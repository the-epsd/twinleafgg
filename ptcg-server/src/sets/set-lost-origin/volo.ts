import { TrainerCard, TrainerType, State, StoreLike, CardTag, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Volo extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

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
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (bench.length > 0) {
        const pokemonToDiscard = bench[0];

        if (!pokemonToDiscard.cards[0].tags.includes(CardTag.POKEMON_V)) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }

        if (pokemonToDiscard.cards[0].tags.includes(CardTag.POKEMON_V)) {

          const supporterTurn = player.supporterTurn;

          if (supporterTurn > 0) {
            throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
          }
          
          player.hand.moveCardTo(effect.trainerCard, player.supporter);
          // We will discard this card after prompt confirmation
          effect.preventDefault = true;

          const cardsToDiscard = pokemonToDiscard.cards;
          pokemonToDiscard.moveCardsTo(cardsToDiscard, player.discard);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          player.supporterTurn = 1;
        }
      }
    }
    return state;
  }













}

