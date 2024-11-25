import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt, PokemonCardList } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  // Check if bench has open slots
  const openSlots = player.bench.filter(b => b.cards.length === 0);

  if (openSlots.length === 0) {
    // No open slots, throw error
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }


  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }


  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;

    state = store.prompt(state, new ConfirmPrompt(
      effect.player.id,
      GameMessage.WANT_TO_USE_ABILITY,
    ), wantToUse => {
      if (wantToUse) {
        if (index === 0 && player.active.cards.length > 0) {
          const activePokemon = player.active;
          activePokemon.clearEffects();
          player.switchPokemon(slots[index]);
        }
      }
    });
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}
export class FurisodeGirl extends TrainerCard {

  public regulationMark = 'F';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Furisode Girl';

  public fullName: string = 'Furisode Girl SIT';

  public text: string =
    'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck. You may switch that Pokémon with your Active Pokémon.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
