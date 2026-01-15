import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lunala extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  evolvesFrom = 'Cosmoem';
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Lunar Pain',
    cost: [C, C],
    damage: 0,
    text: 'Double the number of damage counters on each of your opponent\'s Pokémon.'
  },
  {
    name: 'Psychic Shot',
    cost: [P, C, C],
    damage: 130,
    text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lunala';
  public fullName: string = 'Lunala CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      const activeDamageEffect = new PutCountersEffect(effect, opponent.active.damage);
      activeDamageEffect.target = opponent.active;
      store.reduceEffect(state, activeDamageEffect);

      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0) {
          const damageEffect = new PutCountersEffect(effect, bench.damage);
          damageEffect.target = bench;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
    }

    return state;
  }
}
