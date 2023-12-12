import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../..';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ToolJammer extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BST';

  public set2: string = 'battlestyles';

  public setNumber: string = '136';

  public name: string = 'Tool Jammer';

  public fullName: string = 'Tool Jammer BST';

  public text: string =
    'Shuffle up to 2 Single Strike Energy cards from your discard pile into' +
    'your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active;
      if (opponentActivePokemon && opponentActivePokemon.tool) {
        opponentActivePokemon.tool.reduceEffect = () => state;
      }

      return state;
    }
    return state;
  }
}

