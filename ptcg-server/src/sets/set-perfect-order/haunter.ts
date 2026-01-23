import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gastly';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Haunt',
    cost: [D],
    damage: 0,
    text: 'Put 3 damage counters on your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Haunt - put 3 damage counters (30 damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const putCountersEffect = new PutCountersEffect(effect, 30);
      putCountersEffect.target = opponent.active;
      store.reduceEffect(state, putCountersEffect);
    }

    return state;
  }
}
