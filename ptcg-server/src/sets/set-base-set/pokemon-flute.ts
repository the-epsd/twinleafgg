import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { StateUtils, GameError, GameMessage, Card, SuperType, Stage } from '../../game';

export class PokemonFlute extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS'; // Replace with the appropriate set abbreviation

  public name: string = 'Pokemon Flute';

  public fullName: string = 'Pokemon Flute BS'; // Replace with the appropriate set abbreviation

  public cardImage: string = 'assets/cardback.png'; // Replace with the appropriate card image path

  public setNumber: string = '86'; // Replace with the appropriate set number

  public text: string = 'Choose 1 Basic Pokémon card from your opponent\'s discard pile and put it onto his or her Bench. (You can\'t play Pokémon Flute if your opponent\'s Bench is full.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's bench is full
      const openSlots = opponent.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH,
        opponent.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {

        cards = selected || [];

        if (cards.length > 0) {
          const card = cards[0];
          const slot = openSlots[0];
          opponent.discard.moveCardTo(card, slot);
          slot.pokemonPlayedTurn = state.turn;

          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
      });
    }

    return state;
  }
}
