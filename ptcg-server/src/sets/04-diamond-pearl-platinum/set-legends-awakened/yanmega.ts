import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Yanmega extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Yanma';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Sonic Wave',
    cost: [],
    damage: 10,
    text: 'Does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Pursue and Turn',
    cost: [G, G, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If the Defending Pokémon already has 2 or more damage counters on it, this attack does 60 damage plus 20 more damage and switch Yanmega with 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Yanmega';
  public fullName: string = 'Yanmega LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sonic Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const targets = effect.opponent.bench.filter(b => b.cards.length > 0);
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 10, targets);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    // Pursue and Turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.damage >= 20) {
        effect.damage += 20;
        SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
      }
    }

    return state;
  }
}
