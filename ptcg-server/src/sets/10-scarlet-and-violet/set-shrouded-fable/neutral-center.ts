import { StateUtils } from '../../../game/store/state-utils';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { GamePhase, State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class NeutralCenter extends TrainerCard {
  public trainerType = TrainerType.STADIUM;
  public tags = [CardTag.ACE_SPEC];
  public set = 'SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public regulationMark = 'H';
  public name = 'Neutralization Zone';
  public fullName = 'Neutralization Zone SFA';

  public text =
    "Prevent all damage done to Pokémon that don't have a Rule Box (both yours and your opponent's) by attacks from the opponent's Pokémon ex and Pokémon V. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)\n\n" +
    "This card can't be put into your hand or deck from the discard pile. ";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prevent damage from Pokemon V and ex
    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);

      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if ((effect.source.vPokemon() || effect.source.exPokemon()) && !effect.target.hasRuleBox()) {
        effect.preventDefault = true;
      }
      return state;
    }
    return state;
  }
}
