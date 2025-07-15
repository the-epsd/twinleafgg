import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

export class RustedSword extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public regulationMark = 'D';
  public name: string = 'Rusted Sword';
  public fullName: string = 'Rusted Sword SHF';

  public text: string = 'The attacks of the Zacian V this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.tools.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      // Apply damage increase to only active Pokémon
      if (effect.target !== opponent.active)
        return state;

      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.name === 'Zacian V') {
        effect.damage += 30;
      }
    }

    return state;
  }
}
