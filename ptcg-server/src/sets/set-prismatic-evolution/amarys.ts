import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, DRAW_CARDS, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Amarys extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '93';

  public regulationMark = 'H';

  public name: string = 'Amarys';

  public fullName: string = 'Amarys PRE';

  public readonly AMARYS_USED_MARKER = 'AMARYS_USED_MARKER';

  public text: string =
    'Shuffle your hand into your deck. Then, draw 4 cards. If your opponent has 3 or fewer Prize cards remaining, draw 8 cards instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      DRAW_CARDS(effect.player, 4);
      ADD_MARKER(this.AMARYS_USED_MARKER, effect.player, this);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.AMARYS_USED_MARKER, effect.player, this)) {
      const hand = effect.player.hand;
      const discard = effect.player.discard;

      if (hand.cards.length >= 5)
        hand.moveCardsTo(hand.cards, discard)
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.AMARYS_USED_MARKER, this);

    return state;
  }

}
