import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../..';
import { ToolEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ToolJammer extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = 'Tool Jammer';

  public fullName: string = 'Tool Jammer BST';

  public text: string =
    'As long as the Pokémon this card is attached to is in the Active Spot, Pokémon Tools attached to your opponent\'s Active Pokémon have no effect, except for Tool Jammer.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (opponentActivePokemon && opponentActivePokemon.tool) {
        opponentActivePokemon.tool.reduceEffect = () => state;
      }

      return state;
    }
    return state;
  }
}

