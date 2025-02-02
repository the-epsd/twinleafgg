import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card} from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../game/store/state/card-list';
import { StateUtils } from '../../game/store/state-utils';

function* playCard(next: Function, store: StoreLike, state: State,
  self: MortysConviction, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  
  cards = player.hand.cards.filter(c => c !== self);
  if (cards.length < 1) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // prepare card list without Junk Arm
  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter(c => c !== self);

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    handTemp,
    { },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.hand.moveCardsTo(cards, player.discard);

  const opponent = StateUtils.getOpponent(state, player);
  const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
  const cardsToDraw = opponentBenched;

  player.deck.moveTo(player.hand, cardsToDraw);

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  

  return state;
}
export class MortysConviction extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public name: string = 'Morty\'s Conviction';

  public fullName: string = 'Morty\'s Conviction TEF';

  public text: string =
    'You can use this card only if you discard another card from your hand.' +
    '' +
    'Draw a card for each of your opponent\'s Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
