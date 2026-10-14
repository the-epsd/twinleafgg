import { TrainerType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, StoreLike, State, TrainerCard, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, COIN_FLIP_PROMPT, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Kahili extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '179';
  public name: string = 'Kahili';
  public fullName: string = 'Kahili LOT';
  public text: string =
    "Draw 2 cards. Then, flip a coin. If heads, if you played this Kahili from your hand, put this card into your hand instead of the discard pile. If you have no cards in your deck, you can't play this card. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Hold this card in the supporter zone so heads can return it to hand instead of the discard pile
      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      DRAW_CARDS(store, state, player, 2);

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          MOVE_CARDS(store, state, player.supporter, player.hand, {
            cards: [effect.trainerCard],
            sourceCard: this,
          });
        }
      });
    }

    return state;
  }
}
