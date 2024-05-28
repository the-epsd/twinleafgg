import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt, GameError, GameMessage } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Delinquent, effect: TrainerEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const opponentCards = opponent.hand.cards;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const stadiumCard = StateUtils.getStadiumCard(state);

  if (stadiumCard == undefined) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (stadiumCard !== undefined) {

    // Discard Stadium
    const cardList = StateUtils.findCardList(state, stadiumCard);
    const player = StateUtils.findOwner(state, cardList);
    cardList.moveTo(player.discard);
    return state;
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (opponentCards.length <= 3) {
    opponent.hand.moveCardsTo(opponentCards, opponent.discard);
  }

  if (opponentCards.length > 3) {

    // Set discard amount to reach hand size of 5
    const discardAmount = opponentCards.length - 3;

    // Opponent discards first
    if (opponent.hand.cards.length > 5) {
      store.prompt(state, new ChooseCardsPrompt(
        opponent.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: discardAmount, max: discardAmount, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.supporterTurn = 1;
  }
}

export class Delinquent extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BKT';

  public name: string = 'Delinquent';

  public fullName: string = 'Delinquent BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public text: string =
    'Discard any Stadium card in play. If you do, your opponent discards 3 cards from his or her hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
