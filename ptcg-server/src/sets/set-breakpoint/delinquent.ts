import { Card, ChooseCardsPrompt, GameError, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Delinquent extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BKP';

  public name: string = 'Delinquent';

  public fullName: string = 'Delinquent BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public text: string =
    'Discard any Stadium card in play. If you do, your opponent discards 3 cards from his or her hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // const opponentCards = opponent.hand.cards;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard == undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(this, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (stadiumCard !== undefined) {
        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
      }

      // Discard 3 cards from opponent's hand

      const opponentCards = opponent.hand.cards.filter(c => c !== this);
      if (opponentCards.length <= 3) {
        opponent.hand.moveTo(opponent.discard);
      }

      if (opponentCards.length > 3) {

        let cards: Card[] = [];

        state = store.prompt(state, new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.hand,
          {},
          { min: 3, max: 3, allowCancel: false }
        ), selected => {
          cards = selected || [];

          opponent.hand.moveCardsTo(cards, opponent.discard);
        });
      }

      player.supporter.moveCardTo(this, player.discard);

    }
    return state;
  }
}
