import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';

export class Lass extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Lass';

  public fullName: string = 'Lass BS';

  public text: string =
    'You and your opponent show each other your hands, then shuffle all the Trainer cards from your hands into your decks.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.hand.cards.length > 0) {
        return store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          player.hand.cards
        ), () => {

          const playerHandTrainers = player.hand.cards.filter(c => c.superType === SuperType.TRAINER);

          playerHandTrainers.forEach(cards => {
            player.hand.moveCardTo(cards, player.deck);
          });

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);


            if (opponent.hand.cards.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                player.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                opponent.hand.cards
              ), () => {

                const opponentHandTrainers = opponent.hand.cards.filter(c => c.superType === SuperType.TRAINER);

                opponentHandTrainers.forEach(cards => {
                  opponent.hand.moveCardTo(cards, opponent.deck);
                });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
                  opponent.deck.applyOrder(order);
                  return state;

                });
              });

            }
            return state;
          });

        });

      }
      return state;
    }
    return state;
  }
}