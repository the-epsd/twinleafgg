import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Colress extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '118';
  public name: string = 'Colress';
  public fullName: string = 'Colress PLS';
  public text: string =
    'Shuffle your hand into your deck. Then, draw a number of cards equal ' +
    "to the number of Benched Pokemon (both yours and your opponent's).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const cards = player.hand.cards.filter((c) => c !== this);
    if (cards.length === 0 && player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cards = player.hand.cards.filter((c) => c !== this);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let benchCount = 0;
      player.bench.forEach((b) => (benchCount += b.cards.length > 0 ? 1 : 0));
      opponent.bench.forEach((b) => (benchCount += b.cards.length > 0 ? 1 : 0));

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        drawCount: benchCount,
        sourceCard: this,
      });
    }

    return state;
  }
}
