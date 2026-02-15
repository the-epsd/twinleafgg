import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Lap Up',
      cost: [C, C],
      damage: 0,
      text: 'Draw 3 cards.'
    },
    {
      name: 'Slam',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: 'x' as 'x',
      text: 'Flip 2 coins. This attack does 50 damage for each heads.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lickitung';
  public fullName: string = 'Lickitung UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Lap Up
    // Ref: AGENTS-patterns.md (Draw 3 cards)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 3);
    }

    // Attack 2: Slam
    // Ref: set-x-and-y/scolipede.ts (Random Peck - multiple coin flips for damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage = 50 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
