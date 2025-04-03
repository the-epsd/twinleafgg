import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

export class StealthyHood extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public name: string = 'Stealthy Hood';
  public fullName: string = 'Stealthy Hood UNB';
  public set: string = 'UNB';
  public setNumber: string = '186';
  public cardImage: string = 'assets/cardback.png';
  public text: string = 'Prevent all effects of your opponent\'s Abilities done to the Pokémon this card is attached to. Remove any such existing effects.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prevent effects of abilities from opponent's Pokemon
    if (effect instanceof EffectOfAbilityEffect && effect.target && effect.target.cards.includes(this)) {

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      effect.target = undefined;

    }
    return state;
  }
}