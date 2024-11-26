import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class BindingMochi extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public regulationMark = 'H';

  public name: string = 'Binding Mochi';

  public fullName: string = 'Binding Mochi SFA';

  public text: string =
    ' If the Pokémon this card is attached to is Poisoned, its attacks deal 40 more damage to your opponent\'s Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (player.active.specialConditions.includes(SpecialCondition.POISONED)) {
        const opponentActive = opponent.active.getPokemonCard();
        if (opponentActive && effect.target.cards.includes(opponentActive)) {
          effect.damage += 40;
        }
      }
    }

    return state;
  }

}
