import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Silvally extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Type: Null';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Avenging Heart',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Prize card your opponent took on their last turn.'
  },
  {
    name: 'Air Slash',
    cost: [C, C, C],
    damage: 120,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '184';
  public name: string = 'Silvally';
  public fullName: string = 'Silvally UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const prizesTaken = opponent.prizesTakenLastTurn;
      effect.damage += prizesTaken * 50;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}

