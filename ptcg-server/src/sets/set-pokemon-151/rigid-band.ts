import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RigidBand extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '165';

  public name: string = 'Rigid Band';

  public fullName: string = 'Rigid Band MEW';

  public text: string = 'The Stage 1 Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.target.getPokemonCard();

      if (sourceCard?.stage !== Stage.STAGE_1) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (effect.damageReduced) {
        // Damage already reduced, don't reduce again
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      // Check if damage target is owned by this card's owner 
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      if (targetPlayer === player) {
        effect.damage = Math.max(0, effect.damage - 30);
        effect.damageReduced = true;
      }

      return state;
    }
    return state;
  }

}
