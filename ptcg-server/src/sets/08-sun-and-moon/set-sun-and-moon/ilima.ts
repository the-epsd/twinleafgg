import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  DRAW_CARDS,
  SHUFFLE_HAND_INTO_DECK_THEN_DRAW,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Ilima extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Ilima';
  public fullName: string = 'Ilima SUM';
  public text: string =
    'Each player shuffles their hand into their deck and flips a coin. If heads, that player draws 6 cards. If tails, they draw 3 cards. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Flip a coin: heads draws 6 cards, tails draws 3 cards
      const flipAndDraw = (target: Player, afterDraw?: () => void) => {
        COIN_FLIP_PROMPT(store, state, target, (heads) => {
          DRAW_CARDS(store, state, target, heads ? 6 : 3);
          afterDraw?.();
        });
      };

      // Player shuffles hand into deck, flips and draws, then the opponent does the same
      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        sourceCard: this,
        resolveDraw: () => {
          flipAndDraw(player, () => {
            SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, opponent, {
              sourceCard: this,
              resolveDraw: () => flipAndDraw(opponent),
            });
          });
        },
      });
    }

    return state;
  }
}
