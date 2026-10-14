import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameMessage, Player, StateUtils } from '../../../game';
import {
  LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN,
  SELECT_PROMPT_WITH_OPTIONS,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TrickShovel extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Trick Shovel';
  public fullName: string = 'Trick Shovel FLF';
  public text: string =
    "Look at the top card of either player's deck. You may discard that card or return it to the top of the deck.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    return player.deck.cards.length > 0 || opponent.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, [
        {
          message: GameMessage.REVEAL_YOUR_TOP_DECK,
          action: () => LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, player),
        },
        {
          message: GameMessage.REVEAL_OPPONENT_TOP_DECK,
          action: () => LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, opponent),
        },
      ]);
    }

    return state;
  }
}
