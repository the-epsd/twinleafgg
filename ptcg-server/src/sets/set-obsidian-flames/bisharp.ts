import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {COIN_FLIP_PROMPT, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawniard';
  public cardType: CardType = M;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Metal Claw',
      cost: [ M ],
      damage: 20,
      text: ''
    },
    {
      name: 'Fury Cutter',
      cost: [ M, C ],
      damage: 50,
      damageCalculation: '+',
      text: 'Flip 3 coins. If 1 of them is heads, this attack does 20 more damage. If 2 of them are heads, this attack does 60 more damage. If all of them are heads, this attack does 120 more damage.'
    }    
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fury Cutter
    if (WAS_ATTACK_USED(effect, 1, this)){
      let heads = 0;

      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ heads++; } });
      
      switch (heads){
        case 1: effect.damage += 20; break;
        case 2: effect.damage += 60; break;
        case 3: effect.damage += 120; break;
        default : effect.damage += 0; break;
      }
    }
    
    return state;
  }
}
