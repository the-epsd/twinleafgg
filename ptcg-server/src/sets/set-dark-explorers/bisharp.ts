import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slash',
      cost: [D, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Fury Cutter',
      cost: [D, C, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 more damage. If 2 of them are heads, this attack does 30 more damage. If all of them are heads, this attack does 60 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fury Cutter
    if (WAS_ATTACK_USED(effect, 1, this)) {
      let heads = 0;

      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { heads++; } });

      switch (heads) {
        case 1: effect.damage += 10; break;
        case 2: effect.damage += 30; break;
        case 3: effect.damage += 60; break;
        default: effect.damage += 0; break;
      }
    }

    return state;
  }
}
