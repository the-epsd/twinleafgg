import { CardList, ChooseCardsPrompt, GameError, GameLog, GameMessage, StateUtils } from '../../game';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_CARDS_FROM_YOUR_HAND } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonLass extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public tags = [CardTag.DELTA_SPECIES];
  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Holon Lass';
  public fullName: string = 'Holon Lass DS';

  public text: string =
    'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nCount the total number of Prize cards left(both yours and your opponent\'s). Look at that many cards from the top of your deck, choose as many Energy cards as you like, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 1);

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const temp = new CardList();

      // Count total Prize cards left
      const totalPrizes = player.getPrizeLeft() + opponent.getPrizeLeft();
      player.deck.moveTo(temp, totalPrizes);

      // Count how many Energy cards are in temp
      const energyCount = temp.cards.filter(card => card.superType === SuperType.ENERGY).length;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: energyCount }
      ), chosenCards => {

        if (chosenCards.length === 0) {
          // No Energy chosen, shuffle all back
          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
          });
          player.supporter.moveCardTo(this, player.discard);
        } else {
          // Move chosen Energy to hand
          chosenCards.forEach(card => {
            temp.moveCardTo(card, player.hand);
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (chosenCards.length > 0) {
            SHOW_CARDS_TO_PLAYER(store, state, opponent, chosenCards);
          }

          player.supporter.moveCardTo(this, player.discard);
          temp.moveTo(player.deck);
        }

        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
