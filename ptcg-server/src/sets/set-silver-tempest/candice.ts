import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';

export class Candice extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public set2: string = 'silvertempest';

  public setNumber: string = '152';

  public regulationMark = 'F';

  public name: string = 'Candice';

  public fullName: string = 'Candice SIT';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 7);

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { superType: SuperType.POKEMON, cardType: CardType.WATER } ||
                { superType: SuperType.ENERGY, name : 'Basic Water Energy' },

        { min: 0, max: 7, allowCancel: true }
      ), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.deck);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      });
    }
    return state;
  }

}