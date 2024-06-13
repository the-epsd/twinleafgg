import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class FutureBoosterEnergyCapsule extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ CardTag.FUTURE ];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public set: string = 'PAR';

  public name: string = 'Future Booster Energy Capsule';

  public fullName: string = 'Future Booster Energy Capsule PAR';

  public text: string =
    'The Future Pokémon this card is attached to has no Retreat Cost, and the attacks it uses do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.player.active.tool === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }
      
      if (effect.player.active.futurePokemon()) {
        effect.damage += 20;
      }
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.player.active.futurePokemon()) {
        effect.cost = [];
      }
      return state;
    }
    return state;
  }

}

