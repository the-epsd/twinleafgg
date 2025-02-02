import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, CardList } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // if (player.deck.cards.length === 0) {
  //   throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  // }

  const max = player.hand.cards.length;

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.hand,
    { },
    { min: 1, max: max, allowCancel: false }
  ), selected => {
    const selectedLength = selected.length;
    const deckTop = new CardList();

    player.hand.moveCardsTo(selected, deckTop);
    deckTop.moveTo(player.deck);

    player.deck.moveTo(player.hand, selectedLength);
  });
}

export class Caitlin extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Caitlin';

  public fullName: string = 'Caitlin CRE';

  public text: string =
    'Put as many cards from your hand as you like on the bottom of your deck in any order. Then, draw a card for each card you put on the bottom of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
  
    return state;
  }
  
}
  