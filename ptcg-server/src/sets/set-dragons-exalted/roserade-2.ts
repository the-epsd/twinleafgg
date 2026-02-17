import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Roserade2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Crosswise Whip',
      cost: [G],
      damage: 0,
      damageCalculation: 'x' as const,
      text: 'Flip 4 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Poison Point',
      cost: [G, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade DRX 14';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-dragons-exalted/ambipom.ts (multiple coin flips for damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    // Ref: set-dragons-exalted/skuntank.ts (apply Poison to opponent's Active)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
