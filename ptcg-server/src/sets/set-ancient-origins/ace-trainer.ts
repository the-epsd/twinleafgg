import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage } from '../../game';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class AceTrainer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Ace Trainer';
  public fullName: string = 'Ace Trainer AOR';

  public text: string =
    'You can play this card only if you have more Prize cards left than your opponent.\n\nEach player shuffles his or her hand into his or her deck. Then, draw 6 cards. Your opponent draws 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      MOVE_CARDS(store, state, player.hand, player.deck, { cards, sourceCard: this });
      MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this });

      store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        DRAW_CARDS(player, 6);
        DRAW_CARDS(opponent, 3);

        CLEAN_UP_SUPPORTER(effect, player);
      });
    }

    return state;
  }

}
