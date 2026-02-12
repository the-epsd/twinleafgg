import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { CardList, GameMessage, ShuffleDeckPrompt, ChooseCardsPrompt, ShowCardsPrompt, GameLog, StateUtils, GameError, EnergyCard } from '../../game';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class InterviewersQuestions extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Interviewer\'s Questions';
  public fullName: string = 'Interviewer\'s Questions UL';

  public text: string =
    'Look at the top 8 cards of your deck. Choose as many Energy cards as you like, show them to your opponent, and put them into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 8);

      const maxEnergyCards = Math.min(8, temp.cards.filter(c => c instanceof EnergyCard).length);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: maxEnergyCards }
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
          chosenCards.forEach(card => {
            temp.moveCardTo(card, player.hand);
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (chosenCards.length > 0) {
            state = store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              chosenCards), () => state);
          }

          CLEAN_UP_SUPPORTER(effect, player);
          temp.moveTo(player.deck);

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