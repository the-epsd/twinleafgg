import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class FullFaceGuard extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Full Face Guard';

  public fullName: string = 'Full Face Guard EVS';

  public text: string =
    'If the Pokémon this card is attached to has no Abilities, it takes 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);
      if (sourceCard && sourceCard.powers.length === 0) {

        // Check if damage target is owned by this card's owner 
        const targetPlayer = StateUtils.findOwner(state, effect.target);
        if (targetPlayer === player) {
          effect.damage = Math.max(0, effect.damage - 20);
          effect.damageReduced = true;
        }

        return state;
      }
      return state;
    }
    return state;
  }
}

