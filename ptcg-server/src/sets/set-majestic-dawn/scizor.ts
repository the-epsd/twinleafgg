import { State, StoreLike } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scyther';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Special Blow',
    cost: [M],
    damage: 30,
    damageCalculation: '+',
    text: 'If the Defending Pokémon has any Special Energy cards attached to it, this attack does 30 damage plus 50 more damage.'
  },
  {
    name: 'X-Scissor',
    cost: [M, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 50 damage plus 40 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.energies.cards.some(c => c.energyType === EnergyType.SPECIAL)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 50);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    return state;
  }
}