import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class DarkClaw extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DEX';

  public name: string = 'Dark Claw';

  public fullName: string = 'Dark Claw DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public text: string =
    'If this card is attached to a D Pokemon, each of the attacks ' +
    'of that Pokemon does 20 more damage to the Active Pokemon ' +
    '(before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.source.tool === this) {
      const opponent = StateUtils.findOwner(state, effect.target);
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      // Not active Pokemon
      if (opponent.active !== effect.target) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
        effect.damage += 20;
      }
    }

    return state;
  }

}
