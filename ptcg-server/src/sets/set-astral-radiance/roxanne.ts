import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage } from '../../game';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Roxanne, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const oppPrizes = opponent.getPrizeLeft();

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  if (oppPrizes > 3) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const cards = player.hand.cards.filter(c => c !== self);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const playerMoveEffect = new MoveCardsEffect(player.hand, player.deck, { cards, sourceCard: effect.trainerCard });
  state = store.reduceEffect(state, playerMoveEffect);

  const opponentMoveEffect = new MoveCardsEffect(opponent.hand, opponent.deck, { sourceCard: effect.trainerCard });
  state = store.reduceEffect(state, opponentMoveEffect);

  // opponent shuffle and draw
  if (!opponentMoveEffect.preventDefault) {
    SHUFFLE_DECK(store, state, opponent);
    DRAW_CARDS(opponent, 2);
  }

  // player shuffle and draw
  SHUFFLE_DECK(store, state, player);
  DRAW_CARDS(player, 6);

  CLEAN_UP_SUPPORTER(effect, player);

  return state;
}

export class Roxanne extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '150';

  public regulationMark = 'F';

  public name: string = 'Roxanne';

  public fullName: string = 'Roxanne ASR';

  public text: string =
    `You can use this card only if your opponent has 3 or fewer Prize cards remaining.

Each player shuffles their hand into their deck. Then, you draw 6 cards, and your opponent draws 2 cards.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
