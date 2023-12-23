import { Card } from '../../game/store/card/card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Arezu, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 1) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.STAGE_1 || Stage.STAGE_2 },
    { min: 1, max: 3, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);
  player.hand.moveCardTo(self, player.discard);

  if (cards.length > 0) {

    if (cards[0].tags.includes(CardTag.POKEMON_ex)    ||
    cards[0].tags.includes(CardTag.POKEMON_GX) || 
    cards[0].tags.includes(CardTag.POKEMON_EX)) 
    {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    else {

      yield store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        cards
      ), () => next());
    }

    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
    });
  }
}

export class Arezu extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public set2: string = 'lostorigin';
  
  public setNumber: string = '153';

  public name: string = 'Arezu';

  public fullName: string = 'Arezu LOR';

  public text: string =
    'Search your deck for up to 3 Evolution Pokémon that don\'t have a Rule Box, reveal them, and put them into your hand. Then, shuffle your deck. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
