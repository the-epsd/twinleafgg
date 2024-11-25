import { Card, ChooseCardsPrompt, GameError, GameLog, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class LostBlender extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '181';

  public name: string = 'Lost Blender';

  public fullName: string = 'Lost Blender LOR';

  public text: string =
    'Put 2 cards from your hand in the Lost Zone. If you do, draw a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.hand.cards.length < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];

      cards = player.hand.cards;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        cards = selected || [];

        // Operation canceled by the user
        if (cards.length === 0) {
          return state;
        }

        player.hand.moveCardsTo(cards, player.lostzone);
        player.deck.moveTo(player.hand, 1);
        player.supporter.moveCardTo(this, player.discard);

        store.log(state, GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
      });
    }
    return state;
  }
}