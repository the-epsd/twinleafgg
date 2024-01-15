import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class DeliveryBox extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'H';

  public set: string = 'SV5K';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public name: string = 'Delivery Box';

  public fullName: string = 'Delivery Box SV5K';

  public text: string =
    'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.' +
'' +
    'Your turn ends.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
      });
    
      if (cards.length > 0) {
        return store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        ), () => {
    
          player.deck.moveCardsTo(cards, player.hand);
    
          player.supporter.moveCardTo(this, player.discard);
    
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);

            const endTurnEffect = new EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
          });
        });
      }
      return state;
    }
    return state;
  }
}