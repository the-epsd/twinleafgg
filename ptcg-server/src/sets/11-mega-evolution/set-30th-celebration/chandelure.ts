import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Chandelure extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lampent';
  public hp: number = 140;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Eerie Glow',
    cost: [P, P],
    damage: 130,
    text: 'Your opponent\'s Active Pokémon is now Burned and Confused.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Chandelure';
  public fullName: string = 'Chandelure 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eerie Glow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.addSpecialCondition(SpecialCondition.BURNED);
      opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    return state;
  }
}
