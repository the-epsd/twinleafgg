import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, GameMessage, ShuffleDeckPrompt, ChooseCardsPrompt, ShowCardsPrompt, GameLog, StateUtils } from '../../game';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';

export class EnergyLoto extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public name: string = 'Energy Loto';

  public fullName: string = 'Energy Loto ASR';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal an Energy card you find there and put it into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 7);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1 }
      ), chosenCards => {

        if (chosenCards.length == 0) {
          // No Energy chosen, shuffle all back
          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
          });
          CLEAN_UP_SUPPORTER(effect, player);
        }

        if (chosenCards.length > 0) {
          // Move chosen Energy to hand
          const energyCard = chosenCards[0];
          temp.moveCardTo(energyCard, player.hand);
          CLEAN_UP_SUPPORTER(effect, player);
          temp.moveTo(player.deck);

          chosenCards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (chosenCards.length > 0) {
            state = store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              chosenCards), () => state);
          }
        }
        CLEAN_UP_SUPPORTER(effect, player);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}