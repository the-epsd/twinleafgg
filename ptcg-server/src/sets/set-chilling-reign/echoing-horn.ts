import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCardList, StateUtils } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

  if (opponent.discard.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  // Check if bench has open slots
  const openSlots = opponent.bench.filter(b => b.cards.length === 0);
      
  if (openSlots.length === 0) {
    // No open slots, throw error
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    opponent.discard,
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
    opponent.discard.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;

    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });

}
export class EchoingHorn extends TrainerCard {

  public regulationMark = 'E';

  public tags = [CardTag.RAPID_STRIKE];

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = 'Echoing Horn';

  public fullName: string = 'Echoing Horn CRE';

  public text: string =
    'Put a Basic Pokémon from your opponent\'s discard pile onto their Bench.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
