import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, CardList, ChooseCardsPrompt } from '../../game';

export class MistysWrath extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Misty\'s Wrath';
  public fullName: string = 'Misty\'s Wrath G1';

  public text: string = 'Look at the top 7 cards of your deck. Choose 2 of those cards and put them into your hand. Discard the rest.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 7);

      const min = player.deck.cards.length > 1 ? Math.min(2, deckTop.cards.length) : 1;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min, max: 2, allowCancel: false }
      ), selected => {
        player.ancientSupporter = true;
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.discard);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      });
    }
    return state;
  }

}
