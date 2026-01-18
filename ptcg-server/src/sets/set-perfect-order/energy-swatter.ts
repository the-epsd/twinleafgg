import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, ChooseCardsPrompt, ShowCardsPrompt, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';

export class EnergySwatter extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Energy Swatter';
  public fullName: string = 'Energy Swatter M3';
  public text: string = 'Your opponent reveals their hand. Choose an Energy card you find there and put it on the bottom of your opponent\'s deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean | undefined {
    const opponent = StateUtils.getOpponent(state, player);
    if (opponent.hand.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.discard);

      // Reveal opponent's hand
      store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => state);

      // Choose Energy card
      const energyCards = opponent.hand.cards.filter(card => card.superType === SuperType.ENERGY);
      if (energyCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          // Put on bottom of deck
          opponent.hand.moveCardTo(cards[0], opponent.deck);
        }
      });
    }

    return state;
  }
}
