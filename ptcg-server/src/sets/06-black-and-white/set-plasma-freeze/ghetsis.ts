import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  DRAW_CARDS,
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Ghetsis extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Ghetsis';
  public fullName: string = 'Ghetsis PLF';
  public text: string =
    'Your opponent reveals his or her hand and shuffles all Item cards found there into his or her deck. Then, draw a number of cards equal to the number of Item cards your opponent shuffled into his or her deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      const itemsInHand = opponent.hand.cards.filter(
        (card) => card instanceof TrainerCard && card.trainerType === TrainerType.ITEM,
      );

      MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: itemsInHand });
      SHUFFLE_DECK(store, state, opponent);
      DRAW_CARDS(store, state, player, itemsInHand.length);
    }

    return state;
  }
}
