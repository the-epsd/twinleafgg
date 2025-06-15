import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

export class BugCatcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNM';
  public setNumber: string = '189';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bug Catcher';
  public fullName: string = 'Bug Catcher UNM';
  public text: string = 'Draw 2 cards. Flip a coin. If heads, draw 2 more cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      // Draw 2 cards
      player.deck.moveTo(player.hand, 2);
      // Flip a coin for 2 more
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          player.deck.moveTo(player.hand, 2);
        }
      });
      return state;
    }
    return state;
  }
}
