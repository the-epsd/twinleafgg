import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Doduo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Stab',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
  },
  {
    name: 'Accelerating Stab',
    cost: [C, C],
    damage: 30,
    text: 'Doduo can\'t use Accelerating Stab during your next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Doduo';
  public fullName: string = 'Doduo MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Stab
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage = 10 * results.filter(r => r).length;
      });
    }

    // Accelerating Stab
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Accelerating Stab');
    }

    return state;
  }
}
