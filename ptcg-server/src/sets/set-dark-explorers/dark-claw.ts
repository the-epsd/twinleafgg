import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';


export class DarkClaw extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DEX';

  public name: string = 'Dark Claw';

  public fullName: string = 'Dark Claw DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public text: string =
    'If this card is attached to a [D] Pokemon, each of the attacks ' +
    'of that Pokemon does 20 more damage to the Active Pokemon ' +
    '(before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.source.tools.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const sourcePokemon = effect.source;

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      // Not active Pokemon
      if (opponent.active !== effect.target) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(sourcePokemon);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK) && effect.damage > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
