import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { DRAW_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Judge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '235';

  public regulationMark = 'E';

  public name: string = 'Judge';

  public fullName: string = 'Judge (FST 235)';
  public legacyFullName = 'Judge FST';

  public text: string =
    'Each player shuffles their hand into their deck and draws 4 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cards = player.hand.cards.filter(c => c !== this);

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const playerMoveEffect = new MoveCardsEffect(player.hand, player.deck, { cards, sourceCard: this });
      state = store.reduceEffect(state, playerMoveEffect);

      const opponentMoveEffect = new MoveCardsEffect(opponent.hand, opponent.deck, { sourceCard: this });
      state = store.reduceEffect(state, opponentMoveEffect);

      // opponent shuffle and draw
      if (!opponentMoveEffect.preventDefault) {
        SHUFFLE_DECK(store, state, opponent);
        DRAW_CARDS(opponent, 4);
      }

      // player shuffle and draw
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 4);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
